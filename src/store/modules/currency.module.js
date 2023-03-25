// import { getErrorMessage } from "@/utils/errors";
export default {
  namespaced: true,
  state() {
    return {
      info: null,
      USD: 0,
      EUR: 0,
      CNY: 0,
      allCurrency: {},
    };
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
      state.bill = info.bill;
    },
  },
  actions: {
    async getCurrencyPageInfo({ commit, dispatch }) {
      commit("setIsLoading", true, { root: true });
      try {
        await dispatch("getCurrency");
        await dispatch("info/getInfo", null, { root: true });
        commit("setIsLoading", false, { root: true });
      } catch (e) {
        console.log("getCurrencyPageInfo__Error", e);
        commit("setIsLoading", false, { root: true });
      }
    },

    async getCurrency({ state }) {
      let localStoreDate = null;
      let isLocalStoreDateToday = null;
      const today = new Date();
      const isLocalStoreHaveDate = localStorage.getItem("date");

      if (isLocalStoreHaveDate) {
        localStoreDate = new Date(localStorage.getItem("date"));
        isLocalStoreDateToday =
          today.getFullYear() >= localStoreDate.getFullYear() ||
          today.getMonth() + 1 >= localStoreDate.getMonth() + 1 ||
          today.getDate() >= localStoreDate.getDate();
      }

      if (isLocalStoreDateToday) {
        const rates = localStorage.getItem("rates");
        const parseRates = JSON.parse(rates);
        state.USD = parseRates["USD"];
        state.EUR = parseRates["EUR"];
        state.CNY = parseRates["CNY"];
        state.allCurrency = parseRates;
      } else {
        const url =
          "https://v6.exchangerate-api.com/v6/1297c578dc37b6b8e5d8acf3/latest/UAH";
        const res = await fetch(url);
        const currencyJson = await res.json();
        const rates = currencyJson["conversion_rates"];

        if (!isLocalStoreDateToday) {
          localStorage.setItem("rates", JSON.stringify(rates));
          localStorage.setItem("date", today.toJSON());
        }

        state.USD = rates["USD"];
        state.EUR = rates["EUR"];
        state.CNY = rates["CNY"];
        state.allCurrency = rates;
      }
    },
  },
  getters: {
    getBill(state) {
      return +state.bill;
    },
    getUSDFromUAH(state, _g, _r, rootGetters) {
      const validNumber = rootGetters["info/getBill"] * state.USD;
      return validNumber.toFixed(2);
    },
    getEURFromUAH(state, _g, _r, rootGetters) {
      const validNumber = rootGetters["info/getBill"] * state.EUR;
      return validNumber.toFixed(2);
    },
    getCNYFromUAH(state, _g, _r, rootGetters) {
      const validNumber = rootGetters["info/getBill"] * state.CNY;
      return validNumber.toFixed(2);
    },
    getOtherCurrencyFromUAH(state, getters, _r, rootGetters) {
      const bill = rootGetters["info/getBill"];
      const validNumberCNY = bill * state.allCurrency["CNY"];
      const CNYCurrencyObj = {
        name: "CNY",
        currency: (bill / validNumberCNY).toFixed(2),
      };
      const USDCurrencyObj = {
        name: "USD",
        currency: (bill / getters["getUSDFromUAH"]).toFixed(2),
      };
      const EURCurrencyObj = {
        name: "EUR",
        currency: (bill / getters["getEURFromUAH"]).toFixed(2),
      };

      return [USDCurrencyObj, EURCurrencyObj, CNYCurrencyObj];
    },
  },
};
