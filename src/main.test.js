import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks de Dependências ---

// 1. Mock do Vue
const mockVueUse = vi.fn();
const mockVuePrototype = {};
const MockVue = vi.fn().mockImplementation(function () {
  this.$mount = vi.fn();
});
MockVue.use = mockVueUse;
MockVue.prototype = mockVuePrototype;
MockVue.extend = vi.fn();

vi.mock("vue", () => ({ default: MockVue }));

// 2. Mock do VueRouter - DEVE ser um construtor
const MockVueRouterInstance = {
  options: {
    routes: [],
    linkExactActiveClass: "",
  },
};

const MockVueRouter = vi.fn().mockImplementation(function (options) {
  this.options = options;
  return this;
});
MockVueRouter.install = vi.fn();
MockVueRouter.version = "3.0.0";

vi.mock("vue-router", () => ({ default: MockVueRouter }));

// 3. Mocks de componentes - SEM extensão .vue
vi.mock("@/App", () => ({ default: { name: "MockApp" } }));
vi.mock("./App", () => ({ default: { name: "MockApp" } }));

// 4. Mock das rotas
vi.mock("@/routes/routes", () => ({ default: [{ path: "/mock" }] }));
vi.mock("./routes/routes", () => ({ default: [{ path: "/mock" }] }));

// 5. Mocks dos plugins locais
const MockGlobalComponents = { install: vi.fn() };
vi.mock("@/globalComponents", () => ({ default: MockGlobalComponents }));
vi.mock("./globalComponents", () => ({ default: MockGlobalComponents }));

const MockGlobalDirectives = { install: vi.fn() };
vi.mock("@/globalDirectives", () => ({ default: MockGlobalDirectives }));
vi.mock("./globalDirectives", () => ({ default: MockGlobalDirectives }));

const MockNotifications = { install: vi.fn() };
vi.mock("@/components/NotificationPlugin", () => ({
  default: MockNotifications,
}));
vi.mock("./components/NotificationPlugin", () => ({
  default: MockNotifications,
}));

const MockMaterialDashboard = { install: vi.fn() };
vi.mock("@/material-dashboard", () => ({ default: MockMaterialDashboard }));
vi.mock("./material-dashboard", () => ({ default: MockMaterialDashboard }));

// 6. Mock do Chartist
const MockChartist = { version: "1.0" };
vi.mock("chartist", () => ({ default: MockChartist }));

// --- Teste Principal ---
describe("main.js initialization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockVue.prototype.$Chartist = undefined;
  });

  it("should initialize Vue, register all plugins, and configure the router", async () => {
    // Importa o main.js que executará o código de inicialização
    await import("@/main.js");

    // 1. Verificação do Vue.use (Registro de Plugins)
    expect(mockVueUse).toHaveBeenCalledWith(MockVueRouter);
    expect(mockVueUse).toHaveBeenCalledWith(MockMaterialDashboard);
    expect(mockVueUse).toHaveBeenCalledWith(MockGlobalComponents);
    expect(mockVueUse).toHaveBeenCalledWith(MockGlobalDirectives);
    expect(mockVueUse).toHaveBeenCalledWith(MockNotifications);

    // 2. Verificação do Protótipo
    expect(MockVue.prototype.$Chartist).toBe(MockChartist);

    // 3. Verificação da Instância VueRouter
    expect(MockVueRouter).toHaveBeenCalledTimes(1);

    // Captura as opções passadas para o VueRouter
    const routerConfig = MockVueRouter.mock.calls[0][0];
    expect(routerConfig.routes).toEqual([{ path: "/mock" }]);
    expect(routerConfig.linkExactActiveClass).toBe("nav-item active");

    // 4. Verificação da Instância Vue
    expect(MockVue).toHaveBeenCalledTimes(1);

    const vueConfig = MockVue.mock.calls[0][0];

    expect(vueConfig.el).toBe("#app");
    expect(vueConfig.render).toBeInstanceOf(Function);
    expect(vueConfig.data.Chartist).toBe(MockChartist);

    // Verifica se o router foi passado para a instância Vue
    expect(vueConfig.router).toBeDefined();
    expect(vueConfig.router.options.routes).toEqual([{ path: "/mock" }]);
    expect(vueConfig.router.options.linkExactActiveClass).toBe(
      "nav-item active"
    );
  });
});
