<template>
  <div class="flex flex-col gap-10px">
    <div>
      <el-button type="primary" @click="open">新增</el-button>
    </div>
    <el-collapse expand-icon-position="left" v-model="lightHandler.collapse">
      <el-collapse-item v-for="light in lights" :key="light.id" :name="light.id">
        <template #title>
          <div class="flex gap-5px items-center">
            <el-button
              :type="light.id === lightHandler.current ? 'primary' : 'default'"
              @click.stop="lightHandler.setCurrent(light.id)">
              {{ light.name }}
            </el-button>
            <el-button type="danger" size="small" plain @click.stop="lightHandler.delete(light.id)"> 删除 </el-button>
          </div>
        </template>
        <div class="flex flex-col gap-10px px-20px">
          <!-- <div>
            <el-radio-group v-model="light.mode" @change="onMetaChange(light)">
              <el-radio-button label="移动" value="translate"></el-radio-button>
              <el-radio-button label="旋转" value="rotate"></el-radio-button>
            </el-radio-group>
          </div> -->
          <el-descriptions :column="2" border>
            <el-descriptions-item label="类型">
              <el-text type="primary">{{ light.type }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="id">
              <el-text type="primary">{{ light.id }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item v-if="light.position" label="位置偏移(x,y,z)" :span="2">
              <div class="w-100% flex-col gap5px">
                <el-input-number
                  v-model="light.position.x"
                  size="small"
                  :precision="2"
                  :step="0.01"
                  @change="onMetaChange(light)"
                  @input="onMetaChange(light)" />
                <el-input-number
                  v-model="light.position.y"
                  size="small"
                  :precision="2"
                  :step="0.01"
                  @change="onMetaChange(light)"
                  @input="onMetaChange(light)" />
                <el-input-number
                  v-model="light.position.z"
                  size="small"
                  :precision="2"
                  :step="0.01"
                  @change="onMetaChange(light)"
                  @input="onMetaChange(light)" />
              </div>
            </el-descriptions-item>
            <el-descriptions-item v-if="light.rotate" label="角度偏移(x,y,z)" :span="2">
              <div class="w-100% flex-col gap5px">
                <el-input-number
                  v-model="light.rotate.x"
                  size="small"
                  :precision="2"
                  :step="0.01"
                  @change="onMetaChange(light)"
                  @input="onMetaChange(light)" />
                <el-input-number
                  v-model="light.rotate.y"
                  size="small"
                  :precision="2"
                  :step="0.01"
                  @change="onMetaChange(light)"
                  @input="onMetaChange(light)" />
                <el-input-number
                  v-model="light.rotate.z"
                  size="small"
                  :precision="2"
                  :step="0.01"
                  @change="onMetaChange(light)"
                  @input="onMetaChange(light)" />
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="是否可见">
              <el-switch v-model="light.visible" @change="onMetaChange(light)"></el-switch>
            </el-descriptions-item>
            <el-descriptions-item label="辅助线">
              <el-switch v-model="light.helper" @change="onMetaChange(light)"></el-switch>
            </el-descriptions-item>
            <!-- <el-descriptions-item label="调试器">
            <el-switch v-model="light.debugger" @change="onMetaChange(light)"></el-switch>
          </el-descriptions-item> -->
            <el-descriptions-item label="阴影">
              <el-switch v-model="light.castShadow" @change="onMetaChange(light)"></el-switch>
            </el-descriptions-item>
            <el-descriptions-item label="颜色color">
              <el-color-picker
                :model-value="
                  isString(light.color) ? light.color : `#${light.color.getHex().toString(16).padStart(6, '0')}`
                "
                @update:model-value="v => (light.color = v ?? '#ffffff')"
                @change="onMetaChange(light)" />
            </el-descriptions-item>
            <el-descriptions-item label="颜色groundColor">
              <el-color-picker
                :model-value="
                  light.groundColor
                    ? isString(light.groundColor)
                      ? light.groundColor
                      : `#${light.groundColor.getHex().toString(16).padStart(6, '0')}`
                    : '#ffffff'
                "
                @update:model-value="v => (light.groundColor = v ?? '#ffffff')"
                @change="onMetaChange(light)" />
            </el-descriptions-item>
            <el-descriptions-item label="强度intensity">
              <el-input-number
                v-model="light.intensity"
                :precision="1"
                :step="0.1"
                @change="onMetaChange(light)"
                @input="onMetaChange(light)" />
            </el-descriptions-item>
            <el-descriptions-item label="衰减decay">
              <el-input-number
                v-model="light.decay"
                :precision="1"
                :step="0.1"
                @change="onMetaChange(light)"
                @input="onMetaChange(light)" />
            </el-descriptions-item>
            <el-descriptions-item label="光线距离distance">
              <el-input-number
                v-model="light.distance"
                :precision="2"
                :step="0.01"
                @change="onMetaChange(light)"
                @input="onMetaChange(light)" />
            </el-descriptions-item>
            <el-descriptions-item label="angle">
              <el-input-number
                v-model="light.angle"
                :precision="2"
                :step="0.01"
                @change="onMetaChange(light)"
                @input="onMetaChange(light)" />
            </el-descriptions-item>
            <el-descriptions-item label="penumbra">
              <el-input-number
                v-model="light.penumbra"
                :precision="1"
                :step="0.1"
                @change="onMetaChange(light)"
                @input="onMetaChange(light)" />
            </el-descriptions-item>
            <el-descriptions-item label="helperSize">
              <el-input-number
                v-model="light.helperSize"
                :precision="1"
                :step="0.1"
                @change="onMetaChange(light)"
                @input="onMetaChange(light)" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog v-on="dlgEvent" v-bind="dlgProps">
      <el-form :model="form.data">
        <el-form-item label="类型">
          <el-radio-group v-model="form.data.type">
            <el-radio-button
              v-for="item in lightHandler.type"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="form.confirm">确定</el-button>
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { LightMeta, LightType, World } from "../three"
import * as THREE from "three"
import useDialog from "./useDialog"
import { uniqueId, toNumber, isString, msg } from "@toolmain/shared"
import { shallowReactive, reactive, toRaw, computed, onMounted } from "vue"
const props = defineProps<{
  world: World
  lights: Array<LightMeta>
}>()
const { dlgProps, dlgEvent, open, close } = useDialog({
  width: 500,
})
const lightHandler = shallowReactive({
  collapse: "",
  current: "",
  type: [
    { label: "环境光", value: LightType.AmbientLight },
    { label: "点光", value: LightType.PointLight },
    { label: "聚光灯", value: LightType.SpotLight },
    { label: "直线光", value: LightType.DirectionalLight },
    { label: "半球光", value: LightType.HemisphereLight },
  ],
  setCurrent: (id: string) => {
    lightHandler.current = id
    lightHandler.collapse = id
    props.lights.forEach(light => {
      light.debugger = light.id === id
      props.world.lights?.update(light)
    })
  },
  delete: (id: string) => {
    props.world.lights?.clear(id)
  },
})
const form = reactive({
  data: {
    id: "",
    type: LightType.PointLight,
    color: "#ffffff",
    position: { x: 0, y: 0, z: 0 },
  } as LightMeta,
  confirm() {
    if (!form.data.type) {
      msg({ code: 400, msg: "请选择灯光类型" })
      return
    }
    form.data.name = lightHandler.type.find(v => v.value === form.data.type)?.label ?? "光源"
    form.data.id = uniqueId()
    form.data.color = "#ffffff"
    form.data.groundColor = "#ffffff"
    form.data.position = { x: 0, y: 0, z: 0 }
    form.data.rotate = { x: 0, y: 0, z: 0 }
    form.data.debugger = true
    form.data.visible = true
    form.data.helper = true
    form.data.helperColor = "#ffffff"
    form.data.helperSize = 3
    form.data.decay = 2
    form.data.intensity = 1
    form.data.distance = 0
    form.data.angle = Math.PI / 2
    props.world.lights?.add(structuredClone(toRaw(form.data)))
    lightHandler.setCurrent(form.data.id)
    close()
  },
})
const lights = computed(() => props.lights)
const common = shallowReactive({
  vector3: new THREE.Vector3(),
})
function onMetaChange(meta: LightMeta) {
  if (meta.position) {
    meta.position = common.vector3
      .set(toNumber(meta.position.x), toNumber(meta.position.y), toNumber(meta.position.z))
      .clone()
  }
  props.world.lights?.update(meta)
}
// const onMetaChange = useThrottleFn(metaChange, 250, true)
function init() {}
onMounted(init)
</script>
<style lang="scss" scoped>
:deep(.el-input-number) {
  width: 100%;
}
</style>
