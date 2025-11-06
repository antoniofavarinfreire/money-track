// routes/index.js
import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes,
});

// Navigation Guard global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // console.log para depuração
  // console.log("Rota atual:", to.fullPath, "Token:", token);

  // Se a rota ou algum parent requer auth e não há token → redireciona
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    // console.log("Usuário não autenticado, redirecionando para /login");
    next({ path: "/" });
  } else if ((to.path === "/" || to.path === "/register") && token) {
    // se já estiver logado, impede voltar para login/register
    next({ path: "/app/dashboard" });
  } else {
    next();
  }
});

export default router;
