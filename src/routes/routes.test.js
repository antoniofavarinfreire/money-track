import { describe, it, expect, vi } from "vitest";
import routes from "./routes";

describe("Routes Configuration", () => {
  it("deve exportar um array de rotas", () => {
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });

  describe("Rota de Login", () => {
    it("deve ter a rota /login configurada corretamente", () => {
      const loginRoute = routes.find((route) => route.path === "/login");

      expect(loginRoute).toBeDefined();
      expect(loginRoute.name).toBe("Login");
      expect(loginRoute.component).toBeDefined();
    });
  });

  describe("Rota raiz", () => {
    it("deve redirecionar / para /login", () => {
      const rootRoute = routes.find((route) => route.path === "/");

      expect(rootRoute).toBeDefined();
      expect(rootRoute.redirect).toBe("/login");
    });
  });

  describe("Rotas da aplicação", () => {
    let appRoute;

    beforeEach(() => {
      appRoute = routes.find((route) => route.path === "/app");
    });

    it("deve ter a rota /app configurada", () => {
      expect(appRoute).toBeDefined();
      expect(appRoute.component).toBeDefined();
    });

    it("deve redirecionar /app para /app/dashboard", () => {
      expect(appRoute.redirect).toBe("/app/dashboard");
    });

    it("deve ter rotas filhas configuradas", () => {
      expect(appRoute.children).toBeDefined();
      expect(Array.isArray(appRoute.children)).toBe(true);
      expect(appRoute.children.length).toBe(4);
    });

    describe("Rota Dashboard", () => {
      it("deve ter a rota dashboard configurada corretamente", () => {
        const dashboardRoute = appRoute.children.find(
          (route) => route.path === "dashboard"
        );

        expect(dashboardRoute).toBeDefined();
        expect(dashboardRoute.name).toBe("Dashboard");
        expect(dashboardRoute.component).toBeDefined();
      });
    });

    describe("Rota User Profile", () => {
      it("deve ter a rota user configurada corretamente", () => {
        const userRoute = appRoute.children.find(
          (route) => route.path === "user"
        );

        expect(userRoute).toBeDefined();
        expect(userRoute.name).toBe("User Profile");
        expect(userRoute.component).toBeDefined();
      });
    });

    describe("Rota Table List", () => {
      it("deve ter a rota table configurada corretamente", () => {
        const tableRoute = appRoute.children.find(
          (route) => route.path === "table"
        );

        expect(tableRoute).toBeDefined();
        expect(tableRoute.name).toBe("Table List");
        expect(tableRoute.component).toBeDefined();
      });
    });

    describe("Rota Typography", () => {
      it("deve ter a rota typography configurada corretamente", () => {
        const typographyRoute = appRoute.children.find(
          (route) => route.path === "typography"
        );

        expect(typographyRoute).toBeDefined();
        expect(typographyRoute.name).toBe("Typography");
        expect(typographyRoute.component).toBeDefined();
      });
    });
  });

  describe("Estrutura das rotas", () => {
    it("deve ter exatamente 3 rotas principais", () => {
      expect(routes.length).toBe(3);
    });

    it("todas as rotas devem ter a propriedade path", () => {
      routes.forEach((route) => {
        expect(route.path).toBeDefined();
        expect(typeof route.path).toBe("string");
      });
    });

    it("rotas filhas devem ter nome e componente", () => {
      const appRoute = routes.find((route) => route.path === "/app");

      appRoute.children.forEach((child) => {
        expect(child.name).toBeDefined();
        expect(child.component).toBeDefined();
        expect(typeof child.name).toBe("string");
      });
    });
  });
});
