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
import api from "@/services/api";

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
        { key: "category_name", label: "Categoria" },
        { key: "is_deductible", label: "Dedutível" },
      ],
      dados: [], // inicia vazio
      expenseRecord: {
        expense_date: "",
        description: "",
        amount: 0,
        transaction_type: "",
        financial_source: "",
        vaidade_for_tax: 0,
      },
      modalActive: false,
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async fetchExpenses() {
      try {
        this.loading = true;
        const token = localStorage.getItem("token");
        console.log("🔹 Token no localStorage:", token);

        const response = await api.get("/expenses/view-user-all-expenses");
        console.log("🔹 Resposta do servidor:", response.data);
        this.dados = response.data;
      } catch (error) {
        console.error("❌ Erro ao buscar despesas:", error.response || error);
        this.errorMessage = "Erro ao carregar despesas.";
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
  mounted() {
    this.fetchExpenses();
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
