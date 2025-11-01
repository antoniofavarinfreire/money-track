<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <simple-table
              :data="dadosFormatados"
              :columns="colunas"
              :initial-per-page="10"
              :show-delete-button="true"
              @delete="excluirUsuario"
            ></simple-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <FabButton
      variant="primary"
      icon="bi bi-plus"
      title="Adicionar novo usuário"
      @click="createNewExpense"
    />
    <RegistrationModal
      v-model="modalActive"
      :model-value="expenseRecord"
      @update:modelValue="updateExpenseRecord"
      @save="saveExpenseRecord"
      @cancel="cancelRegister"
    />
  </div>
</template>

<script>
import { SimpleTable } from "@/components";
import { defineComponent } from "vue";
import FabButton from "../components/Buttons/FabButton.vue";
import RegistrationModal from "../components/Modals/RegistrationModal.vue";

export default defineComponent({
  components: {
    SimpleTable,
    FabButton,
    RegistrationModal,
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
      dados: [
        {
          expense_date: "2025-11-01",
          description: "Compra de materiais de escritório",
          amount: 350.75,
          transaction_type: "Despesa",
          financial_source: "Conta Corrente",
        },
        {
          expense_date: "2025-11-02",
          description: "Pagamento de energia elétrica",
          amount: 480.9,
          transaction_type: "Despesa",
          financial_source: "Cartão Corporativo",
        },
        {
          expense_date: "2025-11-03",
          description: "Venda de equipamentos usados",
          amount: 1200.0,
          transaction_type: "Receita",
          financial_source: "Conta Corrente",
        },
        {
          expense_date: "2025-11-04",
          description: "Assinatura de software",
          amount: 199.9,
          transaction_type: "Despesa",
          financial_source: "Cartão Corporativo",
        },
        {
          expense_date: "2025-11-05",
          description: "Recebimento de cliente",
          amount: 2500.0,
          transaction_type: "Receita",
          financial_source: "Conta Corrente",
        },
        {
          expense_date: "2025-11-06",
          description: "Compra de material de limpeza",
          amount: 89.5,
          transaction_type: "Despesa",
          financial_source: "Conta Corrente",
        },
        {
          expense_date: "2025-11-07",
          description: "Pagamento de internet",
          amount: 120.0,
          transaction_type: "Despesa",
          financial_source: "Cartão Corporativo",
        },
        {
          expense_date: "2025-11-08",
          description: "Venda de serviços de consultoria",
          amount: 1750.0,
          transaction_type: "Receita",
          financial_source: "Conta Corrente",
        },
        {
          expense_date: "2025-11-09",
          description: "Reembolso de despesas de viagem",
          amount: 450.0,
          transaction_type: "Receita",
          financial_source: "Conta Corrente",
        },
        {
          expense_date: "2025-11-10",
          description: "Compra de suprimentos de TI",
          amount: 670.25,
          transaction_type: "Despesa",
          financial_source: "Cartão Corporativo",
        },
      ],

      expenseRecord: {
        expense_date: "",
        description: "",
        amount: 0,
        transaction_type: "",
        financial_source: "",
      },
      modalActive: false,
      usuarios: [],
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
