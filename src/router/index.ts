// /router/index.ts

import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import AboutPage from "../pages/AboutPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: MainPage,
    },
    {
      path: "/about",
      component: AboutPage,
    },
  ],
});
