<template>
  <template v-for="item in data" :key="item.id">
    <component
      :is="item.node"
      :data-component-id="item.id"
      :provider
      v-on="item.events"
      v-bind="item.props"
      :model-value="modelValue(item, provider)"
      @update:model-value="(v: unknown) => onUpdateModelValue(v, item, provider)">
      <template v-for="child in item.children" :key="child.id" #[child.slotname]>
        <RecursiveRenderer
          v-for="ch in child.children"
          :provider
          :key="ch.id"
          :data="[ch]"
          :parent-id="ch.id"></RecursiveRenderer>
      </template>
    </component>
  </template>
</template>
<script lang="ts">
export default {
  name: "RecursiveRenderer",
}
</script>
<script lang="ts" setup>
import { modelValue, onUpdateModelValue } from "./useProps"
import { BaseComponent, ComponentProvider } from "../types"
defineProps<{
  data: BaseComponent[]
  parentId: string
  provider: ComponentProvider
}>()
</script>
