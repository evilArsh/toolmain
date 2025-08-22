import * as THREE from "three"
import { World } from "./types"
import { CSS2DRenderer, CSS2DObject } from "three/addons"
import { CallBackFn } from "@toolmain/shared"
import { shallowRef } from "vue"

export interface CSS2DObjectOptions {
  id: string
  el: HTMLElement
  target: CSS2DObject
  container: THREE.Mesh
}
export const useCSS2DRenderer = () => {
  const renderer = shallowRef<CSS2DRenderer>()
  const world = shallowRef<World>()
  const renderCallback: Array<{ id: string; render: CallBackFn }> = []
  const objectMap = new Map<string, CSS2DObjectOptions>()
  const render = (delta: number) => {
    if (!world.value) return
    renderer.value?.render(world.value.core.scene, world.value.core.camera)
    renderCallback.forEach(v => v.render(delta))
  }
  function createCube() {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    })
    const cube = new THREE.Mesh(geometry, material)
    return cube
  }
  function add(
    id: string,
    el: HTMLElement,
    callback?: (delta: number, el: HTMLElement, target: CSS2DObject, container: THREE.Mesh) => void
  ) {
    if (!world.value) {
      console.error("[addHTML] world is not initialized")
      return
    }
    if (objectMap.has(id)) {
      console.warn(`[addHTML] ${id} already exists`)
      return
    }
    const cube = createCube()
    const target = new CSS2DObject(el)
    cube.add(target)
    world.value.core.scene.add(cube)
    objectMap.set(id, { id, el, target, container: cube })
    if (callback) {
      renderCallback.push({
        id,
        render: (delta: number) => {
          callback(delta, el, target, cube)
        },
      })
    }
  }
  function remove(id: string) {
    const data = objectMap.get(id)
    if (!data) return
    data.container.clear()
    world.value?.core.scene.remove(data.container)
    renderCallback.splice(
      renderCallback.findIndex(v => v.id === id),
      1
    )
    objectMap.delete(id)
  }
  function dispose() {
    objectMap.keys().forEach(remove)
    renderCallback.length = 0
    objectMap.clear()
  }
  function init(globalWorld: World) {
    if (renderer.value) return
    world.value = globalWorld
    const { width, height } = world.value.core.container.size()
    renderer.value = new CSS2DRenderer()
    renderer.value.setSize(width, height)
    renderer.value.domElement.style.position = "absolute"
    renderer.value.domElement.style.top = "0px"
    renderer.value.domElement.style.pointerEvents = "none"
    world.value.core.container.getEl().appendChild(renderer.value.domElement)
    world.value.core.on("Render", render)
    world.value.core.on("Resize", () => {
      if (!world.value) return
      const { width, height } = world.value.core.container.size()
      renderer.value?.setSize(width, height)
    })
  }
  return {
    init,
    createCube,
    add,
    remove,
    dispose,
  }
}
