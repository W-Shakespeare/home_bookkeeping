import { createApp } from "vue";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import "materialize-css/dist/js/materialize.min.js";
import VueNotificationList from "@dafcoe/vue-notification";
import tooltipDirective from "./directives/tooltip.directive";

import Paginate from "vuejs-paginate-next";

initializeApp({
  apiKey: "AIzaSyC_GjpEojcLZVEdriT8JbNyCci8iz6p3yU",
  authDomain: "vue-test-3f540.firebaseapp.com",
  databaseURL: "https://vue-test-3f540-default-rtdb.firebaseio.com",
  projectId: "vue-test-3f540",
  storageBucket: "vue-test-3f540.appspot.com",
  messagingSenderId: "941190933322",
  appId: "1:941190933322:web:bc2cfa5a04177918346fb3",
});

const auth = getAuth();

let app = undefined;

onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(VueNotificationList);
    app.component("VPaginate", Paginate);
    app.directive("tooltip", tooltipDirective);
    app.mount("#app");
  }
  if (user) {
    const name = user.providerData[0].displayName;
    store.commit("auth/setUserName", { name });
    store.commit("auth/setIsAuthenticated", true);
  } else {
    store.commit("auth/setIsAuthenticated", false);
    store.commit("auth/setUserName", { name: null });
  }
});
