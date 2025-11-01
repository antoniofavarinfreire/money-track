<template>
  <div
    class="modal fade"
    tabindex="-1"
    :class="{ show: localVisible }"
    :style="{ display: localVisible ? 'block' : 'none' }"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cadastrar Usuário</h5>
          <button
            type="button"
            class="btn-close"
            @click="close(false)"
          ></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Data</label>
            <input
              type="data"
              class="form-control"
              v-model="computedModalValue.expense_date"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Descrição</label>
            <input
              type="text"
              class="form-control"
              v-model="computedModalValue.description"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Valor</label>
            <input
              type="text"
              class="form-control"
              v-model="computedModalValue.amount"
              placeholder="R$ 0,00"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Ocorrencia</label>
            <input
              type="text"
              class="form-control"
              v-model="computedModalValue.transaction_type"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Origem Fiannceira</label>
            <input
              type="text"
              class="form-control"
              v-model="computedModalValue.financial_source"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close(false)">
            Cancelar
          </button>
          <button
            style="margin-bottom: 0px; margin-left: 10px"
            type="button"
            class="btn btn-primary"
            @click="close(true)"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegistrationModal",

  props: {
    value: { type: Boolean, default: false }, // v-model para visibilidade
    modelValue: { type: Object, required: true }, // objeto de cadastro
  },

  data() {
    return {
      localVisible: this.value,
    };
  },

  computed: {
    computedModalValue: {
      get() {
        return { ...this.modelValue };
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
  },

  watch: {
    value(novo) {
      this.localVisible = novo;
    },
    localVisible(novo) {
      this.$emit("input", novo);
    },
  },

  methods: {
    close(confirmar) {
      if (confirmar) {
        this.$emit("save", this.computedModalValue);
      } else {
        this.$emit("cancel");
      }
      this.localVisible = false;
    },
  },
};
</script>

<style scoped>
.modal.show {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}
</style>
