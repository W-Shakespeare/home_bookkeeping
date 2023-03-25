// import { getErrorMessage } from "@/utils/errors";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  update,
  onValue,
  push,
  child,
} from "firebase/database";
export default {
  namespaced: true,
  state() {
    return {
      categories: null,
    };
  },
  mutations: {
    setCategories(state, newCategories) {
      if (newCategories) {
        state.categories = Object.keys(newCategories).map((key) => ({
          ...newCategories[key],
          id: key,
        }));
      } else {
        state.categories = null;
      }
    },
  },
  actions: {
    async createCategory({ dispatch }, categories) {
      const db = getDatabase();

      const auth = getAuth();
      const uid = auth.currentUser.uid;
      const newPostKey = push(child(ref(db), "categories")).key;
      const updates = {};
      updates[`users/${uid}/categories/${newPostKey}`] = categories;

      await update(ref(db), updates);
      let isWithLoading = false;
      dispatch("getCategories", { isWithLoading });
    },

    async getCategories(
      { commit },
      loadingObj = {
        isWithLoading: true,
        recordsPage: false,
        planningPage: false,
      }
    ) {
      const { isWithLoading, recordsPage } = loadingObj;
      isWithLoading && commit("setIsLoading", true, { root: true });
      recordsPage && commit("records/setIsLoading", true, { root: true });
      try {
        const db = getDatabase();
        const auth = getAuth();
        const uid = auth.currentUser.uid;

        onValue(ref(db, `users/${uid}/categories/`), (snapshot) => {
          const categories = snapshot.val();
          commit("setCategories", categories);
          isWithLoading && commit("setIsLoading", false, { root: true });

          recordsPage && commit("records/setIsLoading", false, { root: true });
        });
      } catch (e) {
        isWithLoading && commit("setIsLoading", false, { root: true });
        recordsPage && commit("records/setIsLoading", false, { root: true });
      }
    },

    async updateCategory({ dispatch, commit }, { id, ...category }) {
      try {
        const db = getDatabase();
        const auth = getAuth();
        const uid = auth.currentUser.uid;
        const updates = {};

        updates[`users/${uid}/categories/${id}`] = category;
        await update(ref(db), updates);
        dispatch("getCategories");
        commit("notification/setInfoNotification", "Категория обновлена", {
          root: true,
        });
      } catch (e) {
        console.log("updateCategory__ERROR", e);
      }
    },
  },
  getters: {
    getErrorNotification(state) {
      return state.error;
    },
    getCategories(state) {
      return state.categories;
    },
  },
};
