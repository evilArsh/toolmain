<script setup lang="ts">
import { RouterView } from "vue-router"
</script>
<template>
  <router-view v-slot="{ Component }">
    <transition name="slide">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
