<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>
      <form @submit.prevent="onSubmit">
        <VSelect
          @change="onSelecteCategory"
          v-if="categories"
          :key="categories.length"
          id="editSelect"
        >
          <option v-for="it in categories" :key="it.id" :value="it.category">
            {{ it.category }}
          </option>
        </VSelect>
        <div v-else class="input-field">
          <input type="text" id="editeName" />
        </div>
        <div class="input-field">
          <input
            type="text"
            id="editeName"
            v-model="categoryName"
            @blur="categoryBlur"
            ref="editeName"
            autocomplete="off"
          />
          <label for="editeName">Название</label>
          <span v-if="categoryError" class="helper-text invalid">{{
            categoryError
          }}</span>
        </div>

        <div class="input-field">
          <input
            id="editeLimit"
            type="number"
            v-model="limit"
            @blur="limitBlur"
          />
          <label for="editeLimit">Лимит</label>
          <span v-if="limitError" class="helper-text invalid">{{
            limitError
          }}</span>
        </div>

        <button class="btn waves-effect waves-light my-btn" type="submit">
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import VSelect from "../Select.vue";
import { useStore } from "vuex";
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
const required = "Это поле обязательное";
import { onBeforeUnmount, onMounted, onUpdated, toRefs, watch } from "vue";
import M from "materialize-css/dist/js/materialize.min";

export default {
  components: { VSelect },
  props: ["categories", "currentCategory"],
  emits: ["selectedCategory"],
  setup(props, ctx) {
    const { currentCategory } = toRefs(props);

    const store = useStore();
    const { handleSubmit, setValues } = useForm();

    const onSubmit = handleSubmit((formState) => {
      console.log("formState", formState);
      store.dispatch("categories/updateCategory", {
        ...formState,
        id: currentCategory.value.id,
      });
    });

    const onSelecteCategory = (e) => {
      ctx.emit("selectedCategory", e.target.value);
    };

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

    categoryName.value = currentCategory.value.category;
    limit.value = currentCategory.value.limit;

    watch(currentCategory, (newVal) => {
      setValues({
        category: newVal.category,
        limit: newVal.limit,
      });
    });
    onBeforeUnmount(() => {});

    onMounted(() => {
      M.updateTextFields();
    });
    onUpdated(() => {
      M.updateTextFields();
    });

    return {
      onSubmit,
      categoryName,
      categoryError,
      categoryBlur,
      limit,
      limitError,
      limitBlur,
      onSelecteCategory,
    };
  },
};
</script>
