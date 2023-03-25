// import { getErrorMessage } from "@/utils/errors";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
export default {
  namespaced: true,
  state() {
    return {
      selectedRecord: null,
      isLoading: true,
    };
  },
  mutations: {
    setRecord(state, record) {
      state.selectedRecord = record;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    async getRecordById({ commit }, recordId) {
      commit("setIsLoading", true);
      const db = getDatabase();
      const auth = getAuth();
      const uid = auth.currentUser.uid;

      onValue(
        ref(db, `users/${uid}/records/${recordId}`),
        (snapshot) => {
          const record = snapshot.val();
          commit("setRecord", record);
          commit("setIsLoading", false);
        },
        {
          onlyOnce: true,
        }
      );
    },
  },
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    },
    getSelectedRecord(state) {
      return state.selectedRecord;
    },
  },
};
