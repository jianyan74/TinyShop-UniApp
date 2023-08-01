import { createSSRApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { i18n } from "@/locales";

export function createApp() {
  const app = createSSRApp(App).use(i18n).use(store);
  return { app };
}
