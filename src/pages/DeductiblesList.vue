<template>
  <div class="content">
    <div class="mb-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <SimpleTable
              :data="dadosFormatados"
              :columns="colunas"
              :initial-per-page="10"
              :show-delete-button="false"
              @delete="excluirUsuario"
            ></SimpleTable>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { SimpleTable } from "@/components";
import api from "@/services/api";

export default defineComponent({
  name: "DeductiblesList",
  components: {
    SimpleTable,
  },
  data() {
    return {
      colunas: [
        { key: "expense_date", label: "Data" },
        { key: "description", label: "Descrição" },
        { key: "amount", label: "Valor" },
        { key: "transaction_type", label: "Transação" },
        { key: "financial_source", label: "Fonte Financeira" },
      ],
      dados: [],
    };
  },
  methods: {
    async fetchDeductibleExpenses() {
      try {
        this.loading = true;
        const response = await api.get("/expenses/view-user-all-expenses");
        // Filtra apenas os dedutíveis
        this.dados = response.data.filter(
          (item) => String(item.is_deductible).toLowerCase() === "sim"
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Erro ao buscar despesas dedutíveis:", error);
        this.errorMessage = "Erro ao carregar despesas dedutíveis.";
      } finally {
        this.loading = false;
      }
    },

    formatCurrency(value) {
      const numericValue = parseFloat(value) || 0;
      return (
        "R$ " +
        numericValue
          .toFixed(2)
          .replace(".", ",")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      );
    },
    excluirUsuario(usuario) {},
    createNewExpense() {
      this.modalActive = true;
    },
    updateExpenseRecord(newValue) {
      this.expenseRecord = newValue;
    },
    saveExpenseRecord(dados) {
      this.dados.push({ ...dados });
      this.expenseRecord = {
        expense_date: "",
        description: "",
        amount: 0,
        transaction_type: "",
        financial_source: "",
      };
    },
    cancelRegister() {
      this.expenseRecord = {
        expense_date: "",
        description: "",
        amount: 0,
        transaction_type: "",
        financial_source: "",
      };
    },
  },
  mounted() {
    this.fetchDeductibleExpenses();
  },
  computed: {
    dadosFormatados() {
      return this.dados.map((item) => ({
        ...item,
        amount: this.formatCurrency(item.amount),
      }));
    },
  },
});
</script>
