const ERROR_CODES = {
  "auth/email-already-in-use": "Аккаунт с этой почтой существует",
  "auth/wrong-password": "Неверный пароль",
  "auth/user-not-found": "Пользователь не найден",
  "auth/too-many-requests": "Слишком много запросов",
  "auth/invalid-email": "Не валидный email",
};

export const getErrorMessage = (code) => {
  return ERROR_CODES[code] ? ERROR_CODES[code] : "Неизвестная ошибка";
};
