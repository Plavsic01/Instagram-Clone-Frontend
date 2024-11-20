<script setup>
import { Avatar } from "primevue";
import { useDataStore } from "@/stores/data";
import { onMounted } from "vue";
import { ref, toRef, defineProps, defineEmits } from "vue";
import { useAuthStore } from "@/stores/auth";
import { toast, timeAgo } from "@/utils/utils";

const dataStore = useDataStore();
const authStore = useAuthStore();

const props = defineProps({ post: Object, user: Object });
const post = toRef(props, "post");

const emit = defineEmits(["close-modal", "deleted-post"]);

const closeModal = () => {
  emit("close-modal");
};

const comments = ref([]);
const newComment = ref("");
const isForEdit = ref(false);
const commentId = ref(-1);

onMounted(async () => {
  try {
    comments.value = await dataStore.fetchComments(props.post.id);
  } catch (error) {
    if (error.message !== "Comments not found!") {
      toast.error(error.message);
    }
  }
});

const removePost = async (id) => {
  try {
    const response = await dataStore.removePost(id);
    toast.success(response);
    emit("deleted-post", id);
  } catch (error) {
    toast.error(error.message);
  }
};

// Metoda za dodavanje komentara
const handleComment = async () => {
  if (newComment.value.trim()) {
    if (!isForEdit.value) {
      await addComment();
    } else {
      await editComment();
    }
  } else {
    toast.info("Enter your message");
  }
};

const addComment = async () => {
  try {
    const data = await dataStore.createCommentForPost(
      props.post.id,
      newComment.value
    );
    comments.value.push({
      id: data.id,
      username: authStore.currentUsername,
      content: newComment.value,
      profilePictureUrl: authStore.currentUserPhotoUrl,
      createdAt: data.createdAt,
    });
    newComment.value = "";
    toast.success("Comment Successfully Created!");
  } catch (error) {
    toast.error(error.message);
  }
};

const editComment = async () => {
  try {
    const index = getIndexForComment(commentId.value);
    const data = await dataStore.editComment(commentId.value, newComment.value);
    comments.value[index] = {
      ...comments.value[index],
      content: data.content,
      createdAt: data.createdAt,
    };
    toast.success("Successfully Updated Comment!");
  } catch (error) {
    toast.error(error.message);
  } finally {
    newComment.value = "";
    isForEdit.value = false;
  }
};

const editCommentHandler = (id) => {
  const index = getIndexForComment(id);
  newComment.value = comments.value[index].content;
  isForEdit.value = true;
  commentId.value = id;
};

const removeComment = async (id) => {
  try {
    const data = await dataStore.removeComment(id);
    const index = getIndexForComment(id);
    comments.value.splice(index, 1);

    toast.success(data);
  } catch (error) {
    toast.error(error.message);
  }
};

const getIndexForComment = (id) => {
  const index = comments.value.findIndex((comment) => comment.id === id);
  return index;
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
  <div>
    <!-- Modal -->
    <div
      class="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <!-- Modal Container -->
      <div class="w-full h-[95vh] max-w-7xl bg-white flex">
        <!-- Slika Sekcija (2/3 širine) -->
        <div class="w-2/3 h-full relative min-h-full max-h-full bg-gray-100">
          <img
            :src="`http://localhost:8080/api/uploads/images/${props.post.imageUrl}`"
            alt="Image"
            class="object-contain w-full h-full object-center"
          />
        </div>

        <!-- Sekcija za komentare (1/3 širine) -->
        <div class="w-1/3 p-6 flex flex-col space-y-4 overflow-y-auto">
          <!-- Vlasnik objave -->
          <div>
            <!-- Ikonica i korisničko ime na vrhu -->
            <div class="flex items-center space-x-3 mb-2">
              <Avatar
                :image="`${props.user.profilePictureUrl}`"
                shape="circle"
                size="large"
              />

              <p class="font-bold text-sm">{{ props.user.username }}</p>
              <div>
                <i
                  v-if="authStore.currentUsername === props.user.username"
                  class="pi pi-trash text-gray-500 hover:text-gray-700 cursor-pointer"
                  style="font-size: 1rem"
                  @click="removePost(props.post.id)"
                ></i>
              </div>
            </div>

            <!-- Divider -->
            <hr class="border-gray-200 mb-2" />

            <!-- Ikonica, korisničko ime i opis posta -->
            <div class="flex items-center space-x-3">
              <Avatar
                :image="`${props.user.profilePictureUrl}`"
                shape="circle"
                size="large"
              />
              <div class="flex space-x-2 items-center">
                <p class="font-bold text-sm">{{ props.user.username }}</p>
                <p class="text-sm text-gray-700">
                  {{ props.post.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Lista komentara -->
          <div class="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[80%] pr-4">
            <div v-for="comment in comments" :key="comment.id" class="pb-1">
              <!-- Komentar sa profilnom ikonom i username -->
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <Avatar
                    :image="`${comment.profilePictureUrl}`"
                    shape="circle"
                    size="medium"
                  />
                  <div>
                    <div class="flex items-center space-x-2 flex-wrap">
                      <RouterLink
                        class="font-bold text-s"
                        :to="`/${comment.username}`"
                      >
                        {{ comment.username }}
                      </RouterLink>
                    </div>
                    <p class="text-sm break-words max-w-[10rem]">
                      {{ comment.content }}
                    </p>
                  </div>
                </div>

                <!-- Ikonice za editovanje i brisanje komentara -->
                <div
                  class="flex space-x-2"
                  v-if="comment.username === authStore.currentUsername"
                >
                  <i
                    class="pi pi-pencil text-gray-500 hover:text-gray-700 cursor-pointer"
                    style="font-size: 1rem"
                    @click="editCommentHandler(comment.id)"
                  ></i>
                  <i
                    class="pi pi-trash text-gray-500 hover:text-gray-700 cursor-pointer"
                    style="font-size: 1rem"
                    @click="removeComment(comment.id)"
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Input za novi komentar -->
          <div class="relative">
            <!-- Ikonica srca i paragraf za vreme -->
            <div class="flex items-center space-x-2 mb-2">
              <i
                @click="toggleLikeHandler(post.id)"
                :style="`${post.isLikedByCurrentUser ? 'color:red' : ''}`"
                :class="`${
                  post.isLikedByCurrentUser ? 'pi-heart-fill' : 'pi-heart'
                } pi text-xl cursor-pointer`"
              />
              <p class="text-sm font-bold text-gray-700">
                {{ post.numberOfLikes }}
                {{ post.numberOfLikes > 1 ? "likes" : "like" }}
              </p>
            </div>
            <p class="text-xs text-gray-500 mb-2">
              {{ timeAgo(post.createdAt) }}
            </p>

            <!-- Input polje sa dugmetom unutar njega -->
            <div class="relative mb-1">
              <input
                v-model="newComment"
                type="text"
                class="border p-2 rounded-md w-full pr-16"
                placeholder="Write a comment..."
              />
              <button
                v-if="newComment"
                @click="handleComment"
                class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
