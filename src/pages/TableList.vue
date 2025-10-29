<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-content>
            <simple-table
              :data="usuarios"
              :columns="colunas"
              :initial-per-page="10"
              @delete="excluirUsuario"
            ></simple-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { SimpleTable } from "@/components";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    SimpleTable,
  },
  data() {
    return {
      colunas: [
        { key: "data", label: "Data" },
        { key: "desciption", label: "Descrição" },
        { key: "age", label: "Valor" },
        { key: "origin", label: "Origem" },
        { key: "description", label: "Idade" },
        // { key: "acoes", label: "Ações", sortable: false, width: "120px" },
      ],
      usuarios: [
        {
          id: 1,
          data: "2025-10-01",
          desciption: "Pagamento de energia elétrica",
          email: "conta.luz@banco.com",
          age: 320.45,
          description: "Débito automático mensal",
          origin: "Conta Corrente",
        },
        {
          id: 2,
          data: "2025-10-03",
          desciption: "Compra supermercado",
          email: "cartao.master@banco.com",
          age: 745.8,
          description: "Compra em rede SuperMais",
          origin: "Cartão de Crédito",
        },
        {
          id: 3,
          data: "2025-10-04",
          desciption: "Transferência recebida",
          email: "joao.silva@empresa.com",
          age: 1500.0,
          description: "Pagamento de serviço freelance",
          origin: "PIX",
        },
        {
          id: 4,
          data: "2025-10-07",
          desciption: "Mensalidade academia",
          email: "fitness@academiafit.com",
          age: 99.9,
          description: "Plano mensal musculação",
          origin: "Cartão de Débito",
        },
        {
          id: 5,
          data: "2025-10-10",
          desciption: "Assinatura streaming",
          email: "pagamento@streamflix.com",
          age: 49.9,
          description: "Cobrança automática mensal",
          origin: "Cartão de Crédito",
        },
        {
          id: 6,
          data: "2025-10-12",
          desciption: "Depósito salário",
          email: "empresa.rh@corporate.com",
          age: 6200.0,
          description: "Salário referente a outubro",
          origin: "Conta Corrente",
        },
        {
          id: 7,
          data: "2025-10-15",
          desciption: "Transferência enviada",
          email: "amigo.carlos@pix.com",
          age: 300.0,
          description: "Empréstimo pessoal",
          origin: "PIX",
        },
        {
          id: 8,
          data: "2025-10-20",
          desciption: "Compra farmácia",
          email: "farmacia.saude@banco.com",
          age: 125.6,
          description: "Medicamentos diversos",
          origin: "Cartão de Crédito",
        },
        {
          id: 9,
          data: "2025-10-25",
          desciption: "Tarifa bancária",
          email: "tarifas@banco.com",
          age: 25.0,
          description: "Manutenção de conta",
          origin: "Conta Corrente",
        },
        {
          id: 10,
          data: "2025-10-28",
          desciption: "Rendimento aplicação",
          email: "investimentos@banco.com",
          age: 230.75,
          description: "Lucro CDB mensal",
          origin: "Investimento",
        },
      ],
    };
  },
  methods: {
    excluirUsuario(usuario) {
      console.log("Excluir:", usuario);
      // Sua lógica de exclusão aqui
    },
  },
});
</script>
