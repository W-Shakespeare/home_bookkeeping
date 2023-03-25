<template>
  <div :class="['input-field']">
    <select v-bind="attrs" :id="id" ref="select">
      <slot></slot>
    </select>
  </div>
</template>
<script>
import { onMounted, ref, onBeforeUnmount } from "@vue/runtime-core";
import M from "materialize-css/dist/js/materialize.min";
import { useAttrs } from "vue";

export default {
  props: ["list", "id"],
  name: "VSelect",

  setup() {
    const attrs = useAttrs();
    const activeClass = ref("active");
    const errorClass = ref("text-danger");
    const select = ref(null);
    let editSelect = null;

    onMounted(() => {
      editSelect = M.FormSelect.init(select.value, { classes: "" });
    });

    onBeforeUnmount(() => {
      if (editSelect?.destroy) {
        console.log("editSelect.destroy");
        editSelect.destroy();
      }
    });

    return {
      select,
      activeClass,
      errorClass,
      attrs,
    };
  },
};
</script>
