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

        const response = await api.get("/expenses/view-user-all-expenses");

        this.dados = response.data;
      } catch (error) {
        this.errorMessage = "Erro ao carregar despesas.";
      } finally {
        this.loading = false;
      }
    },
    async excluirUsuario(usuario) {
      try {
        if (!confirm("Deseja realmente excluir esta despesa?")) return;

        // Chamada DELETE para a API
        const token = localStorage.getItem("token");
        await api.delete("/expenses/delete-user-expense", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { expense_id: usuario.expense_id }, // body da requisição
        });

        // Remove o item da lista local para atualizar a tabela
        this.dados = this.dados.filter(
          (item) => item.expense_id !== usuario.expense_id
        );

        alert("Despesa deletada com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar despesa:", error.response || error);
        alert(
          error.response?.data?.error ||
            "Erro ao deletar despesa. Tente novamente."
        );
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
    createNewExpense() {
      this.modalActive = true;
    },
    updateExpenseRecord(newValue) {
      this.expenseRecord = newValue;
    },
    async saveExpenseRecord(dados) {
      try {
        const token = localStorage.getItem("token");

        // Chamada POST para criar a despesa
        const response = await api.post(
          "/expenses/create-user-expense",
          {
            expense_date: dados.expense_date,
            description: dados.description || "",
            amount: dados.amount,
            transaction_type: dados.transaction_type, // "debito" ou "credito"
            financial_source: dados.financial_source,
            validated_for_tax: dados.validated_for_tax || false,
            income_tax_category_id: dados.income_tax_category_id, // sem || null
            invoice_file_path: dados.invoice_file_path || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.dados.push(response.data);
        alert("Despesa cadastrada com sucesso!");

        // Limpa o formulário do modal
        this.expenseRecord = {
          expense_date: "",
          description: "",
          amount: 0,
          transaction_type: "",
          financial_source: "",
          income_tax_category_id: "",
        };
        await this.fetchExpenses();
      } catch (error) {
        console.error("❌ Erro ao cadastrar despesa:", error);

        if (error.response) {
          console.error("🔸 Status:", error.response.status);
          console.error("🔸 Dados do erro:", error.response.data);
        }

        alert(
          error.response?.data?.error ||
            "Erro ao cadastrar despesa. Verifique o console para mais detalhes."
        );
      }
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
