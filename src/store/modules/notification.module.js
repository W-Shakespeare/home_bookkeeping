// import { getErrorMessage } from "@/utils/errors";

export default {
  namespaced: true,
  state() {
    return {
      info: null,
      error: null,
    };
  },
  mutations: {
    setInfoNotification(state, info) {
      state.info = info;
      setTimeout(() => (state.info = null), 3000);
    },
    setErrorNotification(state, error) {
      state.error = error;
      setTimeout(() => (state.error = null), 3000);
    },
  },
  actions: {},
  getters: {
    getInfoNotification(state) {
      return state.info;
    },
    getErrorNotification(state) {
      return state.error;
    },
  },
};
