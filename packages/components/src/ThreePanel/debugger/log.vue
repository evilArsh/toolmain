<template>
  <div class="flex flex-col gap10px">
    <el-descriptions title="日志操作" :column="3" border>
      <el-descriptions-item label="日志" :span="3">
        <div class="flex flex-col gap-5px w-100%">
          <el-card style="--el-card-padding: 5px">
            <div ref="logScrollRef" class="flex flex-col gap-10px w-100% max-h-500px overflow-auto">
              <div v-for="(item, index) in form.log" :key="index" class="flex flex-1 gap-5px items-start">
                <div class="flex flex-col gap-5px">
                  <div class="flex items-center gap-5px">
                    <i class="i-ep:delete c-red cursor-pointer" @click="hdl.onLogDel(index, 1)"></i>
                    <el-tag v-if="item.code < 200" type="primary">{{ item.code }}</el-tag>
                    <el-tag v-else-if="item.code < 300" type="success">{{ item.code }}</el-tag>
                    <el-tag v-else-if="item.code < 400" type="warning">{{ item.code }}</el-tag>
                    <el-tag v-else-if="item.code <= 600" type="danger">{{ item.code }}</el-tag>
                    <el-tag v-else type="info">{{ item.code }}</el-tag>
                  </div>
                  <div v-if="item.data?.type === 'RendererClick'" class="flex flex-col items-end flex-wrap gap5px">
                    <el-button type="primary" size="small" @click="quickHdl.onTeleport(item.data, 'point')">
                      <template #icon>
                        <el-tooltip content="移动到鼠标指向的点" placement="top-start">
                          <i class="i-ep:info-filled"></i>
                        </el-tooltip>
                      </template>
                      瞬移point
                    </el-button>
                    <el-button type="primary" size="small" @click="quickHdl.onTeleport(item.data, 'position')">
                      <template #icon>
                        <el-tooltip content="移动到对象position位置" placement="top-start">
                          <i class="i-ep:info-filled"></i>
                        </el-tooltip>
                      </template>
                      瞬移position
                    </el-button>
                  </div>
                </div>
                <el-input :model-value="item.msg" class="flex-1" :rows="4" autosize readonly type="textarea"></el-input>
              </div>
            </div>
          </el-card>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script lang="ts" setup>
import { ElDescriptions, ElDescriptionsItem, ElCard, ElButton, ElTooltip, ElInput } from "element-plus"
import { ref, reactive, onMounted } from "vue"
import { World } from "../three"
import { CallBackFn } from "@toolmain/shared"
const props = defineProps<{
  world: World
}>()
const logScrollRef = ref<HTMLDivElement>()
const form = reactive({
  token: "",
  // 随机日志
  rand: {
    code: 0,
    msg: "",
  },
  log: [] as {
    code: number
    msg: string
    data?: { type?: string; data?: unknown }
  }[],
})
const quickHdl = {
  // 瞬移
  onTeleport(data?: { type?: string; data?: unknown }, type?: string) {
    try {
      if (data?.data) {
        const obj: {
          point: number[]
          object: {
            position: number[]
          }
        } = JSON.parse(data.data as string)
        if (type == "point") {
          props.world.bot?.teleport(obj.point[0], obj.point[1], obj.point[2])
        } else if (type == "position") {
          props.world.bot?.teleport(obj.object.position[0], obj.object.position[1], obj.object.position[2])
        }
      }
    } catch (error) {
      props.world.core.emit("Log", { code: 500, msg: `[瞬移出错]${(error as Error).message}` })
    }
  },
}
const hdl = {
  async onReqMenu(done: CallBackFn) {
    props.world.core.emit("Custom", { type: "refresh_menu" })
    setTimeout(done, 1800)
  },
  async onToggleMenu(done: CallBackFn) {
    props.world.core.emit("Custom", { type: "toggle_menu" })
    done()
  },
  onRandomLog() {
    props.world.core.emit("Log", {
      code: form.rand.code,
      msg: form.rand.msg,
    })
  },
  onLogDel(index: number, length?: number) {
    form.log.splice(index, length ?? form.log.length)
  },
}
function init() {
  props.world.core.on("Log", (e: { code: number; msg: string; data?: { type?: string; data?: unknown } }) => {
    form.log.unshift(e)
  })
}
onMounted(init)
</script>
