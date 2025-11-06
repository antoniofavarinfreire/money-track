<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="green">
          <template slot="header">
            <md-icon>store</md-icon>
          </template>

          <template slot="content">
            <p class="category">Cartões de crédito</p>
            <h3 class="title">R${{ Number(kpis.credit_sum).toFixed(2) }}</h3>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>content_copy</md-icon>
          </template>

          <template slot="content">
            <p class="category">Débitos</p>
            <h3 class="title">R${{ Number(kpis.debit_sum).toFixed(2) }}</h3>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="red">
          <template slot="header">
            <md-icon>info_outline</md-icon>
          </template>

          <template slot="content">
            <p class="category">Gastos Ultimos 30 Dias</p>
            <h3 class="title">
              R${{ Number(kpis.last_30_days_sum).toFixed(2) }}
            </h3>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <i class="fab fa-twitter"></i>
          </template>

          <template slot="content">
            <p class="category">Gastos Próximos 30 dias</p>
            <h3 class="title">
              R${{ Number(kpis.next_30_days_sum).toFixed(2) }}
            </h3>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">Ultimos gastos cadastrados</h4>
          </md-card-header>
          <md-card-content>
            <table class="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Transação</th>
                  <th>Categoria</th>
                  <th>Dedutível</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="expense in recentExpenses" :key="expense.expense_id">
                  <td>{{ expense.description }}</td>
                  <td>R${{ Number(expense.amount).toFixed(2) }}</td>
                  <td>
                    {{ new Date(expense.expense_date).toLocaleDateString() }}
                  </td>
                  <td>{{ expense.transaction_type }}</td>
                  <td>{{ expense.category_name }}</td>
                  <td>{{ expense.is_deductible }}</td>
                </tr>
              </tbody>
            </table>
          </md-card-content>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Ultimos atualizações das regras fiscais</h4>
          </md-card-header>
          <md-card-content>
            <ul class="update-list">
              <li
                v-for="rule in recentFiscalUpdates"
                :key="rule.rule_id"
                class="update-item"
              >
                <strong>{{ rule.category_name }}</strong>
                <br />
                <small>
                  Atualizado em
                  {{ new Date(rule.last_updated).toLocaleDateString() }} — Ano
                  fiscal: {{ rule.fiscal_year }}
                </small>
                <br />
                <span>
                  Limite anual: R${{
                    Number(rule.annual_limit).toFixed(2) || 0
                  }}
                  | Limite mensal: R${{
                    Number(rule.monthly_limit).toFixed(2) || 0
                  }}
                </span>
              </li>
            </ul>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { StatsCard, OrderedTable } from "@/components";
import api from "@/services/api";

export default {
  components: { StatsCard },
  data() {
    return {
      kpis: {
        credit_sum: 0,
        debit_sum: 0,
        last_30_days_sum: 0,
        next_30_days_sum: 0,
      },
      recentExpenses: [],
      recentFiscalUpdates: [],
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/expenses/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.kpis = data.kpis;
      this.recentExpenses = data.recent_expenses;
      this.recentFiscalUpdates = data.recent_fiscal_updates;
    } catch (error) {
      // console.error("Erro ao carregar dashboard:", error);
    }
  },
};
</script>
