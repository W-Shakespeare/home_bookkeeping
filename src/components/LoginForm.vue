<template>
  <div class="authorization-page empty-layout">
    <form class="card authorization-card" @submit="onSubmit">
      <div class="card-content">
        <span class="card-title">Домашняя бухгалтерия</span>
        <div class="input-field">
          <input
            v-model="email"
            id="email"
            type="text"
            class="validate"
            @blur="emailBlur"
          />
          <label for="email">Email</label>
          <small v-if="emailError" class="helper-text invalid">{{
            emailError
          }}</small>
        </div>
        <div class="input-field">
          <input
            v-model="password"
            id="password"
            type="password"
            class="validate"
            @blur="passwordBlur"
          />
          <label for="password">Пароль</label>
          <small v-if="passwordError" class="helper-text invalid">{{
            passwordError
          }}</small>
        </div>
      </div>
      <slot name="footer"></slot>
    </form>
  </div>
</template>

<script>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const required = "Это поле обязательное";

export default {
  name: "LoginForm",
  components: {},
  setup() {
    const { handleSubmit } = useForm();

    const store = useStore();
    const router = useRouter();

    const onSubmit = handleSubmit(async (formValue, { resetForm }) => {
      await store.dispatch("auth/login", formValue);
      resetForm({ values: { email: "", password: "" } });
      router.push("/");
    });

    const {
      value: email,
      errorMessage: emailError,
      handleChange: emailBlur,
    } = useField("email", yup.string().required(required).email());

    const {
      value: password,
      errorMessage: passwordError,
      handleChange: passwordBlur,
    } = useField("password", yup.string().required(required).min(6));

    return {
      onSubmit,
      email,
      emailError,
      emailBlur,
      password,
      passwordError,
      passwordBlur,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  background-color: gainsboro;
}
.registration-title-divider {
  max-width: 60%;
}
.form-login {
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  background-color: white;
  border: solid 1px lightblue;
}

.v-input-color-error-message {
  color: #b00020;
}
.login-text {
  color: rgb(244, 191, 94);
  cursor: pointer;
}
</style>
