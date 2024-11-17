<script setup>
import { ref, toRef, defineProps } from "vue";
import { Avatar } from "primevue";
import { timeAgo } from "@/utils/utils";
import { RouterLink } from "vue-router";
import { toast } from "@/utils/utils";
import { useDataStore } from "@/stores/data";
import PostModal from "./PostModal.vue";

const dataStore = useDataStore();

const props = defineProps({
  post: Object,
});

const post = toRef(props, "post");
const isModalVisible = ref(false);
const selectedPost = ref(null);

const openModal = (post) => {
  selectedPost.value = post;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const toggleLikeHandler = async (id) => {
  let isLiked = null;
  try {
    if (post.value.isLikedByCurrentUser) {
      isLiked = await dataStore.toggleLikePost(id, "unlike-post");
    } else {
      isLiked = await dataStore.toggleLikePost(id, "like-post");
    }
    post.value.isLikedByCurrentUser = isLiked;
    post.value.numberOfLikes = isLiked
      ? ++post.value.numberOfLikes
      : --post.value.numberOfLikes;
  } catch (error) {
    toast.error(error.message);
  }
};
</script>

<template>
  <div
    class="max-w-xl mx-auto border border-gray-200 rounded-lg shadow-md bg-white"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center space-x-3">
        <Avatar
          :image="`${post.profilePictureUrl}`"
          shape="circle"
          size="medium"
        />
        <RouterLink :to="`/${props.post.username}`" class="font-bold text-sm">{{
          props.post.username
        }}</RouterLink>
      </div>
      <i class="pi pi-ellipsis-h cursor-pointer"></i>
    </div>

    <!-- Image -->
    <img
      :src="`http://localhost:8080/api/uploads/images/${props.post.imageUrl}`"
      alt="Post"
      class="w-3/3 object-cover"
    />

    <!-- Actions -->
    <div class="flex items-center justify-between px-4 py-2">
      <div class="flex items-center space-x-4">
        <i
          :style="`${post.isLikedByCurrentUser ? 'color:red' : ''}`"
          :class="`${
            post.isLikedByCurrentUser ? 'pi-heart-fill' : 'pi-heart'
          } pi text-xl cursor-pointer`"
          @click="toggleLikeHandler(post.id)"
        ></i>
        <i
          @click="openModal(post)"
          class="pi pi-comment text-xl cursor-pointer hover:text-gray-500"
        ></i>
        <i class="pi pi-share text-xl cursor-pointer hover:text-gray-500"></i>
      </div>
      <i class="pi pi-bookmark text-xl cursor-pointer hover:text-gray-500"></i>
    </div>

    <!-- Likes -->
    <div class="px-4">
      <p class="font-bold text-sm">
        {{ post.numberOfLikes }}
        {{ post.numberOfLikes === 1 ? "like" : "likes" }}
      </p>
    </div>

    <!-- Description -->
    <div class="px-4 py-2">
      <p>
        <RouterLink :to="`/${props.post.username}`" class="font-bold">{{
          post.username
        }}</RouterLink>
        <span class="px-1">{{ post.description }}</span>
      </p>
    </div>

    <!-- Time Ago -->
    <p class="text-xs text-gray-500 px-4 py-1">{{ timeAgo(post.createdAt) }}</p>
  </div>

  <PostModal
    v-if="isModalVisible"
    :post="selectedPost"
    @close-modal="closeModal"
  />
</template>
