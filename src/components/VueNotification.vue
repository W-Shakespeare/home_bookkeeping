<template>
  <vue-notification-list
    class="notification"
    position="top-right"
  ></vue-notification-list>
</template>

<script>
import { watch } from "@vue/runtime-core";
import { useNotification } from "../hook/useNotification";
import { useNotificationStore } from "@dafcoe/vue-notification";
export default {
  name: "VueNotification",
  setup() {
    const { setNotification } = useNotificationStore();

    const { infoNotification, errorNotification, notificationSetting } =
      useNotification();

    watch(infoNotification, (newInfoMessage) => {
      if (newInfoMessage) {
        setNotification({
          ...notificationSetting,
          message: newInfoMessage,
          type: "info",
        });
      }
    });
    watch(errorNotification, (newErrorMessage) => {
      if (newErrorMessage)
        setNotification({
          ...notificationSetting,
          message: newErrorMessage,
          type: "alert",
        });
    });

    return {};
  },
};
</script>

<style lang="scss" scoped>
.notification {
  z-index: 100000 !important;
  right: 50% !important;
  transform: translateX(50%);
  top: 60px !important;
}
@import "~@dafcoe/vue-notification/dist/vue-notification.css";
</style>
