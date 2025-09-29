// src/routes/routes.test.js
import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock dos componentes e assets ANTES de importar as rotas
beforeAll(() => {
  // Mock da imagem
  vi.mock("@/assets/img/faces/marc.jpg", () => ({
    default: "mocked-image.jpg",
  }));
});

// Mock dos componentes Vue
vi.mock("@/pages/Layout/DashboardLayout.vue", () => ({
  default: { name: "DashboardLayout" },
}));
vi.mock("@/pages/Dashboard.vue", () => ({
  default: { name: "Dashboard" },
}));
vi.mock("@/pages/UserProfile.vue", () => ({
  default: { name: "UserProfile" },
}));
vi.mock("@/pages/TableList.vue", () => ({
  default: { name: "TableList" },
}));
vi.mock("@/pages/Typography.vue", () => ({
  default: { name: "Typography" },
}));
vi.mock("@/pages/Login.vue", () => ({
  default: { name: "Login" },
}));

import routes from "./routes";

describe("Vue Router Routes Configuration", () => {
  it("should export a valid array of routes", () => {
    expect(Array.isArray(routes)).toBe(true);
  });

  it("should define 3 top-level routes", () => {
    expect(routes).toHaveLength(3);
  });

  it('should define the "/login" route correctly', () => {
    const loginRoute = routes.find((r) => r.path === "/login");
    expect(loginRoute).toBeDefined();
    expect(loginRoute.name).toBe("Login");
    expect(loginRoute.component).toBeDefined();
  });

  it('should define the root path "/" redirect to "/login"', () => {
    const rootRedirect = routes.find((r) => r.path === "/");
    expect(rootRedirect).toBeDefined();
    expect(rootRedirect.redirect).toBe("/login");
  });

  it('should define the main "/app" route with correct structure and redirect', () => {
    const appRoute = routes.find((r) => r.path === "/app");
    expect(appRoute).toBeDefined();
    expect(appRoute.component).toBeDefined();
    expect(appRoute.redirect).toBe("/app/dashboard");
    expect(Array.isArray(appRoute.children)).toBe(true);
    expect(appRoute.children).toHaveLength(4);
  });

  it('should contain the "Dashboard" child route under /app', () => {
    const appRoute = routes.find((r) => r.path === "/app");
    const dashboardChild = appRoute.children.find(
      (c) => c.path === "dashboard"
    );

    expect(dashboardChild).toBeDefined();
    expect(dashboardChild.name).toBe("Dashboard");
    expect(dashboardChild.component).toBeDefined();
  });

  it('should contain the "User Profile" child route under /app', () => {
    const appRoute = routes.find((r) => r.path === "/app");
    const userChild = appRoute.children.find((c) => c.path === "user");

    expect(userChild).toBeDefined();
    expect(userChild.name).toBe("User Profile");
    expect(userChild.component).toBeDefined();
  });

  it('should contain the "Table List" child route under /app', () => {
    const appRoute = routes.find((r) => r.path === "/app");
    const tableChild = appRoute.children.find((c) => c.path === "table");

    expect(tableChild).toBeDefined();
    expect(tableChild.name).toBe("Table List");
    expect(tableChild.component).toBeDefined();
  });

  it('should contain the "Typography" child route under /app', () => {
    const appRoute = routes.find((r) => r.path === "/app");
    const typographyChild = appRoute.children.find(
      (c) => c.path === "typography"
    );

    expect(typographyChild).toBeDefined();
    expect(typographyChild.name).toBe("Typography");
    expect(typographyChild.component).toBeDefined();
  });
});
