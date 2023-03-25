import { createStore, createLogger } from "vuex";
import auth from "./modules/auth.module";
import notification from "./modules/notification.module.js";
import categories from "./modules/categories.module.js";
import records from "./modules/records.module.js";
import info from "./modules/info.module.js";
import currency from "./modules/currency.module.js";
import planning from "./modules/planning.module.js";
import detail from "./modules/detail.module.js";

const plugins = [];
if (process.env.NODE_ENV === "development") {
  plugins.push(createLogger());
}
export default createStore({
  plugins,
  state: {
    isLoading: true,
  },

  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  actions: {},
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
  },
  modules: {
    info,
    auth,
    notification,
    categories,
    records,
    currency,
    planning,
    detail,
  },
});
