<template>
  <VueNotification />
  <router-view />
</template>

<script>
import VueNotification from "./components/VueNotification.vue";

export default {
  name: "HomePage",
  components: { VueNotification },
  props: {},
  setup() {
    return {};
  },
};
</script>

<style lang="scss">
@import "~materialize-css/dist/css/materialize.min.css";
@import "./assets/index.css"; // a {
.btn {
  color: white !important;
}
.authorization-card {
  max-width: 500px;
  width: 100%;
}
.authorization-page {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: gainsboro;
  padding: 10px;
  .card-title {
    @media (max-width: 500px) {
      font-size: 18px;
    }
  }
}

.app-page {
  position: relative;
  min-height: calc(100vh - 64px);

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 14px;
    form {
      display: flex;
      flex-direction: column;
    }
    h3 {
      font-size: 22px;
    }
    h4 {
      font-size: 20px;
    }
  }
  .my-btn {
    padding: 10px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
