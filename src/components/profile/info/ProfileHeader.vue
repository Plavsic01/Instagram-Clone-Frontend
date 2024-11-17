<script setup>
import { ref, defineProps, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import PostDialog from "../post/PostDialog.vue";
import Button from "../../ui/button/Button.vue";
import router from "@/router";
import { toast } from "@/utils/utils";

const authStore = useAuthStore();

const emit = defineEmits(["update-posts", "update-followers"]);

const props = defineProps({
  user: Object,
});

const currUser = ref({});
const isFollowing = ref(false);

watch(
  () => props.user,
  (newUser) => {
    currUser.value = newUser;
    isFollowing.value = checkIfFollowing(currUser.value);
  }
);

const checkIfFollowing = () => {
  const index = findIndex(currUser.value);
  if (index !== -1) {
    return true; // following
  }
  return false; // not following
};

const findIndex = (currUser) => {
  return currUser.followers.findIndex(
    (usr) => usr.username === authStore.currentUsername
  );
};

const handleFollowers = (usr, data, type) => {
  if (type === "follow") {
    currUser.value = {
      ...usr,
      followers: [...usr.followers, data],
    };
    isFollowing.value = true;
  } else {
    const index = findIndex(usr);
    if (index !== -1) {
      usr.followers.splice(index, 1);
      isFollowing.value = false;
    }
  }
  emit("update-followers", currUser.value);
};

const handleFollowStatus = async () => {
  try {
    let dataObj = {};
    if (!isFollowing.value) {
      dataObj.data = await authStore.toggleFollowUser(
        currUser.value.id,
        "follow"
      );
      dataObj.type = "follow";
    } else {
      dataObj.data = await authStore.toggleFollowUser(
        currUser.value.id,
        "unfollow"
      );
      dataObj.type = "unfollow";
    }
    handleFollowers(currUser.value, dataObj.data, dataObj.type);
  } catch (error) {
    toast.error(error.message);
  }
};

const handleImageUploaded = (post) => {
  emit("update-posts", post);
};

const logoutHandler = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
  <div
    class="flex flex-col items-center mb-4 space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8 sm:items-center"
  >
    <img
      :src="user.profilePictureUrl"
      alt="Avatar"
      class="w-24 h-24 rounded-full border-2 border-gray-100"
    />

    <div
      class="flex flex-col items-center sm:flex-row sm:items-center sm:gap-4 gap-3"
    >
      <h2 class="text-2xl font-semibold">{{ user.username }}</h2>
      <Button
        v-if="user.username !== authStore.currentUsername"
        class="bg-blue-400 hover:bg-sky-700"
        @click="handleFollowStatus"
        >{{ !isFollowing ? "Follow" : "Unfollow" }}</Button
      >

      <div
        v-if="user.username === authStore.currentUsername"
        class="flex gap-3 flex-col items-center sm:flex-row"
      >
        <PostDialog @post-created="handleImageUploaded" />
        <Button variant="outline">Edit Profile</Button>
        <Button variant="outline" @click="logoutHandler">Logout</Button>
      </div>
    </div>
  </div>
</template>
