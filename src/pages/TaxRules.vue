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
            <div class="mt-4" style="text-align: right; font-weight: bold">
              Total de gastos não dedutíveis: {{ totalNaoDedutivel }}
            </div>
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
  name: "TaxRules",
  components: {
    SimpleTable,
  },
  data() {
    return {
      colunas: [
        { key: "nome", label: "Categoria" },
        { key: "descricao", label: "Descrição" },
        { key: "dedutivel", label: "Dedutível" },
        { key: "limite_anual", label: "Teto Anual" },
        { key: "gasto_total", label: "Total Gasto" },
        { key: "restante_para_limite", label: "Restante" },
      ],
      dados: [],
      totalNaoDedutivel: "R$ 0,00",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async fetchTaxSummary() {
      try {
        this.loading = true;
        const response = await api.get("/fiscal-rules/tax-summary"); // ou o path correto conforme o router
        const { resumo_por_categoria, total_nao_dedutivel } = response.data;

        this.dados = resumo_por_categoria.map((item) => ({
          ...item,
          limite_anual: this.formatCurrency(item.limite_anual),
          gasto_total: this.formatCurrency(item.gasto_total),
          restante_para_limite:
            item.restante_para_limite !== null
              ? this.formatCurrency(item.restante_para_limite)
              : "—",
        }));

        this.totalNaoDedutivel = this.formatCurrency(total_nao_dedutivel);
      } catch (error) {
        console.error("Erro ao buscar resumo fiscal:", error);
        this.errorMessage = "Erro ao carregar resumo fiscal.";
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
    this.fetchTaxSummary();
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
