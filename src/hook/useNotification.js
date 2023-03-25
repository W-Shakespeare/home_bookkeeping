import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";

export const useNotification = () => {
  const store = useStore();
  const infoNotification = computed(
    () => store.getters["notification/getInfoNotification"]
  );
  const errorNotification = computed(
    () => store.getters["notification/getErrorNotification"]
  );
  const notificationSetting = {
    message: "",
    type: "success",
    showIcon: true,
    dismiss: {
      manually: true,
      automatically: true,
    },
    duration: 3500,
    showDurationProgress: true,
    appearance: "glass",
  };
  return { infoNotification, errorNotification, notificationSetting };
};
