import { defineStore } from "pinia";
import axios from "axios";
import { redirectIfTokenInvalid } from "@/utils/utils";

export const useDataStore = defineStore("data", {
  state: () => ({
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async createCommentForPost(postId, content) {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.post(
          `/api/v1/posts/add-comment/${postId}`,
          { content: content }
        );
      } catch (error) {
        throw new Error(error.response.data);
      }
    },
    async fetchPostByPostId(postId) {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.get(`/api/v1/posts/post/${postId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response.data);
      }
    },
    async fetchComments(postId) {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.get(`/api/v1/posts/comments/${postId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response.data);
      }
    },
  },
});
