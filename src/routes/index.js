import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes,
});

// ✅ Navigation Guard para proteger as rotas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // Se a rota requer autenticação e não há token
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next("/login");
  } else {
    next();
  }
});

export default router;
