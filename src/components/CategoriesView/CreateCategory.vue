<template>
  <div class="col s12 m6 categoty">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="categoryName"
            @blur="categoryBlur"
            autocomplete="off"
          />
          <label for="name">Название</label>
          <span v-if="categoryError" class="helper-text invalid">{{
            categoryError
          }}</span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model="limit"
            @blur="limitBlur"
            autocomplete="off"
          />
          <label for="limit">Лимит</label>
          <span v-if="limitError" class="helper-text invalid">{{
            limitError
          }}</span>
        </div>

        <button class="btn waves-effect waves-light my-btn" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useStore } from "vuex";
const required = "Это поле обязательное";

export default {
  name: "CreateCategory",
  setup() {
    const store = useStore();
    const { handleSubmit } = useForm();

    const onSubmit = handleSubmit((formState, { resetForm }) => {
      store.dispatch("categories/createCategory", formState);
      resetForm(formState);
    });

    const {
      value: categoryName,
      errorMessage: categoryError,
      handleChange: categoryBlur,
    } = useField("category", yup.string().required(required));

    const {
      value: limit,
      errorMessage: limitError,
      handleChange: limitBlur,
    } = useField(
      "limit",
      yup
        .string()
        .required(required)
        .test("min1", "Min 100", (v) => v >= 100)
    );

    return {
      onSubmit,
      categoryName,
      categoryError,
      categoryBlur,
      limit,
      limitError,
      limitBlur,
    };
  },
};
</script>
<style lang="scss" scoped>
.categoty {
  margin-bottom: 40px;
}
</style>
