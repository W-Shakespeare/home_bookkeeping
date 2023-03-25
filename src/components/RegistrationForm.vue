<template>
  <div class="authorization-page registration-page empty-layout">
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
        <div class="input-field">
          <input
            id="name"
            type="text"
            class="validate"
            v-model="name"
            @blur="nameBlur"
          />
          <label for="name">Имя</label>
          <small v-if="nameError" class="helper-text invalid">{{
            nameError
          }}</small>
        </div>
        <div class="input-field">
          <input
            id="bill"
            type="number"
            class="validate"
            v-model.number="bill"
            @blur="billBlur"
          />
          <label for="bill">Счет</label>
          <small v-if="billError" class="helper-text invalid">{{
            billError
          }}</small>
        </div>
        <p>
          <label>
            <input type="checkbox" />
            <span>С правилами согласен</span>
          </label>
        </p>
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
  name: "RegistrationForm",
  components: {},
  setup() {
    const { handleSubmit } = useForm();
    const store = useStore();
    const router = useRouter();

    const onSubmit = handleSubmit(async (formValue, { resetForm }) => {
      try {
        await store.dispatch("auth/register", formValue);
        resetForm({ values: { email: "", password: "", name: "" } });
        router.push("/");
      } catch (e) {
        console.log(e);
      }
    });

    const {
      value: email,
      errorMessage: emailError,
      handleChange: emailBlur,
    } = useField("email", yup.string().required(required).email());

    const {
      value: name,
      errorMessage: nameError,
      handleChange: nameBlur,
    } = useField("name", yup.string().required(required));

    const {
      value: password,
      errorMessage: passwordError,
      handleChange: passwordBlur,
    } = useField("password", yup.string().required(required).min(6));

    const {
      value: bill,
      errorMessage: billError,
      handleChange: billBlur,
    } = useField("bill", yup.string().required(required));

    return {
      onSubmit,
      email,
      emailError,
      emailBlur,
      name,
      nameError,
      nameBlur,
      password,
      passwordError,
      passwordBlur,
      bill,
      billError,
      billBlur,
    };
  },
};
</script>

<style lang="scss" scoped>
.registration-page {
  background-color: gainsboro;
}
</style>
