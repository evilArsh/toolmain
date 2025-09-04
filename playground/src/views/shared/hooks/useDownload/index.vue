<script lang="ts" setup>
import { useDownload, useShiki } from "@toolmain/shared"
import { ref } from "vue"

const { downloadCode } = useDownload()
const shiki = useShiki()
const node = ref<string>()
const code = `function useDownload() {
  function downloadCode(code: string, lang: string, filename: string) {
    const fileName = \`\${filename}.\${lang}\`
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }
  return { downloadCode }
}
`
shiki.codeToHtml(code, "ts").then(res => {
  node.value = res
})
</script>
<template>
  <el-card class="w-full">
    <template #header>
      <el-text>useDownload</el-text>
    </template>
    <div class="text-1.4rem" v-html="node"></div>
    <template #footer>
      <el-button @click="downloadCode(code, 'ts', 'useDownload')">download</el-button>
    </template>
  </el-card>
</template>
<style lang="scss" scoped></style>
