<script setup>
import { ref, defineProps } from "vue";
import { useRoute } from "vue-router";
import ProgressSpinner from "primevue/progressspinner";
import router from "@/router";
import { RouterView } from "vue-router";

defineProps({
  posts: {
    type: Object,
  },
  isLoading: Boolean,
});

const route = useRoute();
const username = route.params.username;

const isModalOpened = ref(false);
const openModal = (postId) => {
  router.push({
    name: "PostModal",
    params: { username, postId },
  });
};

//const username = useRoute().params.username; // ovo ce mi trebati kasnije za edit slika, ali to se nece raditi ovde vec ce imati /edit
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
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
        >
          <!-- Post Item -->
          <div
            @click="openModal(post.id)"
            v-for="post in posts"
            :key="post.id"
            class="relative group"
          >
            <img
              :src="`http://localhost:8080/api/uploads/images/${post.imageUrl}`"
              alt="Post Image"
              class="w-64 h-64 object-cover rounded-lg"
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

    <RouterView v-if="$route.meta.isModal" />
  </template>
</template>
