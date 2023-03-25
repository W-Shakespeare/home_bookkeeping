<template>
  <component :is="getCurrentComponent">
    <template #footer>
      <div class="card-action">
        <div>
          <!-- class="btn waves-effect waves-light auth-submit" -->
          <button
            class="btn waves-effect waves-light auth-submit my-btn"
            type="submit"
          >
            {{ isRegister ? "Зарегистироваться" : "Войти" }}
            <i class="material-icons right">send</i>
          </button>
        </div>

        <p class="center card-footer" @click="onSwitchToLogin">
          {{ isRegister ? "Уже есть аккаунт?" : "Хотите зарегистироваться?" }}
        </p>
      </div>
    </template>
  </component>
</template>

<script>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import RegistrationForm from "../components/RegistrationForm.vue";
import LoginForm from "../components/LoginForm.vue";
import { useNotification } from "../hook/useNotification";

export default {
  name: "AuthorizationView",
  components: { RegistrationForm, LoginForm },

  setup() {
    const snackbar = ref(false);
    const { infoNotification, errorNotification } = useNotification();

    const isRegister = ref(false);
    const onSwitchToLogin = () => {
      isRegister.value = !isRegister.value;
    };
    const getCurrentComponent = computed(() =>
      isRegister.value ? "RegistrationForm" : "LoginForm"
    );

    return {
      onSwitchToLogin,
      isRegister,
      getCurrentComponent,
      infoNotification,
      errorNotification,
      snackbar,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-text {
  color: rgb(244, 191, 94);
  cursor: pointer;
}
.sn {
  position: fixed !important;
  width: 100%;
  top: 0px !important;
}
.card-footer {
  margin-top: 15px;
  color: rgb(244, 191, 94);
  cursor: pointer;
}
.my-btn {
  padding: 10px;
  // height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
