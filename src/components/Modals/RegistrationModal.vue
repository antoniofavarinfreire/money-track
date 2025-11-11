<template>
  <div
    class="modal fade"
    tabindex="-1"
    :class="{ show: localVisible }"
    :style="{ display: localVisible ? 'block' : 'none' }"
  >
    <div class="modal-dialog mt-5">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cadastro de Despesas</h5>
          <button
            type="button"
            class="btn-close"
            @click="close(false)"
          ></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label"
              >Data <span class="text-danger">*</span></label
            >
            <input
              type="date"
              class="form-control"
              v-model="computedModalValue.expense_date"
            />
            <div v-if="errors.expense_date" class="invalid-feedback">
              {{ errors.expense_date }}
            </div>
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
            <label class="form-label"
              >Valor <span class="text-danger">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :value="formattedAmount"
              @input="handleInput"
              placeholder="R$ 0,00"
            />
            <div v-if="errors.amount" class="invalid-feedback">
              {{ errors.amount }}
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label"
              >Categoria <span class="text-danger">*</span></label
            >
            <select
              class="form-control"
              v-model.number="computedModalValue.income_tax_category_id"
            >
              <option value="" disabled selected>Escolha uma categoria</option>
              <option
                v-for="categoria in categorias"
                :key="categoria.income_tax_category_id"
                :value="categoria.income_tax_category_id"
              >
                {{ categoria.name }}
              </option>
            </select>
            <div v-if="errors.income_tax_category_id" class="invalid-feedback">
              {{ errors.income_tax_category_id }}
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label"
              >Ocorrência <span class="text-danger">*</span></label
            >
            <select
              class="form-control"
              v-model="computedModalValue.transaction_type"
            >
              <option value="" disabled selected>Escolha uma Transação</option>
              <option value="debito">Débito</option>
              <option value="credito">Crédito</option>
            </select>
            <div v-if="errors.transaction_type" class="invalid-feedback">
              {{ errors.transaction_type }}
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label"
              >Origem Financeira <span class="text-danger">*</span></label
            >
            <select
              class="form-control"
              v-model="computedModalValue.financial_source"
            >
              <option value="" disabled selected>
                Escolha uma Fonte Financeira
              </option>
              <option value="Salário(Dinheiro)">Salário(Dinheiro)</option>
              <option value="Cartão Crédito(BB)">Cartão Crédito(BB)</option>
              <option value="Cartão Débito(BB)">Cartão Débito(BB)</option>
              <option value="PIX(Santander)">PIX(Santander)</option>
              <option value="PIX(BB)">PIX(BB)</option>
              <option value="Vale Alimentação(Ticket)">
                Vale Alimentação(Ticket)
              </option>
              <option value="Vale Refeição(Alelo)">Vale Refeição(Alelo)</option>
              <option value="Outros">Outros</option>
            </select>
            <div v-if="errors.financial_source" class="invalid-feedback">
              {{ errors.financial_source }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close(false)">
            Cancelar
          </button>
          <button
            style="
              margin-bottom: 0px;
              margin-left: 10px;
              background-image: linear-gradient(60deg, #66bb6a, #43a047);
              border-color: #43a047;
              color: white;
            "
            type="button"
            class="btn"
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
import api from "@/services/api";

export default {
  name: "RegistrationModal",

  props: {
    value: { type: Boolean, default: false }, // v-model para visibilidade
    modelValue: { type: Object, required: true }, // objeto de cadastro
  },

  data() {
    return {
      localVisible: this.value,
      categorias: [],
      errors: {},
      errorMessage: "",
    };
  },
  watch: {
    value(novo) {
      this.localVisible = novo;
      if (novo) {
        this.errors = {};
        this.errorMessage = "";
        this.buscarCategorias(); // 🔹 Carrega categorias ao abrir modal
      }
    },
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
    formattedAmount() {
      const amount = this.computedModalValue.amount || 0;
      return (
        "R$ " +
        amount
          .toFixed(2)
          .replace(".", ",")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      );
    },
  },
  methods: {
    async buscarCategorias() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(
          "/income-tax-categories/view-all-category",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.categorias = response.data;
      } catch (error) {
        // console.error("Erro ao buscar categorias:", error.response || error);
      }
    },
    validateForm() {
      this.errors = {};
      this.errorMessage = "";
      let isValid = true;

      // Validação da data
      if (!this.computedModalValue.expense_date) {
        this.errors.expense_date = "A data é obrigatória";
        isValid = false;
      }

      // Validação do valor
      if (
        !this.computedModalValue.amount ||
        this.computedModalValue.amount <= 0
      ) {
        this.errors.amount = "O valor deve ser maior que zero";
        isValid = false;
      }

      // Validação da ocorrência
      if (!this.computedModalValue.transaction_type) {
        this.errors.transaction_type = "A ocorrência é obrigatória";
        isValid = false;
      }

      // Validação da origem financeira
      if (!this.computedModalValue.financial_source) {
        this.errors.financial_source = "A origem financeira é obrigatória";
        isValid = false;
      }

      if (!isValid) {
        this.errorMessage = "Por favor, preencha todos os campos obrigatórios.";
      }

      if (!this.computedModalValue.income_tax_category_id) {
        this.errors.income_tax_category_id = "A categoria é obrigatória";
        isValid = false;
      }

      return isValid;
    },

    close(confirmar) {
      if (confirmar) {
        // Valida antes de salvar
        if (!this.validateForm()) {
          return; // Não fecha o modal se houver erros
        }
        this.$emit("save", this.computedModalValue);
        this.localVisible = false;
      } else {
        this.$emit("cancel");
        this.localVisible = false;
      }
    },

    handleInput(event) {
      // Remove tudo que não é número
      let value = event.target.value.replace(/\D/g, "");

      // Converte para número decimal (centavos)
      const numericValue = parseInt(value || 0) / 100;

      // Atualiza o computedModalValue que vai emitir o evento
      const newValue = {
        ...this.computedModalValue,
        amount: numericValue,
      };

      this.computedModalValue = newValue;

      // Limpa erro do valor quando o usuário começa a digitar
      if (this.errors.amount) {
        this.errors = { ...this.errors };
        delete this.errors.amount;
        if (Object.keys(this.errors).length === 0) {
          this.errorMessage = "";
        }
      }

      // Formata para exibição
      const formatted =
        "R$ " +
        numericValue
          .toFixed(2)
          .replace(".", ",")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      event.target.value = formatted;
    },
  },
};
</script>

<style scoped>
.modal.show {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.text-danger {
  color: #dc3545;
}
</style>
