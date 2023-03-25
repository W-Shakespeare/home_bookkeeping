<template>
  <div class="app-main-layout">
    <TheNavbar @onClickNavbar="onChangeNavbar" />
    <TheSidebar v-if="!isMobile" v-model:value="isOpenNavbar" />
    <MobileSidebar
      @onCloseNavbar="isOpenNavbar = false"
      :isOpenNavbar="isOpenNavbar"
    />
    <main :class="['app-content', { full: isMobile || !isOpenNavbar }]">
      <router-view></router-view>
    </main>

    <div class="fixed-action-btn">
      <router-link class="btn-floating btn-large blue" to="/record">
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import TheNavbar from "../components/Navbar.vue";
import TheSidebar from "../components/Sidebar.vue";
import { computed, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import MobileSidebar from "../components/MobileSidebar.vue";

export default {
  components: { TheNavbar, TheSidebar, MobileSidebar },
  setup() {
    let isOpenNavbar = ref(false);
    const onChangeNavbar = () => {
      isOpenNavbar.value = !isOpenNavbar.value;
    };
    const store = useStore();
    const isMobile = computed(() => window.innerWidth <= 768);
    onMounted(() => {
      store.dispatch("currency/getCurrencyPageInfo");
      store.dispatch("categories/getCategories");
      store.dispatch("records/getRecords");
    });

    return {
      isOpenNavbar,
      onChangeNavbar,
      isMobile,
    };
  },
};
</script>
<style lang="scss" scoped>
main {
  min-height: 100vh;
}
</style>
