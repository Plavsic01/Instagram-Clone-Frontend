<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import FollowersModal from "./FollowersModal.vue";
import ProfileSection from "./ProfileSection.vue";
import ProfileHeader from "./ProfileHeader.vue";

const emit = defineEmits(["update-posts"]);

const props = defineProps({
  user: Object,
  numberOfPosts: Number,
});

const currUser = ref({});
const isModalVisible = ref(false);
const followers = ref({});

watch(
  () => props.user,
  (newUser) => {
    currUser.value = newUser;
  }
);

const updateCurrUser = (user) => {
  currUser.value = user;
};

const openModal = (data, type) => {
  const followObj = { data, type };
  followers.value = followObj;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const handleImageUploaded = (post) => {
  emit("update-posts", post);
};
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <!-- Profilna slika, korisničko ime i dugmad -->

      <!-- :isFollowing="isFollowing" -->
      <ProfileHeader
        :user="currUser"
        @update-posts="handleImageUploaded"
        @update-followers="updateCurrUser"
      />

      <!-- Drugi red: Broj postova, pratioci, praćeni -->

      <ProfileSection
        :user="currUser"
        :numberOfPosts="numberOfPosts"
        @open-followers-modal="openModal"
      />
    </div>
  </div>

  <FollowersModal
    v-if="isModalVisible"
    :followers="followers"
    @close-followers-modal="closeModal"
  />
</template>
