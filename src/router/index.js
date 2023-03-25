import store from "@/store";
import { createRouter, createWebHistory } from "vue-router";
import CurrencyView from "../views/CurrencyView.vue";
import ProfileView from "../views/ProfileView.vue";
import MainLayout from "../layout/MainLayout.vue";
import CategoriesView from "../views/CategoriesView.vue";
import RecordView from "../views/RecordView.vue";
import PlanningView from "../views/PlanningView.vue";
import HistoryView from "../views/HistoryView.vue";
import DetailView from "../views/DetailView.vue";

const routes = [
  {
    path: "/",
    name: "MainLayout",
    component: MainLayout,
    meta: {
      auth: true,
    },
    children: [
      { path: "/", component: CurrencyView },
      { path: "profile", component: ProfileView },
      {
        path: "history",
        component: HistoryView,
      },
      { path: "/detail/:id", component: DetailView },
      { path: "categories", component: CategoriesView },
      { path: "record", component: RecordView },
      { path: "planning", component: PlanningView },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AuthorizationView.vue"),
    meta: {
      auth: false,
    },
  },
];

export const listRoutes = [
  {
    route: "/",
    title: "Счет",
  },
  {
    route: "/history",
    title: "История",
  },
  {
    route: "/planning",
    title: "Планирование",
  },
  {
    route: "/record",
    title: "Новая запись",
  },
  {
    route: "/categories",
    title: "Категории",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiredAuth = to.meta.auth;
  if (requiredAuth && store.getters["auth/isAuthenticated"]) {
    next();
  } else if (requiredAuth && !store.getters["auth/isAuthenticated"]) {
    next("/login");
  } else {
    next();
  }
});

export default router;
