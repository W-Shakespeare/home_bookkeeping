<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>Планирование</h3>
        <h4>{{ bill }} грн</h4>
      </div>
      <!-- <VLoader v-if="isLoading" /> -->
      <section v-if="!isNotModifiedCategories">
        <div v-for="category in modifiedCategories" :key="category.id">
          <p>
            <strong>{{ category.category }}:</strong>
            {{ category.isSpendOutcomeMore ? "Расход" : "Доход" }}
            {{ category.spend }} грн из {{ category.limit }} грн
          </p>
          <div class="progress" v-tooltip="category.tooltip">
            <div
              class="determinate"
              :class="[category.progressColor]"
              :style="{ width: category.progressPercent + '%' }"
            ></div>
          </div>
        </div>
      </section>
      <div v-else>
        Нет записей
        <router-link to="/record"> создать новую запись </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// import VLoader from "../components/Loader.vue";
import { useStore } from "vuex";
import { computed, ref } from "@vue/runtime-core";

export default {
  // components: { VLoader },

  setup() {
    const store = useStore();
    const isLoading = ref(true);
    const bill = computed(() => store.getters["info/getBill"]);
    const records = computed(() => store.getters["records/getRecords"]);
    const categories = computed(
      () => store.getters["categories/getCategories"]
    );

    const getRecordSpendByType = (type, category) => {
      return records.value
        .filter((r) => r.сategoryId === category.id)
        .filter((r) => r.type === type)
        .reduce((total, record) => {
          return (total += +record.amountmoney);
        }, 0);
    };

    let modifiedCategories = computed(() => {
      if (categories.value && records.value) {
        return categories.value.map((category) => {
          const spendOutcome = getRecordSpendByType("outcome", category);
          const spendIncome = getRecordSpendByType("income", category);
          const isSpendOutcomeMore = spendOutcome > spendIncome;
          let progressPercent, progressColor, tooltipValue, tooltip, spend;
          if (isSpendOutcomeMore) {
            spend = spendOutcome - spendIncome;
            const percent = (100 * spend) / category.limit;
            progressPercent = percent > 100 ? 100 : percent;
            progressColor =
              percent < 60 ? "green" : percent < 100 ? "yellow" : "red";
            tooltipValue = category.limit - spend;
            tooltip = `${
              tooltipValue < 0 ? "Превышение расхода на" : "Осталось"
            } ${Math.abs(tooltipValue)}`;
          } else {
            spend = spendIncome - spendOutcome;
            const percent = (100 * spend) / category.limit;
            progressPercent = percent > 100 ? 100 : percent;
            progressColor =
              percent < 60 ? "blue" : percent < 100 ? "green" : "green";
            tooltipValue = category.limit - spend;
            tooltip = `${
              tooltipValue < 0 ? "Превышение дохода на" : "Осталось"
            } ${Math.abs(tooltipValue)}`;
          }
          return {
            ...category,
            progressPercent,
            progressColor,
            spend,
            tooltip,
            isSpendOutcomeMore,
          };
        });
      }
      return [];
    });

    const isNotModifiedCategories = computed(() => {
      return modifiedCategories.value
        ? modifiedCategories.value.length == 0
        : true;
    });

    return { isLoading, bill, modifiedCategories, isNotModifiedCategories };
  },
};
</script>
