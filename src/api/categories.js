import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
export default {
  getCategories() {
    try {
      const db = getDatabase();
      const auth = getAuth();
      const uid = auth.currentUser.uid;

      return onValue(
        ref(db, `users/${uid}/categories/`),
        (snapshot) => {
          const categories = snapshot.val();
          return categories;
        },
        {
          onlyOnce: true,
        }
      );
    } catch (e) {
      console.log("Error___", e);
    }
  },
};
