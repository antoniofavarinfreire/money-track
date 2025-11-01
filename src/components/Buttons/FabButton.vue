<template>
  <button
    :class="['btn', 'fab']"
    style="background-image: linear-gradient(60deg, #66bb6a, #43a047)"
    :style="computedStyle"
    @click="$emit('click')"
    :title="title"
    aria-label="Floating Action Button"
    type="button"
  >
    <slot>
      <i
        :class="icon"
        style="font-size: 50px; color: white"
        aria-hidden="true"
      ></i>
    </slot>
  </button>
</template>

<script>
export default {
  name: "FabButton",
  props: {
    variant: { type: String, default: "" }, // cor Bootstrap
    icon: { type: String, default: "bi bi-plus" }, // ícone padrão
    bottom: { type: String, default: "24px" },
    right: { type: String, default: "24px" },
    size: { type: String, default: "56px" },
    title: { type: String, default: "Adicionar" },
  },
  computed: {
    computedStyle() {
      return {
        position: "fixed",
        bottom: this.bottom,
        right: this.right,
        width: this.size,
        height: this.size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
        zIndex: 1050,
        padding: 0,
      };
    },
  },
};
</script>

<style scoped>
.fab {
  line-height: 1;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.fab:active {
  transform: scale(0.95);
}
.fab:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
.fab i {
  font-size: 1.25rem;
}
</style>
