<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>История записей</h3>
      </div>

      <div class="history-chart" v-if="!isNotModifiedRecords">
        <Pie :chart-data="chartData" />
      </div>

      <section v-if="!isNotModifiedRecords">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Категория</th>
              <th v-if="!isMobile">Тип</th>
              <th>Открыть</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(record, idx) in modifiedRecords[currPage]"
              :key="record.id"
            >
              <td>{{ idx + 1 }}</td>
              <td :class="isMobile ? record.typeClass : ''">
                {{ record.amountmoney }} грн
              </td>
              <td>{{ getDate(record.createdDate) }}</td>
              <td>{{ record.categoryName }}</td>
              <td v-if="!isMobile">
                <span class="white-text badge" :class="record.typeClass">{{
                  record.typeText
                }}</span>
              </td>
              <td>
                <button
                  class="btn-small btn"
                  v-tooltip="'Открыть'"
                  @click="redirectToDetailPage(record.id)"
                >
                  <i class="material-icons">open_in_new</i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <VPaginate
          :page-count="pages"
          :page-range="3"
          :margin-pages="2"
          :click-handler="onChangePagination"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        />
      </section>
      <div v-else>
        Нет записей
        <router-link to="/record"> создать новую запись </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref, watchEffect } from "@vue/runtime-core";
import { useStore } from "vuex";
import { getDate } from "../utils/getDate";
import { useRouter } from "vue-router";
import "chart.js/auto";
import { Pie } from "vue-chartjs";
export default {
  components: { Pie },

  setup() {
    const isMobile = computed(() => window.innerWidth <= 768);

    let canvas = ref(null);
    let pages = ref(1);
    let itemsInPage = 5;
    let currPage = ref(0);
    const getPaginationArr = (arrItems = []) => {
      let arr = [];

      pages.value = Math.ceil(arrItems.length / itemsInPage);
      for (let i = 0; i < pages.value; i++) {
        let currPage = i + 1;
        if (currPage == 1) {
          let before = currPage * itemsInPage;
          let resArr = arrItems.slice(0, before);
          arr.push(resArr);
        } else {
          let end = currPage * itemsInPage;
          let start = end - itemsInPage;
          let resArr = arrItems.slice(start, end);
          arr.push(resArr);
        }
      }

      return arr;
    };

    const store = useStore();
    const router = useRouter();

    const onChangePagination = (value) => {
      currPage.value = value - 1;
    };

    const redirectToDetailPage = (id) =>
      router.push({
        path: "/detail/" + id,
      });
    const categories = computed(
      () => store.getters["categories/getCategories"]
    );
    const records = computed(() => store.getters["records/getRecords"]);

    const modifiedRecords = computed(() => {
      if (!categories.value || !records.value) return [];
      const modified = records.value.map((record) => {
        return {
          ...record,
          categoryName: categories.value.find((c) => c.id === record.сategoryId)
            .category,
          typeClass: record.type === "income" ? "green" : "red",
          typeText: record.type === "income" ? "Доход" : "Расход",
        };
      });
      return getPaginationArr(modified);
    });
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
      return null;
    });
    const chartData = reactive({
      labels: [],
      datasets: [
        {
          label: "Data One",
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
          data: [],
        },
      ],
    });

    watchEffect(() => {
      if (modifiedCategories.value && categories.value) {
        chartData.datasets[0].data = modifiedCategories.value.map(
          (c) => c.spend
        );
        chartData.labels = categories.value.map((c) => c.category);
      }
    });

    const isNotModifiedRecords = computed(() => {
      return modifiedRecords.value ? modifiedRecords.value.length == 0 : true;
    });

    return {
      modifiedRecords,
      isNotModifiedRecords,
      getDate,
      redirectToDetailPage,
      onChangePagination,
      currPage,
      itemsInPage,
      pages,
      canvas,
      chartData,
      isMobile,
    };
  },
};
</script>
<style lang="scss">
.page-item {
  cursor: pointer;
  .page-link {
    cursor: pointer;
  }
}
</style>
