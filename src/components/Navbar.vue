<template>
  <nav
    class="navbar orange lighten-1 desktop-navbar"
    @click.prevent="isMobile && $emit('onClickNavbar')"
    isMobile
  >
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="!isMobile && $emit('onClickNavbar')">
          <i class="material-icons black-text mobile">dehaze</i>
        </a>
        <span class="black-text">{{ timeData }}</span>
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a
            class="dropdown-trigger black-text"
            href="#"
            data-target="dropdown"
            ref="dropdown"
          >
            {{ userName }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content dropdown">
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i>Профиль
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a class="black-text" @click="onLogout">
                <i class="material-icons">assignment_return</i>Выйти
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import M from "materialize-css/dist/js/materialize.min";
import { useRouter } from "vue-router";
import { getDate } from "../utils/getDate";
export default {
  emits: ["onClickNavbar"],
  name: "TheNavbar",

  setup() {
    const store = useStore();
    const router = useRouter();
    const userName = computed(() => store.getters["auth/getUserName"]);
    const dropdown = ref(null);
    let timeData = ref(getDate("datetime"));
    let timerId = null;
    let Mdropdown = null;
    const isMobile = computed(() => window.innerWidth <= 768);

    onMounted(() => {
      onUpdateTime();
      Mdropdown = M.Dropdown.init(dropdown.value, { constrainWidth: true });
    });
    onBeforeUnmount(() => {
      if (Mdropdown?.destroy()) Mdropdown.destroy();
      if (timerId) clearInterval(timerId);
    });

    const onUpdateTime = () => {
      timerId = setInterval(() => {
        timeData.value = getDate("datetime");
      }, 1000);
    };

    const onLogout = () => {
      store.dispatch("auth/logout");
      router.push("/login");
    };

    return {
      userName,
      dropdown,
      onLogout,
      timeData,
      isMobile,
    };
  },
};
</script>
<style lang="scss" scoped>
.dropdown {
  min-width: 150px;
}
.mobile {
  @media (max-width: 768px) {
    font-size: 35px;
  }
}
</style>
