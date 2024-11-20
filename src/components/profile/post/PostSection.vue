<script setup>
import { ref, toRef, defineProps } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import PostModal from "./PostModal.vue";

const props = defineProps({
  posts: {
    type: Object,
  },
  user: {
    type: Object,
  },
  isLoading: Boolean,
});

const posts = toRef(props, "posts");

const isModalVisible = ref(false);
const selectedPost = ref(null);

const openModal = (post) => {
  selectedPost.value = post;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const updatePosts = (postId) => {
  const index = posts.value.findIndex((post) => post.id === postId);
  posts.value.splice(index, 1);
  closeModal();
};
</script>

<template>
  <div class="flex justify-center items-center" v-if="isLoading">
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="transparent"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
  </div>

  <template v-else>
    <div class="container mx-auto p-6">
      <div class="flex justify-center">
        <div class="grid grid-cols-3 gap-1 w-full max-w-3xl">
          <!-- Post Item -->
          <div
            v-for="post in posts"
            :key="post.id"
            @click="openModal(post)"
            class="relative group"
          >
            <img
              :src="`http://localhost:8080/api/uploads/images/${post.imageUrl}`"
              alt="Post Image"
              class="w-full h-auto aspect-square object-cover"
            />

            <!-- Heart Icon and Like Count (Hidden initially) -->
            <div
              class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
            >
              <div class="flex items-center">
                <i class="pi pi-heart mr-2 text-xl" />
                <span class="font-semibold">{{ post.numberOfLikes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PostModal
      v-if="isModalVisible"
      :post="selectedPost"
      :user="user"
      @close-modal="closeModal"
      @deleted-post="updatePosts"
    />
  </template>
</template>
