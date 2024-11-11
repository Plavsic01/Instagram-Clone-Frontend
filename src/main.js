import "./assets/main.css";
import axios from "axios";
import "primeicons/primeicons.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Ripple from "primevue/ripple";
import StyleClass from "primevue/styleclass";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

const token = localStorage.getItem("token");

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
});

app.use(ToastPlugin);
app.directive("ripple", Ripple);
app.directive("styleclass", StyleClass);

app.mount("#app");
