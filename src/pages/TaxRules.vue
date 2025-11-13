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
              :isLoading="loading"
            />
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
  components: { SimpleTable },
  data() {
    return {
      colunas: [
        { key: "categoria", label: "Categoria" },
        { key: "descricao", label: "Descrição" },
        { key: "dedutivel", label: "Dedutível" },
        { key: "teto_anual", label: "Teto Anual" },
        { key: "total_gasto", label: "Total Gasto" },
        { key: "restante", label: "Restante" },
      ],
      dados: [],
      totalNaoDedutivel: "R$ 0,00",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async fetchTaxSummary() {
      this.loading = true;
      try {
        const response = await api.get("/fiscal-rules/tax-summary");

        const { resumo_por_categoria, total_gastos_nao_dedutiveis } =
          response.data;

        // Mapeia e formata os dados para exibição na tabela
        this.dados = resumo_por_categoria.map((item) => ({
          categoria: item.categoria,
          descricao: item.descricao,
          dedutivel: item.dedutivel,
          teto_anual: this.formatCurrency(item.teto_anual),
          total_gasto: this.formatCurrency(item.total_gasto),
          restante: this.formatCurrency(item.restante),
        }));

        // Total de gastos não dedutíveis
        this.totalNaoDedutivel = this.formatCurrency(
          total_gastos_nao_dedutiveis
        );
      } catch (error) {
        console.error("Erro ao carregar resumo fiscal:", error);
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
  },
  mounted() {
    this.fetchTaxSummary();
  },
  computed: {
    dadosFormatados() {
      return this.dados;
    },
  },
});
</script>
