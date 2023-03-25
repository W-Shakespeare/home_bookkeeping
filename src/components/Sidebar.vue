<template>
  <ul :class="['sidenav', 'app-sidenav', 'desktop-sidenav', { open: value }]">
    <li v-for="{ route, title } in listRoutes" :key="route">
      <!-- class="waves-effect waves-orange" -->
      <router-link
        :to="route"
        :class="{ 'active-link': activeLink == route }"
        >{{ title }}</router-link
      >
    </li>
  </ul>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { watch } from "@vue/runtime-core";
import { listRoutes } from "@/router";

export default {
  props: ["value"],
  name: "TheSidebar",
  setup() {
    const route = useRoute();
    watch(route, (newValue) => {
      setActiveLink(newValue.path);
    });
    let activeLink = ref(route.path);
    const setActiveLink = (selectedLink) => {
      activeLink.value = selectedLink;
    };

    return {
      listRoutes,
      activeLink,
    };
  },
};
</script>
<style lang="scss" scoped>
.active-link {
  background-color: #febb57;
}
// .desktop-sidenav {
//   @media (max-width: 768px) {
//     display: none;
//   }
// }
</style>
