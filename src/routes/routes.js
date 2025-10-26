import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
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
        name: "User Profile",
        component: UserProfile,
      },
      {
        path: "table",
        name: "Table List",
        component: TableList,
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography,
      },
    ],
  },
];

export default routes;
