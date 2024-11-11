<script setup>
import { RouterView } from "vue-router";
import Sidebar from "./components/UI/Sidebar.vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <Sidebar v-if="authStore.currentUsername" />
  <RouterView :key="$route.fullPath" />
</template>
