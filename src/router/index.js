import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/home/HomeView.vue";
import Auth from "@/views/auth/Auth.vue";
import { useAuthStore } from "@/stores/auth";
import UserProfileView from "@/views/profile/UserProfileView.vue";
import PostModal from "@/components/profile/post/PostModal.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Auth,
  },
  {
    path: "/register",
    name: "register",
    component: Auth,
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:username",
    name: "profile",
    component: UserProfileView,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
