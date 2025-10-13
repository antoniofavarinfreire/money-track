import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("main.js initialization", () => {
  let originalDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    MockVue.prototype.$Chartist = undefined;

    // Salva o document original
    originalDocument = global.document;

    // Cria um mock do DOM element
    if (typeof document !== "undefined") {
      const mockElement = document.createElement("div");
      mockElement.id = "app";
      if (!document.getElementById("app")) {
        document.body.appendChild(mockElement);
      }
    }
  });

  afterEach(() => {
    // Limpa o elemento do DOM
    if (typeof document !== "undefined") {
      const appElement = document.getElementById("app");
      if (appElement) {
        appElement.remove();
      }
    }

    vi.resetModules();
  });

  it("should initialize Vue, register all plugins, and configure the router", async () => {
    // Importa o main.js que executará o código de inicialização
    await import("./main.js");

    // 1. Verificação do Vue.use (Registro de Plugins)
    expect(mockVueUse).toHaveBeenCalledWith(MockVueRouter);
    expect(mockVueUse).toHaveBeenCalledWith(MockMaterialDashboard);
    expect(mockVueUse).toHaveBeenCalledWith(MockGlobalComponents);
    expect(mockVueUse).toHaveBeenCalledWith(MockGlobalDirectives);
    expect(mockVueUse).toHaveBeenCalledWith(MockNotifications);

    // 2. Verificação do Protótipo
    expect(MockVue.prototype.$Chartist).toBe(MockChartist);

    // 3. Verificação da Instância Vue
    expect(MockVue).toHaveBeenCalledTimes(1);

    const vueConfig = MockVue.mock.calls[0][0];

    expect(vueConfig.el).toBe("#app");
    expect(vueConfig.render).toBeInstanceOf(Function);
    expect(vueConfig.data.Chartist).toBe(MockChartist);

    // Verifica a configuração do Router
    expect(vueConfig.router).toBeInstanceOf(MockVueRouter);
    expect(vueConfig.router.options.routes).toEqual([{ path: "/mock" }]);
    expect(vueConfig.router.options.linkExactActiveClass).toBe(
      "nav-item active"
    );
  });
});
