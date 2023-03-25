<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>Профиль</h3>
      </div>

      <form @submit="onSubmit">
        <div>
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
        </div>
        <div class="card-action">
          <div>
            <button
              class="btn waves-effect waves-light auth-submit"
              type="submit"
            >
              Обновить
              <i class="material-icons right">send</i>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { onMounted } from "@vue/runtime-core";

export default {
  name: "RegistrationForm",
  components: {},
  setup() {
    const { handleSubmit } = useForm();
    const store = useStore();
    const router = useRouter();

    const onSubmit = handleSubmit(async (formValue, { resetForm }) => {
      try {
        await store.dispatch("auth/updateUser", formValue);
        resetForm({ values: { email: "", password: "", name: "" } });
        router.push("/");
      } catch (e) {
        console.log(e);
      }
    });
    onMounted(() => {
      store.commit(
        "notification/setInfoNotification",
        "Для смены профиля нужно, чтобы вы недавно зашли, если не получиться обновить, вылогинтесь и залоинтесь снова"
      );
    });

    const {
      value: email,
      errorMessage: emailError,
      handleChange: emailBlur,
    } = useField("email", yup.string().email());

    const {
      value: name,
      errorMessage: nameError,
      handleChange: nameBlur,
    } = useField("name", yup.string());

    const {
      value: password,
      errorMessage: passwordError,
      handleBlur: passwordBlur,
    } = useField("password", yup.string().min(6));

    const {
      value: bill,
      errorMessage: billError,
      handleChange: billBlur,
    } = useField("bill", yup.string());

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
// .wrapper-form {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
</style>
