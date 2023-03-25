<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>Категории</h3>
      </div>
    </div>
    <section>
      <VLoader v-if="false" />
      <div class="row">
        <CreateCategory />
        <EditCategory
          :categories="categories"
          :currentCategory="currentCategory"
          @selectedCategory="setCurrentCategory"
        />
      </div>
    </section>
  </div>
</template>
<script>
import { computed, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import CreateCategory from "../components/CategoriesView/CreateCategory.vue";
import EditCategory from "../components/CategoriesView/EditCategory.vue";
import VLoader from "../components/Loader.vue";

export default {
  name: "TheCategories",
  components: { CreateCategory, EditCategory, VLoader },
  setup() {
    const store = useStore();
    // const isLoading = store.getters["getIsLoading"];

    const categories = computed(
      () => store.getters["categories/getCategories"]
    );

    let currentCategory = ref({});
    const isNotCategory = computed(
      () => Object.keys(currentCategory.value).length == 0
    );

    watch(categories, (n) => {
      if (isNotCategory.value) currentCategory.value = n[0];
    });

    const setCurrentCategory = (categoryName) => {
      const selectedCategory = categories.value.find(
        (it) => it.category == categoryName
      );
      currentCategory.value = selectedCategory;
    };

    return {
      // isLoading,
      categories,
      isNotCategory,
      currentCategory,
      setCurrentCategory,
    };
  },
};
</script>
