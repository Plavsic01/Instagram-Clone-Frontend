<script setup>
import { Avatar } from "primevue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({ followers: Object });
const emit = defineEmits(["close-followers-modal"]);

const closeModal = () => {
  emit("close-followers-modal");
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="fixed inset-0 bg-gray-700 bg-opacity-70 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <!-- Dijalog -->
      <div class="bg-white p-6 rounded-md w-96 space-y-4">
        <!-- Naslov u sredini -->
        <h2 class="text-center text-xl font-semibold">
          {{ followers.type }}
        </h2>

        <!-- Lista korisnika -->
        <div
          v-for="follow in followers.data"
          :key="follow.id"
          class="flex items-center justify-center border-b py-3"
        >
          <!-- Avatar -->
          <Avatar
            :image="`${follow.profilePictureUrl}`"
            shape="circle"
            size="medium"
          />

          <!-- Username i dugme Follow -->
          <div class="flex items-center space-x-4 px-2">
            <h1 class="text-lg">{{ follow.username }}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
