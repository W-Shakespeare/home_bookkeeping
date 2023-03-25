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
      records: null,
      isLoading: false,
    };
  },
  mutations: {
    setRecords(state, newRecords) {
      state.records = Object.keys(newRecords).map((key) => ({
        ...newRecords[key],
        id: key,
      }));
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    async createNewRecord({ commit }, record) {
      const db = getDatabase();
      const auth = getAuth();
      const uid = auth.currentUser.uid;
      const newPostKey = push(child(ref(db), "records")).key;

      const updates = {};
      updates[`users/${uid}/records/${newPostKey}`] = record;
      await update(ref(db), updates);
      commit("notification/setInfoNotification", "Новая запись создана", {
        root: true,
      });
      // dispatch("getRecords");
    },

    async getRecords({ commit }) {
      const db = getDatabase();
      const auth = getAuth();
      const uid = auth.currentUser.uid;

      onValue(ref(db, `users/${uid}/records/`), (snapshot) => {
        const records = snapshot.val();
        commit("setRecords", records);
      });
    },
  },
  getters: {
    getRecords(state) {
      return state.records;
    },
    getIsLoading(state) {
      return state.isLoading;
    },
  },
};
