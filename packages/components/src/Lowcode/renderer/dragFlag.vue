<template>
  <i-ic:outline-control-camera
    class="text-16px cursor-pointer c-red absolute top-0 left-0"
    :id
    @mousedown="onMouseDown"
    @mouseup="onMouseUp">
    >
  </i-ic:outline-control-camera>
</template>
<script lang="ts" setup>
import { ref } from "vue"
defineProps<{ id: string }>()
const emit = defineEmits<{
  (e: "mousedown"): void
  (e: "mouseup"): void
}>()
const isDown = ref(false)
function onMouseDown() {
  isDown.value = true
  emit("mousedown")
  document.addEventListener("mouseup", onMouseUp)
}
function onMouseUp() {
  if (isDown.value) {
    document.removeEventListener("mouseup", onMouseUp)
    isDown.value = false
    emit("mouseup")
  }
}
</script>
