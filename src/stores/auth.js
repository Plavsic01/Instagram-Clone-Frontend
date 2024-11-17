import { defineStore } from "pinia";
import axios from "axios";
import { redirectIfTokenInvalid, getInfoFromToken } from "@/utils/utils";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    currentUserPhotoUrl: localStorage.getItem("userPhoto") || null,
  }),
  getters: {
    currentUsername: (state) => {
      if (state.token) {
        const { sub, roles, iat, exp } = getInfoFromToken(state.token);
        return sub;
      }
      return null;
    },
  },
  actions: {
    async login(user, pass) {
      try {
        const response = await axios.post("/api/v1/auth/login", {
          username: user,
          password: pass,
        });

        this.token = response.data.token;
        this.currentUserPhotoUrl = response.data.user.profilePictureUrl;
        localStorage.setItem("token", this.token);
        localStorage.setItem("userPhoto", this.currentUserPhotoUrl);
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } catch (error) {
        throw new Error(error.response.data);
      }
    },
    async register(userForm) {
      try {
        await axios.post("/api/v1/auth/signup", userForm);
      } catch (error) {
        throw new Error(error.response.data);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userPhoto");
      delete axios.defaults.headers.common["Authorization"];
    },

    async fetchUser() {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.get(
          `/api/v1/users/${this.currentUsername}`
        );
        return response.data;
      } catch (error) {
        console.error("Fetch user error:", error);
      }
    },
    async toggleFollowUser(userId, path) {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.post(`/api/v1/users/${path}/${userId}`);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(error.response.data);
      }
    },
    async searchUser(username) {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.get(`/api/v1/users`, {
          params: {
            username: username,
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error(error.response.data);
      }
    },
  },
});
