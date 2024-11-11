import axios from "axios";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import router from "@/router";

export const toast = useToast({ position: "top", duration: 2000 });

/*
  I'm using localStorage.getItem() instead of this.token
  because if user does not refresh the page
  it will still show that token exists even though it was deleted from local storage
*/

export const redirectIfTokenInvalid = () => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    toast.error("TOKEN HAS EXPIRED!");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
    return true;
  }
  return false;
};

export const getInfoFromToken = (token) => {
  const tokenArray = token.split(".");
  const { sub, roles, iat, exp } = JSON.parse(atob(tokenArray[1]));
  return { sub, roles, iat, exp };
};

export const isTokenExpired = (token) => {
  const { exp } = getInfoFromToken(token);
  const currTime = Date.now();

  const expInMiliseconds = exp * 1000;

  if (currTime >= expInMiliseconds) {
    // token has expired!
    return true;
  }
  return false;
};
