<script setup>
import Avatar from "primevue/avatar";
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const user = ref({});

const isMobileView = ref(false);
const isBottomNavbar = ref(false);

const iconSize = computed(() => (isMobileView.value ? "1.8rem" : "1.5rem"));

onMounted(async () => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  user.value = await authStore.fetchUser();
  if (user.value === null) {
    user.value = "";
  }
});

const checkScreenSize = () => {
  const width = window.innerWidth;
  isMobileView.value = width < 1290;
  isBottomNavbar.value = width < 948;
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<template>
  <div class="flex">
    <!-- Sidebar (samo za veće ekrane) -->
    <div
      v-if="!isBottomNavbar"
      :class="[
        isMobileView ? 'w-20' : 'w-64',
        'bg-white text-black h-screen flex flex-col fixed border-r border-gray-300 transition-all duration-300',
      ]"
    >
      <div class="p-4 flex justify-between items-center">
        <span v-if="!isMobileView" class="font-semibold text-2xl"
          >Instagram</span
        >
      </div>

      <div class="overflow-y-auto">
        <ul class="list-none p-2">
          <li>
            <RouterLink
              to="/"
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-home mr-2" :style="{ fontSize: iconSize }"></i>
              <span v-if="!isMobileView" class="font-medium">Home</span>
            </RouterLink>
          </li>
          <li>
            <a
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-search mr-2" :style="{ fontSize: iconSize }"></i>
              <span v-if="!isMobileView" class="font-medium">Search</span>
            </a>
          </li>
          <li>
            <a
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-users mr-2" :style="{ fontSize: iconSize }"></i>
              <span v-if="!isMobileView" class="font-medium">Explore</span>
            </a>
          </li>
          <li>
            <a
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i
                class="pi pi-comments mr-2"
                :style="{ fontSize: iconSize }"
              ></i>
              <span v-if="!isMobileView" class="font-medium">Messages</span>
            </a>
          </li>
          <li>
            <a
              v-ripple
              class="flex items-center cursor-pointer p-4 rounded text-black hover:bg-gray-100 duration-150 transition-colors"
            >
              <i class="pi pi-heart mr-2" :style="{ fontSize: iconSize }"></i>
              <span v-if="!isMobileView" class="font-medium"
                >Notifications</span
              >
            </a>
          </li>
        </ul>
      </div>

      <div class="mt-auto flex items-center p-4 border-gray-300">
        <RouterLink
          :to="`/${authStore.currentUsername}`"
          class="flex items-center gap-2 w-full hover:bg-gray-100 p-2 rounded"
        >
          <Avatar
            v-if="!isMobileView"
            :image="user.profilePictureUrl"
            shape="circle"
          />
          <span v-if="!isMobileView" class="font-bold">{{
            authStore.currentUsername
          }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- Horizontal Navbar (samo za manje ekrane) -->
    <div
      v-if="isBottomNavbar"
      class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-2"
      style="z-index: 1000"
    >
      <RouterLink to="/" v-ripple class="flex flex-col items-center text-black">
        <i class="pi pi-home" :style="{ fontSize: '1.8rem' }"></i>
        <span class="text-xs">Home</span>
      </RouterLink>
      <RouterLink
        to="/search"
        v-ripple
        class="flex flex-col items-center text-black"
      >
        <i class="pi pi-search" :style="{ fontSize: '1.8rem' }"></i>
        <span class="text-xs">Search</span>
      </RouterLink>
      <RouterLink
        to="/explore"
        v-ripple
        class="flex flex-col items-center text-black"
      >
        <i class="pi pi-users" :style="{ fontSize: '1.8rem' }"></i>
        <span class="text-xs">Explore</span>
      </RouterLink>
      <RouterLink
        to="/messages"
        v-ripple
        class="flex flex-col items-center text-black"
      >
        <i class="pi pi-comments" :style="{ fontSize: '1.8rem' }"></i>
        <span class="text-xs">Messages</span>
      </RouterLink>
      <RouterLink
        to="/notifications"
        v-ripple
        class="flex flex-col items-center text-black"
      >
        <i class="pi pi-heart" :style="{ fontSize: '1.8rem' }"></i>
        <span class="text-xs">Notifications</span>
      </RouterLink>
    </div>
  </div>
</template>
