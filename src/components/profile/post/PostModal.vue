<script setup>
import { Avatar } from "primevue";
import { useDataStore } from "@/stores/data";
import { onMounted } from "vue";
import { ref, defineProps, defineEmits } from "vue";
import { useAuthStore } from "@/stores/auth";
import { toast, timeAgo } from "@/utils/utils";

const dataStore = useDataStore();
const authStore = useAuthStore();

const props = defineProps({ post: Object });
const emit = defineEmits(["close-modal"]);

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

// Metoda za dodavanje komentara
const handleComment = async () => {
  if (newComment.value.trim()) {
    if (!isForEdit.value) {
      // ADD COMMENT
      await addComment();
    } else {
      // UPDATE COMMENT
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
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <!-- Modal Container -->
      <div class="w-full h-[95vh] max-w-7xl bg-white rounded-none flex">
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
          <div class="flex items-center space-x-3">
            <Avatar
              :image="`${authStore.currentUserPhotoUrl}`"
              shape="circle"
              size="large"
            />
            <div>
              <p class="font-bold text-lg">{{ authStore.currentUsername }}</p>
              <p class="font-medium text-sm">{{ props.post.description }}</p>
              <p class="text-sm">{{ timeAgo(props.post.createdAt) }}</p>
            </div>
          </div>

          <!-- Divider -->
          <hr class="border-gray-200 mb-2" />
          <!-- Lista komentara (skroluj ako je puno komentara) -->
          <div class="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[80%] pr-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="pb-1 mb-4 flex justify-between items-start"
            >
              <!-- Komentar sa profilnom ikonom -->
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
                      >{{ comment.username }}</RouterLink
                    >
                    <p class="text-sm break-words max-w-[10rem]">
                      {{ comment.content }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ timeAgo(comment.createdAt) }}
                  </p>
                </div>
              </div>

              <!-- Ikonice za editovanje i brisanje komentara -->
              <div class="flex space-x-3">
                <i
                  v-if="comment.username === authStore.currentUsername"
                  class="pi pi-pencil text-gray-500 hover:text-gray-700 cursor-pointer"
                  style="font-size: 1rem"
                  @click="editCommentHandler(comment.id)"
                ></i>
                <i
                  v-if="comment.username === authStore.currentUsername"
                  class="pi pi-trash text-gray-500 hover:text-gray-700 cursor-pointer"
                  style="font-size: 1rem"
                  @click="removeComment(comment.id)"
                ></i>
              </div>
            </div>
          </div>

          <!-- Input za novi komentar -->
          <textarea
            v-model="newComment"
            class="border p-2 rounded-md w-full"
            placeholder="Write a comment..."
            rows="4"
          ></textarea>

          <!-- Dugme za postavljanje komentara -->
          <button
            @click="handleComment"
            class="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full"
          >
            {{ !isForEdit ? "Post Comment" : "Edit Comment" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
