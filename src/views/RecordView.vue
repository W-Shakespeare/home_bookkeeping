<template>
  <div class="app-page">
    <VLoader v-if="isLoading" />
    <div class="wrapper-page">
      <div class="page-title">
        <h3>Новая запись</h3>
      </div>
      <form v-if="!isNotCategory" @submit.prevent="onSubmit">
        <div class="input-field">
          <VSelect @change="onSelecteCategory" id="editSelect">
            <option
              v-for="it in categories"
              :key="it.category"
              :value="it.category"
            >
              {{ it.category }}
            </option>
          </VSelect>
        </div>

        <p>
          <label>
            <input
              v-model="type"
              class="with-gap"
              name="type"
              type="radio"
              value="income"
            />
            <span>Доход</span>
          </label>
        </p>

        <p>
          <label>
            <input
              v-model="type"
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
            />
            <span>Расход</span>
          </label>
        </p>

        <div class="input-field">
          <input
            v-model.number="amountmoney"
            @blur="amountmoneyBlur"
            id="amount"
            type="number"
          />
          <label for="amount">Сумма</label>
          <span v-if="amountmoneyError" class="helper-text invalid">{{
            amountmoneyError
          }}</span>
        </div>

        <div class="input-field">
          <input
            v-model.trim="description"
            @blur="descriptionBlur"
            id="description"
            type="text"
            autocomplete="off"
          />
          <label for="description">Описание</label>
          <span v-if="descriptionError" class="helper-text invalid">{{
            descriptionError
          }}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
    <div v-if="isNotCategory">
      Категорий нет
      <router-link to="/categories"> cоздайть категорию </router-link>
    </div>
  </div>
</template>

<script>
import VSelect from "../components/Select.vue";
import VLoader from "../components/Loader.vue";
import { computed, onMounted, onUpdated, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import M from "materialize-css/dist/js/materialize.min";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
const required = "Это поле обязательное";

export default {
  components: { VSelect, VLoader },
  setup() {
    const store = useStore();

    let currentCategory = ref({});
    let type = ref("income");
    const bill = computed(() => store.getters["info/getBill"]);

    const categories = computed(
      () => store.getters["categories/getCategories"]
    );
    console.log("categories", categories);
    if (categories.value) {
      currentCategory.value = categories.value[0];
    }
    watch(currentCategory, (n) => {
      console.log("currentCategory", n);
    });

    const isNotCategory = computed(() => {
      return currentCategory.value
        ? Object.keys(currentCategory.value).length == 0
        : true;
    });
    watch(categories, (n) => {
      currentCategory.value = n[0];
    });

    onMounted(() => {
      M.updateTextFields();
      store.dispatch("info/getInfo");
    });

    onUpdated(() => {
      M.updateTextFields();
    });

    const isCanCreateRecord = (amountMoney) => {
      if (bill.value >= amountMoney) return true;
      return false;
    };

    const onSelecteCategory = (e) => {
      const selectedCategory = categories.value.find(
        (it) => it.category == e.target.value
      );
      currentCategory.value = selectedCategory;
    };
    const { handleSubmit } = useForm();

    const createRecord = (formState) => {
      store.dispatch("records/createNewRecord", {
        ...formState,
        type: type.value,
        сategoryId: currentCategory.value.id,
        createdDate: new Date().toJSON(),
      });
    };

    const onSubmit = handleSubmit((formState, { resetForm }) => {
      const amountMoney = Number(formState.amountmoney);

      if (type.value === "income") {
        store.dispatch("info/incrementBill", amountMoney + bill.value);
        createRecord(formState);
      } else if (isCanCreateRecord(amountMoney)) {
        store.dispatch("info/decrementBill", bill.value - amountMoney);
        createRecord(formState);
      } else {
        const message = `Вам не хватает ${amountMoney - bill.value} денег`;
        console.log(message);
        store.commit("notification/setInfoNotification", message);
      }

      resetForm();
    });

    const {
      value: amountmoney,
      errorMessage: amountmoneyError,
      handleChange: amountmoneyBlur,
    } = useField(
      "amountmoney",
      yup
        .string()
        .required(required)
        .test("minNumber", "Минимальная сумма 1", (v) => v >= 1)
    );

    const {
      value: description,
      errorMessage: descriptionError,
      handleChange: descriptionBlur,
    } = useField("description", yup.string().required(required));

    const isLoading = computed(() => store.getters["records/getIsLoading"]);

    return {
      onSubmit,
      amountmoney,
      amountmoneyError,
      amountmoneyBlur,
      description,
      descriptionError,
      descriptionBlur,
      type,
      onSelecteCategory,
      categories,
      isLoading,
      isNotCategory,
    };
  },
};
</script>
