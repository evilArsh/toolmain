<template>
  <div class="flex flex-col gap10px">
    <el-descriptions title="资源" :column="1" border>
      <el-descriptions-item label="上传模型">
        <el-upload
          action=""
          accept=".glb,.gltf"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="scene.onFileChange">
          <el-button type="primary"> 上传GLB/GLTF模型 </el-button>
        </el-upload>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="人物配置" :column="2" border>
      <el-descriptions-item label="人物行走">
        <el-radio-group v-model="form.status" @change="bot.onStatusChange">
          <el-radio-button label="空闲" value="idle" />
          <el-radio-button label="跑" value="run" />
          <el-radio-button label="走" value="walk" />
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="人物瞬移(x,y,z)">
        <div class="flex flex-col items-start gap5px">
          <div class="flex gap3px">
            <el-input-number
              v-model="form.position.x"
              style="width: 70px"
              :precision="2"
              :step="0.01"
              :controls="false">
            </el-input-number>
            <el-input-number
              v-model="form.position.y"
              style="width: 70px"
              :precision="2"
              :step="0.01"
              :controls="false">
            </el-input-number>
            <el-input-number
              v-model="form.position.z"
              style="width: 70px"
              :precision="2"
              :step="0.01"
              :controls="false">
            </el-input-number>
          </div>
          <el-button type="warning" @click="bot.onTeleport">瞬移</el-button>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="initPos" :span="2">
        <div class="flex items-start gap5px">
          <div class="flex gap3px">
            <el-input-number
              v-model="form.initPosition.x"
              :precision="2"
              :step="0.01"
              style="width: 70px"
              :controls="false"
              @change="bot.onInitPosChanged">
            </el-input-number>
            <el-input-number
              v-model="form.initPosition.y"
              :precision="2"
              :step="0.01"
              style="width: 70px"
              :controls="false"
              @change="bot.onInitPosChanged">
            </el-input-number>
            <el-input-number
              v-model="form.initPosition.z"
              :precision="2"
              :step="0.01"
              style="width: 70px"
              :controls="false"
              @change="bot.onInitPosChanged">
            </el-input-number>
          </div>
          <el-button type="warning" @click="bot.onResetPos">重置位置</el-button>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="虚拟胶囊体" :span="2">
        <el-descriptions border :column="2">
          <el-descriptions-item label="boxVisible">
            <el-switch v-model="form.virtual.boxVisible" @change="bot.onBoxVisible"></el-switch>
          </el-descriptions-item>
          <el-descriptions-item label="capsuleVisible">
            <el-switch v-model="form.virtual.capsuleVisible" @change="bot.onCapsuleVisible"></el-switch>
          </el-descriptions-item>
          <el-descriptions-item label="gravity">
            <el-input-number v-model="form.virtual.gravity" @change="bot.onG"></el-input-number>
          </el-descriptions-item>
          <el-descriptions-item label="radius">
            <el-input-number
              v-model="form.virtual.radius"
              :precision="2"
              :step="0.01"
              @change="bot.onCapsule"></el-input-number>
          </el-descriptions-item>
          <el-descriptions-item label="start">
            <div class="flex items-start gap5px">
              <div class="flex gap3px">
                <el-input-number
                  v-model="form.virtual.start.x"
                  :precision="2"
                  :step="0.01"
                  style="width: 70px"
                  :controls="false"
                  @change="bot.onCapsule">
                </el-input-number>
                <el-input-number
                  v-model="form.virtual.start.y"
                  :precision="2"
                  :step="0.01"
                  style="width: 70px"
                  :controls="false"
                  @change="bot.onCapsule">
                </el-input-number>
                <el-input-number
                  v-model="form.virtual.start.z"
                  :precision="2"
                  :step="0.01"
                  style="width: 70px"
                  :controls="false"
                  @change="bot.onCapsule">
                </el-input-number>
              </div>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="end">
            <div class="flex items-start gap5px">
              <div class="flex gap3px">
                <el-input-number
                  v-model="form.virtual.end.x"
                  :precision="2"
                  :step="0.01"
                  style="width: 70px"
                  :controls="false"
                  @change="bot.onCapsule">
                </el-input-number>
                <el-input-number
                  v-model="form.virtual.end.y"
                  :precision="2"
                  :step="0.01"
                  style="width: 70px"
                  :controls="false"
                  @change="bot.onCapsule">
                </el-input-number>
                <el-input-number
                  v-model="form.virtual.end.z"
                  :precision="2"
                  :step="0.01"
                  style="width: 70px"
                  :controls="false"
                  @change="bot.onCapsule">
                </el-input-number>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-descriptions-item>
      <!-- <el-descriptions-item label="direction">
        <div class="flex gap3px">
          <el-input-number v-model="form.direction.x" style="width: 70px" readonly :controls="false"> </el-input-number>
          <el-input-number v-model="form.direction.y" style="width: 70px" readonly :controls="false"> </el-input-number>
          <el-input-number v-model="form.direction.z" style="width: 70px" readonly :controls="false"> </el-input-number>
        </div>
      </el-descriptions-item> -->
      <el-descriptions-item label="move" :span="2">
        <el-card class="w100%">
          <el-descriptions border>
            <el-descriptions-item label="forward">
              <span>{{ form.move.forward }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="backward">
              <span>{{ form.move.backward }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="left">
              <span>{{ form.move.left }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="right">
              <span>{{ form.move.right }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="speed">
              <el-input-number
                v-model="form.move.speed"
                style="width: 100%"
                :controls="false"
                @change="bot.onSpeedChange">
              </el-input-number>
            </el-descriptions-item>
            <el-descriptions-item label="jumpHeight">
              <span>{{ form.move.jumpHeight }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="canJump">
              <span>{{ form.move.canJump }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="jumping">
              <span>{{ form.move.jumping }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="onFloor">
              <span>{{ form.move.onFloor }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="场景配置" :column="3" border>
      <el-descriptions-item label="RendererClick事件日志">
        <el-switch v-model="form.clickNotify" @change="scene.onRendererClickEvChange"> </el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="显示bvh">
        <el-switch v-model="form.bvhVisible" @change="scene.onBvhVisible"> </el-switch>
      </el-descriptions-item>
      <el-descriptions-item label="显示bvh helper">
        <el-switch v-model="form.bvhHelperVisible" @change="scene.onBvhHelperVisible"> </el-switch>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script lang="ts" setup>
import {
  ElRadioButton,
  ElRadioGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElButton,
  ElSwitch,
  ElInputNumber,
  ElUpload,
} from "element-plus"
import { UploadFile } from "element-plus"
import { World } from "../three"
import { useThrottleFn } from "@vueuse/core"
import { reactive, onMounted, computed } from "vue"

const props = defineProps<{
  world: World
}>()
const world = computed(() => props.world)
const form = reactive({
  position: { x: 0, y: 0, z: 0 },
  initPosition: { x: 0, y: 0, z: 0 },
  // velocity: { x: 0, y: 0, z: 0 },
  // direction: { x: 0, y: 0, z: 0 },
  move: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 0, // 移动速度
    jumpHeight: 0, // 跳跃高度
    canJump: true,
    jumping: false,
    onFloor: true,
  },
  status: "",
  clickNotify: false,
  bvhVisible: false,
  bvhHelperVisible: false,
  // 虚拟碰撞胶囊体
  virtual: {
    boxVisible: false,
    capsuleVisible: false,
    gravity: 0,
    radius: 0,
    start: { x: 0, y: 0, z: 0 },
    end: { x: 0, y: 0, z: 0 },
  },
})
const bot = {
  onInitPosChanged() {
    if (world.value.bot) {
      world.value.bot.initPosition.copy(form.initPosition)
    }
  },
  // 重置位置
  onResetPos() {
    world.value.bot?.collider?.reset()
  },
  // 速度改变
  onSpeedChange() {
    if (world.value.bot) {
      world.value.bot.move.speed = form.move.speed
    }
  },
  // 行走状态改变
  onStatusChange() {
    if (form.status === "idle") {
      world.value.bot?.idle()
    } else if (form.status === "run") {
      world.value.bot?.run()
    } else if (form.status === "walk") {
      world.value.bot?.walk()
    }
  },
  onCollosionChange() {},
  // 人物瞬移
  onTeleport() {
    // world.value.bot?.move.position.set(form.position.x, form.position.y, form.position.z)
    world.value.bot?.teleport(form.position.x, form.position.y, form.position.z)
  },
  // 虚拟胶囊体
  onBoxVisible() {
    if (world.value.bot) {
      const boxHelper = world.value.bot.collider?.getTempBoxHelper()
      if (boxHelper) {
        boxHelper.visible = form.virtual.boxVisible
      }
    }
  },
  // 虚拟胶囊体2
  onCapsuleVisible() {
    if (world.value.bot) {
      const capsuleVirtual = world.value.bot.collider?.getPlayer()
      if (capsuleVirtual) {
        capsuleVirtual.visible = form.virtual.capsuleVisible
      }
    }
  },
  onG() {
    if (world.value.bot) {
      world.value.bot.collider?.setGravity(form.virtual.gravity)
    }
  },
  onCapsule() {
    if (world.value.bot) {
      world.value.bot.collider?.setGravity(form.virtual.gravity)
      world.value.bot.collider?.setCapsule(form.virtual.radius, form.virtual.start, form.virtual.end)
    }
  },
}
const scene = {
  onRendererClickEvChange() {
    world.value.scene?.setClickNotify(form.clickNotify)
  },
  onBvhVisible() {
    if (world.value.scene?.bvh) {
      world.value.scene.bvh.visible = !world.value.scene.bvh.visible
    }
  },
  onBvhHelperVisible() {
    // if (world.value.scene?.bvhHelper) {
    //   world.value.scene.bvhHelper.visible = !world.value.scene.bvhHelper.visible
    // }
  },
  onFileChange(file?: UploadFile) {
    if (!file?.raw) return
    world.value.scene?.dispose()
    const url = URL.createObjectURL(file.raw)
    world.value.scene?.load(url)
  },
}
function init() {
  form.clickNotify = world.value.scene?.clickNotify ?? false
  world.value.core.on(
    "Render",
    useThrottleFn((_delta: number) => {
      Object.assign(form.move, world.value.bot?.move)
      Object.assign(form.initPosition, world.value.bot?.initPosition)
      form.bvhVisible = !!world.value.scene?.bvh?.visible
      // form.bvhHelperVisible = !!world.value.scene?.bvhHelper?.visible

      form.virtual.boxVisible = !!world.value.bot?.collider?.getTempBoxHelper()?.visible
      form.virtual.capsuleVisible = !!world.value.bot?.collider?.getPlayer()?.visible
      form.virtual.gravity = world.value.bot?.collider?.getGravity() ?? 0
      form.virtual.radius = world.value.bot?.collider?.getCapsule().radius ?? 0
      form.virtual.start = world.value.bot?.collider?.getCapsule().segment.start ?? { x: 0, y: 0, z: 0 }
      form.virtual.end = world.value.bot?.collider?.getCapsule().segment.end ?? { x: 0, y: 0, z: 0 }
    }, 100)
  )
}
onMounted(init)
</script>
