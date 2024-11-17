<script setup>
import Post from "@/components/profile/post/Post.vue";
import { ref, onMounted } from "vue";
import { toast } from "@/utils/utils";
import { useDataStore } from "@/stores/data";
import ProgressSpinner from "primevue/progressspinner";

const dataStore = useDataStore();

const posts = ref([]);
const page = ref(0);
const size = ref(5);
const loading = ref(false);
const hasMore = ref(true);

const loadPosts = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;

  try {
    const response = await dataStore.fetchPostsCreatedAtDesc(
      page.value,
      size.value
    );
    const newPosts = response.content;

    if (newPosts.length > 0) {
      posts.value.push(...newPosts);
      page.value = ++page.value;
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadPosts();
});

const onScroll = async (event) => {
  const bottom =
    event.target.scrollHeight ===
    event.target.scrollTop + event.target.clientHeight;
  if (bottom) {
    await loadPosts(); // Load more posts when scrolled to the bottom
  }
};
</script>

<template>
  <div @scroll="onScroll" class="post-container">
    <div v-for="post in posts" class="py-3" :key="post.id">
      <Post :post="post" />
    </div>
    <div v-if="loading">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
  </div>
</template>

<style scoped>
.post-container {
  height: 100vh;
  overflow-y: scroll;
}
</style>
