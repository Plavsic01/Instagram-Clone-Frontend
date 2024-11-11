<script setup>
import { redirectIfTokenInvalid } from "@/utils/utils";
import PostSection from "@/components/profile/PostSection.vue";
import ProfileInfo from "@/components/profile/ProfileInfo.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const posts = ref([]);
const user = ref({});

let isLoadingPosts = ref(true);

const username = useRoute().params.username;

// MOVE THIS TO STATE

onMounted(async () => {
  try {
    if (redirectIfTokenInvalid()) {
      return;
    }
    const response = await axios.get(`/api/v1/posts/${username}`);
    posts.value = response.data;
  } catch (error) {
    console.error("Error fetching posts", error);
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
  } finally {
    // isLoadingUser = false;
  }
});
</script>

<template>
  <ProfileInfo :user="user" :numberOfPosts="posts.length" />
  <PostSection :posts="posts" :isLoading="isLoadingPosts" />
</template>
