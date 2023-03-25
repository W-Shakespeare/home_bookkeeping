import { getErrorMessage } from "@/utils/errors";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

export default {
  namespaced: true,
  state() {
    return {
      isAuthenticated: false,
      userName: null,
    };
  },
  mutations: {
    setIsAuthenticated(state, payload) {
      state.isAuthenticated = payload;
    },
    setUserName(state, { name }) {
      state.userName = name;
    },
  },
  actions: {
    async register({ commit }, { name, email, password, bill }) {
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, { displayName: name });
        commit("setUserName", { name });
        const uid = auth.currentUser.uid;
        const db = getDatabase();
        await set(ref(db, `users/${uid}/info`), {
          name,
          bill,
        });
        commit("setIsAuthenticated", true);
        commit(
          "notification/setInfoNotification",
          "Вы зарегестрировались и автоматически зашли",
          {
            root: true,
          }
        );
      } catch (e) {
        console.log("e", e.code);
        commit("notification/setErrorNotification", getErrorMessage(e.code), {
          root: true,
        });
      }
    },

    async login({ commit }, { email, password }) {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
        commit("setIsAuthenticated", true);
      } catch (e) {
        console.log("e.code", e.code);
        commit("notification/setErrorNotification", getErrorMessage(e.code), {
          root: true,
        });
      }
    },

    async logout({ commit }) {
      const auth = getAuth();
      await signOut(auth);
      commit("setIsAuthenticated", false);
      commit("setUserName", { name: null });
      commit("notification/setInfoNotification", "Вы вышли", {
        root: true,
      });
    },

    async updateUser(
      { getters, commit, dispatch },
      { name = null, email = null, password = null, bill = null }
    ) {
      const auth = getAuth();
      const uid = auth.currentUser.uid;
      const db = getDatabase();
      debugger;
      try {
        if (name) {
          await updateProfile(auth.currentUser, { displayName: name });
          commit("auth/setUserName", { name }, { root: true });
        }

        email && (await updateEmail(auth.currentUser, email));
        password && (await updatePassword(auth.currentUser, password));
        commit("notification/setInfoNotification", "Профиль обновлен", {
          root: true,
        });

        bill &&
          (await set(ref(db, `users/${uid}/info`), {
            name: getters["getUserName"],
            bill,
          }));
        await dispatch("info/getInfo", null, { root: true });
      } catch (e) {
        commit("notification/setErrorNotification", e.code, {
          root: true,
        });
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    getUserName(state) {
      return state.userName;
    },
  },
};
