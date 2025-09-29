import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("GlobalDirectives", () => {
  let mockVue;
  let GlobalDirectives;
  let mockClickOutsideDirective;

  beforeEach(async () => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();
    vi.resetModules();

    // Mock do vue-clickaway
    mockClickOutsideDirective = {
      bind: vi.fn(),
      unbind: vi.fn(),
      inserted: vi.fn(),
      update: vi.fn(),
    };

    vi.doMock("vue-clickaway", () => ({
      directive: mockClickOutsideDirective,
    }));

    // Importa o módulo após configurar o mock
    GlobalDirectives = (await import("./globalDirectives")).default;

    // Cria um mock do Vue
    mockVue = {
      directive: vi.fn(),
      component: vi.fn(),
      mixin: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Module Structure", () => {
    it("should export a valid plugin object", () => {
      expect(GlobalDirectives).toBeDefined();
      expect(GlobalDirectives).toBeTypeOf("object");
    });

    it("should have an install method", () => {
      expect(GlobalDirectives.install).toBeDefined();
      expect(GlobalDirectives.install).toBeTypeOf("function");
    });

    it("should accept Vue as parameter in install method", () => {
      expect(GlobalDirectives.install.length).toBe(1);
    });
  });

  describe("Directive Registration", () => {
    it("should register the click-outside directive", () => {
      GlobalDirectives.install(mockVue);

      expect(mockVue.directive).toHaveBeenCalledWith(
        "click-outside",
        mockClickOutsideDirective
      );
    });

    it("should call Vue.directive exactly once", () => {
      GlobalDirectives.install(mockVue);

      expect(mockVue.directive).toHaveBeenCalledTimes(1);
    });

    it("should use the directive from vue-clickaway package", () => {
      GlobalDirectives.install(mockVue);

      const [, directiveDefinition] = mockVue.directive.mock.calls[0];
      expect(directiveDefinition).toBe(mockClickOutsideDirective);
    });

    it("should register directive with correct name format", () => {
      GlobalDirectives.install(mockVue);

      const [directiveName] = mockVue.directive.mock.calls[0];
      expect(directiveName).toBe("click-outside");
      expect(directiveName).toMatch(/^[a-z-]+$/); // kebab-case format
    });
  });

  describe("Plugin Behavior", () => {
    it("should not throw errors during installation", () => {
      expect(() => {
        GlobalDirectives.install(mockVue);
      }).not.toThrow();
    });

    it("should not register components", () => {
      GlobalDirectives.install(mockVue);

      expect(mockVue.component).not.toHaveBeenCalled();
    });

    it("should not add mixins", () => {
      GlobalDirectives.install(mockVue);

      expect(mockVue.mixin).not.toHaveBeenCalled();
    });

    it("should handle multiple installations gracefully", () => {
      GlobalDirectives.install(mockVue);
      GlobalDirectives.install(mockVue);

      // Deve ser chamado duas vezes, mas sem erros
      expect(mockVue.directive).toHaveBeenCalledTimes(2);
    });
  });

  describe("Integration", () => {
    it("should maintain directive properties from vue-clickaway", () => {
      GlobalDirectives.install(mockVue);

      const [, directiveDefinition] = mockVue.directive.mock.calls[0];

      // Verifica que a diretiva tem os hooks esperados
      expect(directiveDefinition).toHaveProperty("bind");
      expect(directiveDefinition).toHaveProperty("unbind");
      expect(directiveDefinition).toHaveProperty("inserted");
      expect(directiveDefinition).toHaveProperty("update");
    });
  });
});
