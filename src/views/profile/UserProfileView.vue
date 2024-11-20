<script setup>
import { redirectIfTokenInvalid } from "@/utils/utils";
import PostSection from "@/components/profile/post/PostSection.vue";
import ProfileInfo from "@/components/profile/info/ProfileInfo.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { toast } from "@/utils/utils";

const posts = ref([]);
const user = ref({});

let isLoadingPosts = ref(true);

const username = useRoute().params.username;

const handleUpdatePosts = (post) => {
  posts.value.push(post);
};

// MOVE THIS TO STATE

onMounted(async () => {
  try {
    if (redirectIfTokenInvalid()) {
      return;
    }
    const response = await axios.get(`/api/v1/posts/${username}`);
    posts.value = response.data;
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoadingPosts = false;
  }
});

onMounted(async () => {
  try {
    if (redirectIfTokenInvalid()) {
      return;
    }
    const response = await axios.get(`/api/v1/users/${username}`);
    const userObj = {
      id: response.data.id,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      username: response.data.username,
      email: response.data.email,
      description: response.data.description,
      profilePictureUrl: response.data.profilePictureUrl,
      followers: response.data.followers,
      following: response.data.following,
    };
    user.value = userObj;
  } catch (error) {
    console.error("Error fetching user", error);
    toast.error(error.message);
  }
});
</script>

<template>
  <ProfileInfo
    :user="user"
    :numberOfPosts="posts.length"
    @update-posts="handleUpdatePosts"
  />

  <PostSection :posts="posts" :user="user" :isLoading="isLoadingPosts" />
</template>
