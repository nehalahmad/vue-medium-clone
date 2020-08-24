import Vue from "vue";
import VueRouter from "vue-router";

import Feeds from "../views/Feeds.vue";
import AuthGuard from "../AuthGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Feeds",
    component: Feeds,
  },
  {
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    beforeEnter: AuthGuard,
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    beforeEnter: AuthGuard,
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import("../views/Articles/Articles.vue"),
    beforeEnter: AuthGuard,
  },
  {
    path: "/articles/add",
    name: "AddArticle",
    component: () => import("../views/Articles/AddArticle.vue"),
    beforeEnter: AuthGuard,
  },
  {
    path: "/articles/:slug",
    name: "Article",
    component: () => import("../views/Articles/Article.vue"),
    beforeEnter: AuthGuard,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
