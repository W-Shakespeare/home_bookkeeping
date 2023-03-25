// import { getErrorMessage } from "@/utils/errors";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
export default {
  namespaced: true,
  state() {
    return {
      bill: null,
      info: null,
    };
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
      state.bill = info.bill;
    },
  },
  actions: {
    async incrementBill({ dispatch, rootGetters }, bill) {
      const db = getDatabase();
      const auth = getAuth();
      const uid = auth.currentUser.uid;
      await set(ref(db, `users/${uid}/info`), {
        name: rootGetters["auth/getUserName"],
        bill,
      });
      await dispatch("getInfo");
    },

    async decrementBill({ dispatch, rootGetters }, bill) {
      console.log("bill", bill);
      const db = getDatabase();
      const auth = getAuth();
      const uid = auth.currentUser.uid;
      await set(ref(db, `users/${uid}/info`), {
        name: rootGetters["auth/getUserName"],
        bill,
      });
      await dispatch("getInfo");
    },

    async getInfo({ commit }) {
      // commit("setIsLoading", true, { root: true });
      const db = getDatabase();
      const auth = getAuth();
      const uid = auth.currentUser.uid;

      onValue(
        ref(db, `users/${uid}/info/`),
        (snapshot) => {
          const info = snapshot.val();
          commit("setInfo", info);
        },
        {
          onlyOnce: true,
        }
      );
      // commit("setIsLoading", false, { root: true });
    },
  },
  getters: {
    getBill(state) {
      return +state.bill;
    },
  },
};
