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

export const timeAgo = (dateString) => {
  const now = new Date(); //miliseconds
  const past = new Date(dateString); //miliseconds
  const diffInSeconds = Math.floor((now - past) / 1000); // divide by 1000 to get seconds

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};
