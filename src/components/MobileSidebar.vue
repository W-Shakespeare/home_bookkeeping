<template>
  <ul id="slide-out" class="sidenav mobile-sidenav" ref="sidenav">
    <!-- @click="onOpen" -->
    <li v-for="{ route, title } in listRoutes" :key="route">
      <router-link
        @click="onClickLink"
        :to="route"
        :class="{ 'active-link': activeLink == route }"
        >{{ title }}</router-link
      >
    </li>
    <li>
      <router-link
        @click="onClickLink"
        to="/profile"
        :class="{ 'active-link': activeLink == '/profile' }"
      >
        Профиль
      </router-link>
    </li>
    <li>
      <a class="black-text" @click="onLogout"> Выйти </a>
    </li>
  </ul>
  <a href="#" data-target="slide-out" class="sidenav-trigger show-on-large"
    ><i class="material-icons">menu</i></a
  >
</template>
<script>
import { onMounted, ref, toRefs, watch } from "@vue/runtime-core";
import M from "materialize-css/dist/js/materialize.min";
import { listRoutes } from "@/router";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default {
  props: ["isOpenNavbar"],
  emits: ["onCloseNavbar"],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();

    const { isOpenNavbar } = toRefs(props);
    const sidenav = ref(null);
    let instances = null;
    const route = useRoute();

    const setActiveLink = (selectedLink) => {
      activeLink.value = selectedLink;
    };

    watch(route, (newValue) => {
      setActiveLink(newValue.path);
    });

    let activeLink = ref(route.path);

    const onLogout = () => {
      store.dispatch("auth/logout");
      router.push("/login");
    };

    const onClickLink = () => {
      setTimeout(() => {
        emit("onCloseNavbar", false);
      }, 300);
    };

    watch(isOpenNavbar, (newValue) => {
      newValue && instances.open();
      !newValue && instances.close();
    });

    onMounted(() => {
      instances = M.Sidenav.init(sidenav.value);
    });
    const onOpen = () => {
      console.log("open___");
      instances.open();
    };
    return { sidenav, onOpen, listRoutes, onLogout, onClickLink, activeLink };
  },
};
</script>
<style lang="scss" scoped>
.mobile-sidenav {
  padding-top: 104px;
}
.active-link {
  background-color: gainsboro;
}
</style>
