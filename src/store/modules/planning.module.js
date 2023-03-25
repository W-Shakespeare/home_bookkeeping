// import { getErrorMessage } from "@/utils/errors";
// import categories from "@/api/categories";
export default {
  namespaced: true,
  state() {
    return {
      isLoading: true,
    };
  },
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    async getPlanningData({ dispatch }) {
      // await dispatch("categories/getCategories", undefined, { root: true });
      await dispatch("records/getRecords", null, { root: true });
    },
  },
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
  },
};
