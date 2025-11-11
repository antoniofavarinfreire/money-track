<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <sidebar-link to="/app/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/app/expense-list">
        <md-icon>content_paste</md-icon>
        <p>Lista Gastos</p>
      </sidebar-link>
      <sidebar-link to="/app/deductibles">
        <md-icon>library_books</md-icon>
        <p>Lista Dedutiveis</p>
      </sidebar-link>
      <sidebar-link to="/app/tax-rules">
        <md-icon>balance</md-icon>
        <p>Regras Fiscais</p>
      </sidebar-link>
      <sidebar-link @click.native="logout" class="logout-link" to="/">
        <md-icon>exit_to_app</md-icon>
        <p>Sair</p>
      </sidebar-link>
      <!-- <sidebar-link to="/app/user">
        <md-icon>person</md-icon>
        <p>Usuário</p>
      </sidebar-link> -->
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import api from "@/services/api";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token"); // limpa o token
      this.$router.push("/"); // redireciona
    },
  },
};
</script>
