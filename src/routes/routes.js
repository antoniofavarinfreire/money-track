import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import DeductiblesList from "@/pages/DeductiblesList.vue";
import Login from "@/pages/Login.vue";
import Register from "../pages/Register/RegisterNewUser.vue"; // Import do novo componente de registro

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register", // Rota de cadastro
    name: "Register",
    component: Register,
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/app",
    component: DashboardLayout,
    redirect: "/app/dashboard",
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "user",
        name: "Perfil Usuário",
        component: UserProfile,
      },
      {
        path: "expense-list",
        name: "Lista de Gastos",
        component: TableList,
      },
      {
        path: "deductibles",
        name: "Lita de dedutiveis",
        component: DeductiblesList,
      },
    ],
  },
];

export default routes;
