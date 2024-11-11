<script setup>
import { toast } from "@/utils/utils";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import router from "@/router";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const username = ref("");
const password = ref("");

if (localStorage.getItem("token")) {
  router.push("/");
}

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value);
    toast.success("Wohooo!");
    router.push("/");
  } catch (error) {
    toast.error(error.message);
    username.value = "";
    password.value = "";
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-8">
        Instagram
      </h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Username</label
          >
          <input
            type="text"
            id="username"
            v-model="username"
            class="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Username"
            required
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Password"
            required
          />
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log in
          </button>
        </div>

        <!-- Forgot Password Link -->
        <div class="text-center">
          <a href="#" class="text-sm text-blue-500 hover:underline"
            >Forgot password?</a
          >
        </div>
      </form>

      <!-- Sign up link -->
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <RouterLink to="/register" class="text-blue-500 hover:underline"
            >Sign up</RouterLink
          >
        </p>
      </div>
    </div>
  </div>

  <!-- <div>
    <form @submit.prevent="handleLogin">
      <button type="submit">Login</button>
    </form>
    <button @click="logout">Logout</button>
  </div> -->
</template>
