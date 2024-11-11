<script setup>
import { defineProps } from "vue";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

const authStore = useAuthStore();

defineProps({
  user: Object,
  numberOfPosts: Number,
});

const logoutHandler = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div class="flex items-center justify-center mb-6 space-x-8">
        <div class="flex items-center gap-4">
          <img
            :src="user.profilePictureUrl"
            alt="Avatar"
            class="w-24 h-24 rounded-full border-2 border-gray-100"
          />

          <div class="flex items-center gap-4">
            <h2 class="text-2xl font-semibold">{{ user.username }}</h2>

            <div
              v-if="user.username === authStore.currentUsername"
              class="flex items-center gap-3"
            >
              <button
                class="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Edit Profile
              </button>
              <button
                @click="logoutHandler"
                class="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Second row: Posts, Followers, Following -->
      <div class="flex justify-center gap-24">
        <div class="text-center">
          <p class="text-lg font-semibold">{{ numberOfPosts }}</p>
          <p class="text-sm text-gray-600">Posts</p>
        </div>
        <div class="text-center">
          <p class="text-lg font-semibold">
            {{ user.followers ? user.followers.length : 0 }}
          </p>
          <p class="text-sm text-gray-600">Followers</p>
        </div>
        <div class="text-center">
          <p class="text-lg font-semibold">
            {{ user.following ? user.following.length : 0 }}
          </p>
          <p class="text-sm text-gray-600">Following</p>
        </div>
      </div>
    </div>
  </div>
</template>
