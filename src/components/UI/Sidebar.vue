<script setup>
import Avatar from "primevue/avatar";
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const user = ref({});

onMounted(async () => {
  user.value = await authStore.fetchUser();
  if (user.value === null) {
    user.value = "";
  }
});
</script>

<template>
  <div class="flex">
    <!-- Sidebar -->
    <div
      class="w-64 bg-white text-black h-screen flex flex-col fixed border-r border-gray-300"
    >
      <div class="p-4 flex justify-between items-center">
        <span class="font-semibold text-2xl">Instagram</span>
      </div>

      <div class="overflow-y-auto">
        <ul class="list-none p-4 m-0">
          <li>
            <RouterLink
              to="/"
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-home mr-2" style="font-size: 1.5rem"></i>
              <span class="font-medium">Home</span>
            </RouterLink>
          </li>
          <li>
            <a
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-search mr-2" style="font-size: 1.5rem"></i>
              <span class="font-medium">Search</span>
            </a>
          </li>
          <li>
            <a
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-users mr-2" style="font-size: 1.5rem"></i>
              <span class="font-medium">Explore</span>
            </a>
          </li>
          <li>
            <a
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-comments mr-2" style="font-size: 1.5rem"></i>
              <span class="font-medium">Messages</span>
            </a>
          </li>
          <li>
            <a
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-heart mr-2" style="font-size: 1.5rem"></i>
              <span class="font-medium">Notifications</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="mt-auto flex items-center p-4 border-gray-300">
        <RouterLink
          :to="`/${authStore.currentUsername}`"
          class="flex items-center gap-2 w-full hover:bg-gray-100 p-2 rounded"
        >
          <Avatar :image="user.profilePictureUrl" shape="circle" />
          <span class="font-bold">{{ authStore.currentUsername }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
