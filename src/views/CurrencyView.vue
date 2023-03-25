<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <h3>Счет</h3>
      </div>

      <div class="row">
        <div class="col s12 m6 l4">
          <div class="card light-blue bill-card">
            <div class="card-content white-text">
              <span class="card-title">Счет в валюте</span>

              <p class="currency-line">
                <span>{{ bill }} UAH</span>
              </p>
              <p class="currency-line">
                <span>{{ USD }} USD</span>
              </p>
              <p class="currency-line">
                <span>{{ EUR }} EUR</span>
              </p>
              <p class="currency-line">
                <span>{{ CNY }} CNY</span>
              </p>
            </div>
          </div>
        </div>

        <div class="col s12 m6 l8">
          <div class="card orange darken-3 bill-card">
            <div class="card-content white-text">
              <div class="card-header">
                <span class="card-title">Курс валют</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Валюта</th>
                    <th>Курс</th>
                    <th>Дата</th>
                  </tr>
                </thead>

                <tbody v-for="{ name, currency } in allCurrency" :key="name">
                  <tr>
                    <td>{{ name }}</td>
                    <td>{{ currency }} грн</td>
                    <td>{{ getDate("datetime") }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { getDate } from "../utils/getDate";

export default {
  setup() {
    const store = useStore();
    const bill = computed(() => store.getters["info/getBill"]);

    const USD = computed(() => store.getters["currency/getUSDFromUAH"]);
    const EUR = computed(() => store.getters["currency/getEURFromUAH"]);
    const CNY = computed(() => store.getters["currency/getCNYFromUAH"]);
    const allCurrency = computed(
      () => store.getters["currency/getOtherCurrencyFromUAH"]
    );

    return { bill, USD, EUR, CNY, allCurrency, getDate };
  },
};
</script>
