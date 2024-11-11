<script setup>
import { toast } from "@/utils/utils";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import router from "@/router";

const authStore = useAuthStore();

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  description: "",
  profilePictureUrl: "",
});

const cleanForm = () => {
  form.value.firstName = "";
  form.value.lastName = "";
  form.value.email = "";
  form.value.username = "";
  form.value.password = "";
  form.value.description = "";
  form.value.profilePictureUrl = "";
};

const handleRegister = async () => {
  try {
    await authStore.register(form.value);
    toast.success("Wohooo!");
    router.push("/login");
  } catch (error) {
    cleanForm();
    toast.error(error.message);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <!-- Registracija Card -->
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-8">
        Register
      </h2>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister">
        <!-- First Name -->
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700"
            >First Name</label
          >
          <input
            v-model="form.firstName"
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700"
            >Last Name</label
          >
          <input
            v-model="form.lastName"
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Username -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Username</label
          >
          <input
            v-model="form.username"
            type="text"
            id="username"
            name="username"
            placeholder="Choose a username"
            class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password (8-20 characters)</label
          >
          <input
            v-model="form.password"
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minlength="8"
            maxlength="20"
          />
        </div>

        <!-- Profile Picture URL -->
        <div class="mb-4">
          <label
            for="profilePictureUrl"
            class="block text-sm font-medium text-gray-700"
            >Profile Picture URL</label
          >
          <input
            v-model="form.profilePictureUrl"
            type="url"
            id="profilePictureUrl"
            name="profilePictureUrl"
            placeholder="Enter your profile picture URL"
            class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            v-model="form.description"
            id="description"
            name="description"
            placeholder="Write something about yourself"
            rows="4"
            class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
