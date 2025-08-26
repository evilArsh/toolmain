<script setup lang="ts">
import { RouterView } from "vue-router"
</script>
<template>
  <RouterView v-slot="{ Component }">
    <transition mode="out-in" appear>
      <component :is="Component" />
    </transition>
  </RouterView>
</template>
