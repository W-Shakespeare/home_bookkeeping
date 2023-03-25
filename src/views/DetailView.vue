<template>
  <div class="app-page">
    <VLoader v-if="isLoading" />
    <div v-else-if="!selectedRecord" class="center">Не выбрана запись</div>
    <div v-else>
      <div>
        <div class="breadcrumb-wrap">
          <router-link to="/history" class="breadcrumb">История</router-link>
          <a class="breadcrumb"> {{ recordType }} </a>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <div :class="['card', recordClass]">
              <div class="card-content white-text">
                <p>Описание: {{ selectedRecord.description }}</p>
                <p>Количество денег: {{ selectedRecord.amountmoney }} грн</p>
                <p>Категория:</p>

                <small
                  >Дата:
                  {{ getDate(selectedRecord.createdDate, "datetime") }}</small
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { getDate } from "../utils/getDate";
import VLoader from "../components/Loader.vue";
import { useStore } from "vuex";

export default {
  components: { VLoader },
  setup() {
    const store = useStore();
    const route = useRoute();
    const recordId = route.params.id;
    const isLoading = computed(() => store.getters["detail/getIsLoading"]);

    const selectedRecord = computed(
      () => store.getters["detail/getSelectedRecord"]
    );
    const recordType = computed(() =>
      selectedRecord.value.type === "outcome" ? "Расход" : "Доход"
    );
    const recordClass = computed(() =>
      selectedRecord.value.type === "outcome" ? "red" : "green"
    );

    onMounted(() => {
      store.dispatch("detail/getRecordById", recordId);
    });
    return { isLoading, selectedRecord, getDate, recordType, recordClass };
  },
};
</script>
