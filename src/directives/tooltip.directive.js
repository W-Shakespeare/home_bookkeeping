import M from "materialize-css";

export default {
  mounted(el, { value }) {
    M.Tooltip.init(el, { html: value });
  },
  unmounted(el) {
    const instance = M.Tooltip.getInstance(el);
    if (instance && instance.destroy) {
      instance.destroy();
    }
  },
};
