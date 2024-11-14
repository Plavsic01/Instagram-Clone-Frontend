<script setup>
import { defineProps, defineEmits, computed } from "vue";

const emit = defineEmits(["open-followers-modal"]);

const props = defineProps({
  user: Object,
  numberOfPosts: Number,
});

const fullName = computed(() => {
  return `${props.user.firstName} ${props.user.lastName}`;
});

const openModal = (data, type) => {
  emit("open-followers-modal", data, type);
};
</script>

<template>
  <div class="flex justify-center gap-12 sm:gap-12 xs:gap-2">
    <div class="text-center">
      <p class="text-lg font-semibold">{{ numberOfPosts }}</p>
      <p class="text-sm text-gray-600">Posts</p>
    </div>
    <div class="text-center">
      <p
        @click="openModal(user.followers, 'Followers')"
        class="text-lg font-semibold"
      >
        {{ user.followers ? user.followers.length : 0 }}
      </p>
      <p class="text-sm text-gray-600">Followers</p>
    </div>
    <div class="text-center">
      <p
        @click="openModal(user.following, 'Following')"
        class="text-lg font-semibold"
      >
        {{ user.following ? user.following.length : 0 }}
      </p>
      <p class="text-sm text-gray-600">Following</p>
    </div>
  </div>
  <div class="mt-4 text-left">
    <p class="text-md font-semibold">{{ fullName || "Full Name" }}</p>
    <p class="text-sm text-gray-600 mt-1">
      {{ user.description || "User's bio" }}
    </p>
  </div>
</template>
