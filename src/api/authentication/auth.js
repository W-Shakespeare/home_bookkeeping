import authenticationConf from "./auth.conf";

export const login = (loginData) => {
  console.log("loginData", loginData);
  return authenticationConf.post("", { ...loginData, returnSecureToken: true });
};
