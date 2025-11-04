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
    excluirUsuario(usuario) {
      console.log("Excluir:", usuario);
      // Sua lógica de exclusão aqui
    },
    createNewExpense() {
      this.modalActive = true;
    },
    updateExpenseRecord(newValue) {
      this.expenseRecord = newValue;
    },
    saveExpenseRecord(dados) {
      console.log("Usuário salvo:", dados);
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
