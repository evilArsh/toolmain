<script lang="ts" setup>
import { formatSecond, useShortcut } from "@toolmain/shared"
import { ref, watchEffect } from "vue"
const list = ref<{ key: string; active: boolean; time: string }[]>([])
const timeout = ref(0)
const { listen } = useShortcut()
const { key, trigger } = listen("ctrl+c", async (active, key) => {
  return new Promise(resolve => {
    setTimeout(() => {
      active && list.value.unshift({ key, active, time: formatSecond() })
      resolve()
    }, timeout.value * 1000)
  })
})
const { key: key2 } = listen("ctrl+shift+v", async (active, key) => {
  return new Promise(resolve => {
    setTimeout(() => {
      active && list.value.unshift({ key, active, time: formatSecond() })
      resolve()
    }, timeout.value * 1000)
  })
})

const { listen: listen3 } = useShortcut()
const { key: key3 } = listen3("ctrl+v", async (active, key) => {
  active && list.value.unshift({ key, active, time: formatSecond() })
})

const tempKey = ref("")
const tempObj = ref<{ label: string; value: string }>({ label: "ctrl+b", value: "ctrl+b" })
function onKeyChange() {
  key.value = tempKey.value
}
watchEffect(() => {
  if (tempObj.value) {
    key.value = tempObj.value?.value
  }
})
</script>
<template>
  <el-card class="w-full">
    <template #header>
      <el-text>useShortcut ：{{ key }},{{ key2 }},{{ key3 }}</el-text>
    </template>
    <el-scrollbar height="50rem">
      <div class="flex flex-col justify-end gap-1rem">
        <el-alert v-for="(data, index) in list" :key="index" :description="String(data.active)" type="primary">
          <template #title>
            <el-text type="primary"> {{ data.key }} </el-text>
            <el-text class="ml-1rem!" type="info"> {{ data.time }} </el-text>
          </template>
        </el-alert>
      </div>
    </el-scrollbar>
    <template #footer>
      <div class="flex flex-wrap gap-1rem items-center">
        <el-button @click="list = []">clean</el-button>
        <el-button @click="trigger">trigger</el-button>
        <div class="flex items-center gap-1rem p2px bg-blue">
          <el-input v-model="tempKey"> </el-input>
          <el-button @click="onKeyChange">change</el-button>
        </div>
        <div class="flex items-center gap-2rem p2px bg-blue w-30rem">
          <el-text class="flex-shrink-0"> trigger delay</el-text>
          <el-slider v-model="timeout" :min="0" :max="4" show-stops />
        </div>
      </div>
    </template>
  </el-card>
</template>
<style lang="scss" scoped></style>
