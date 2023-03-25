import axios from "axios";

const authenticationConf = axios.create({
  baseURL: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.VUE_APP_FB_KEY}`,
});
export default authenticationConf;
