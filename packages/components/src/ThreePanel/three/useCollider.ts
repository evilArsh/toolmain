import * as THREE from "three"
import { Bot, BotActionName } from "./bot"
import { MeshBVH } from "three-mesh-bvh"
import { RoundedBoxGeometry } from "three/addons"

export function useCollider(bot: Bot) {
  let gravity = -30.0
  const velocity = new THREE.Vector3()
  const tempVector = new THREE.Vector3()
  const tempVector2 = new THREE.Vector3()
  const tempBox = new THREE.Box3()
  const tempBoxHelper = new THREE.Box3Helper(tempBox, 0xff0000)
  const tempMat = new THREE.Matrix4()
  const tempSegment = new THREE.Line3()
  const upVector = new THREE.Vector3(0, 1, 0)
  let player: THREE.Mesh<RoundedBoxGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>
  const capsule = {
    radius: 0.5,
    segment: new THREE.Line3(
      new THREE.Vector3(0, 0, 0.0),
      new THREE.Vector3(0, -1.0, 0.0)
      //
    ),
  }
  const getSpeed = (): number => {
    switch (bot.move.status) {
      case BotActionName.WALK:
        return bot.move.speed
      case BotActionName.RUN:
        return bot.move.speed * 1.8
      case BotActionName.IDLE:
      default:
        return 0
    }
  }
  function init() {
    bot.core.scene.add(tempBoxHelper)
    player = new THREE.Mesh(new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5), new THREE.MeshStandardMaterial())
    player.material.wireframe = true
    player.material.opacity = 0.5
    player.material.transparent = true
    player.geometry.translate(0, -0.5, 0)
    bot.core.scene.add(player)
    player.visible = false
    tempBoxHelper.visible = false
  }

  function update(delta: number) {
    tempBoxHelper.updateMatrixWorld()
    if (!bot.core.world.scene?.bvh) return
    if (!bot.model?.scene) return
    if (!player) return
    const geometry = bot.core.world.scene.bvh.geometry as THREE.BufferGeometry<THREE.NormalBufferAttributes> & {
      boundsTree: MeshBVH
    }
    const collider = bot.core.world.scene.bvh
    if (bot.move.onFloor) {
      velocity.y = delta * gravity
    } else {
      velocity.y += delta * gravity
    }
    player.position.addScaledVector(velocity, delta)
    // move the player
    const angle = bot.core.orbitCtrls.getAzimuthalAngle()
    if (bot.move.forward) {
      tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle)
      player.position.addScaledVector(tempVector, getSpeed() * delta)
    }
    if (bot.move.backward) {
      tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle)
      player.position.addScaledVector(tempVector, getSpeed() * delta)
    }
    if (bot.move.left) {
      tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle)
      player.position.addScaledVector(tempVector, getSpeed() * delta)
    }
    if (bot.move.right) {
      tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle)
      player.position.addScaledVector(tempVector, bot.move.speed * delta)
    }
    if (bot.move.forward || bot.move.backward || bot.move.right || bot.move.left) {
      // calculate the relative rotation angle of the character relative to the camera
      const forward = bot.move.forward ? 1 : bot.move.backward ? -1 : 0
      const right = bot.move.right ? 1 : bot.move.left ? -1 : 0
      // const botRotation =
      //   ((forward >= 0 ? 0 : -Math.PI * (right ? right : 1)) + (-Math.PI * right) / 2) / (forward && right ? 2 : 1)
      const botRotation =
        ((forward <= 0 ? 0 : Math.PI * (right ? right : 1)) + (Math.PI * right) / 2) / (forward && right ? 2 : 1)
      player.rotation.y = angle + botRotation
      if (bot.model) {
        bot.model.scene.rotation.y = angle + botRotation
      }
    }
    player.updateMatrixWorld()
    // adjust player position based on collisions
    tempBox.makeEmpty()
    // get bvh world matrix and calculate its inverse matrix, which is used to convert from world to local coordinates
    tempMat.copy(collider.matrixWorld).invert()
    tempSegment.copy(capsule.segment)
    // get the position of the capsule in the local space of the collider
    tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
    tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
    // get the axis aligned bounding box of the capsule
    tempBox.expandByPoint(tempSegment.start)
    tempBox.expandByPoint(tempSegment.end)
    tempBox.min.addScalar(-capsule.radius)
    tempBox.max.addScalar(capsule.radius)
    geometry.boundsTree.shapecast({
      intersectsBounds: box => box.intersectsBox(tempBox),
      intersectsTriangle: tri => {
        // check if the triangle is intersecting the capsule and adjust the
        // capsule position if it is.
        const triPoint = tempVector
        const capsulePoint = tempVector2
        const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint)
        if (distance < capsule.radius) {
          const depth = capsule.radius - distance
          const direction = capsulePoint.sub(triPoint).normalize()
          tempSegment.start.addScaledVector(direction, depth)
          tempSegment.end.addScaledVector(direction, depth)
        }
      },
    })
    // get the adjusted position of the capsule collider in world space after checking
    // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
    // the origin of the player model.
    const newPosition = tempVector
    newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)
    // check how much the collider was moved
    const deltaVector = tempVector2
    deltaVector.subVectors(newPosition, player.position)
    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    bot.move.onFloor = deltaVector.y > Math.abs(delta * velocity.y * 0.25)
    const offset = Math.max(0.0, deltaVector.length() - 1e-5)
    deltaVector.normalize().multiplyScalar(offset)
    // adjust the player model
    player.position.add(deltaVector)
    if (!bot.move.onFloor) {
      deltaVector.normalize()
      velocity.addScaledVector(deltaVector, -deltaVector.dot(velocity))
    } else {
      velocity.set(0, 0, 0)
    }
    // adjust the camera
    bot.core.camera.position.sub(bot.core.orbitCtrls.target)
    bot.core.orbitCtrls.target.copy(player.position)
    bot.core.camera.position.add(player.position)
    if (bot.model) {
      bot.model.scene.position.copy(
        player.position.clone().sub({
          x: 0,
          y: 1.5,
          z: 0,
        })
      )
    }
    // if the player has fallen too far below the level reset their position to the start
    if (player.position.y < -25) {
      reset()
    }
  }
  function teleport(x: number, y: number, z: number) {
    player.position.set(x, y + 1.5, z)
  }
  function getPlayer() {
    return player
  }
  /**
   * reset config
   */
  function reset() {
    velocity.set(0, 0, 0)
    if (!bot.model?.scene) return
    if (!player) return
    const camera = bot.core.camera
    const controls = bot.core.orbitCtrls
    player.position.copy(bot.initPosition)
    camera.position.addVectors(bot.initPosition, {
      x: 0,
      y: Math.PI,
      z: Math.PI * 0.48,
    })
    controls.target.copy(player.position)
    camera.updateProjectionMatrix()
    player.updateMatrixWorld()
  }
  function jump() {
    velocity.y = bot.move.jumpHeight
  }
  function getCapsule() {
    return capsule
  }
  function getTempBoxHelper() {
    return tempBoxHelper
  }
  function getGravity() {
    return gravity
  }
  function setGravity(value: number) {
    gravity = value
  }
  function setCapsule(raduis: number, start: THREE.Vector3Like, end: THREE.Vector3Like) {
    capsule.radius = raduis
    capsule.segment.start.copy(start)
    capsule.segment.end.copy(end)
  }
  return {
    teleport,
    getPlayer,
    update,
    init,
    jump,
    reset,
    getCapsule,
    getTempBoxHelper,
    getGravity,
    setGravity,
    setCapsule,
  }
}
