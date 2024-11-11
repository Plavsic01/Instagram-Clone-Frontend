<script setup>
import Login from "@/components/auth/Login.vue";
import Register from "@/components/auth/Register.vue";
import { useRoute } from "vue-router";

const authPath = useRoute().path;
</script>

<template>
  <Login v-if="authPath === '/login'" />
  <Register v-if="authPath === '/register'" />
</template>
