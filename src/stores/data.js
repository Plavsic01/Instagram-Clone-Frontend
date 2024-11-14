import { defineStore } from "pinia";
import axios from "axios";
import { redirectIfTokenInvalid } from "@/utils/utils";

export const useDataStore = defineStore("data", {
  state: () => ({
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async createPost(formData) {
      try {
        const response = await axios.post("/api/v1/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response.data);
      }
    },
    async createCommentForPost(postId, content) {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.post(
          `/api/v1/posts/add-comment/${postId}`,
          { content: content }
        );
        return response.data;
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
    async editComment(commentId, content) {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.put(
          `/api/v1/posts/edit-comment/${commentId}`,
          { content: content }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response.data);
      }
    },
    async removeComment(commentId) {
      try {
        if (redirectIfTokenInvalid()) {
          return;
        }
        const response = await axios.delete(
          `/api/v1/posts/remove-comment/${commentId}`
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response.data);
      }
    },
  },
});
