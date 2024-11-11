<script setup>
import { useDataStore } from "@/stores/data";
import Modal from "../UI/Modal.vue";
import { onMounted } from "vue";
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { toast } from "@/utils/utils";

const dataStore = useDataStore();
const authStore = useAuthStore();

const closeModal = () => {
  router.back();
};

const { username, postId } = useRoute().params;
const post = ref({});
const comments = ref([]);
const newComment = ref("");

onMounted(async () => {
  try {
    post.value = await dataStore.fetchPostByPostId(postId);
    comments.value = await dataStore.fetchComments(postId);
  } catch (error) {
    toast.error(error);
  }
});

// Metoda za dodavanje komentara
const addComment = async () => {
  if (newComment.value.trim()) {
    try {
      await dataStore.createCommentForPost(postId, newComment.value);
    } catch (error) {
      toast.error(error);
    }

    comments.value.push({
      username: authStore.currentUsername,
      content: newComment.value,
      profilePictureUrl: authStore.currentUserPhotoUrl,
      // createdAt
    });
    newComment.value = "";
  } else {
    toast.info("Enter your message");
  }
};
</script>

<template>
  <Modal :isOpen="true" @modal-close="closeModal" name="post-modal">
    <template #content>
      <div class="flex max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div class="w-2/3 pr-6">
          <img
            :src="`http://localhost:8080/api/uploads/images/${post.imageUrl}`"
            alt="Image"
            class="w-full h-128 object-cover rounded-lg"
          />
        </div>

        <div class="w-1/3 pl-6 flex flex-col">
          <!-- Username and Post Description Section -->
          <div class="mb-4">
            <div class="flex items-center space-x-4">
              <img
                :src="`${authStore.currentUserPhotoUrl}`"
                alt="User Icon"
                class="w-10 h-10 rounded-full"
              />
              <div>
                <p class="font-semibold text-lg">{{ post.username }}</p>
                <p class="text-sm text-gray-700 font-semibold">
                  {{ post.description }}
                </p>
              </div>
            </div>
          </div>

          <hr />
          <br />

          <!-- Comments Section with Scroll -->
          <h1 v-if="comments.length === 0" class="text-gray-500">
            No Comments Yet!
          </h1>
          <div class="flex-1 overflow-y-auto" style="max-height: 300px">
            <div v-for="comment in comments" :key="comment.id" class="mb-4">
              <div class="flex items-start space-x-4">
                <img
                  :src="`${comment.profilePictureUrl}`"
                  alt="User Icon"
                  class="w-10 h-10 rounded-full"
                />
                <div class="flex-1">
                  <RouterLink
                    :to="`/${comment.username}`"
                    class="font-semibold text-lg"
                    >{{ comment.username }}</RouterLink
                  >
                  <p class="text-sm">{{ comment.content }}</p>
                  <p class="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Comment Input Section -->
          <div class="mt-4 flex items-center space-x-4">
            <input
              v-model="newComment"
              type="text"
              placeholder="Add a comment..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i
              style="cursor: pointer"
              @click="addComment"
              class="pi pi-send text-blue-500"
            />
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
