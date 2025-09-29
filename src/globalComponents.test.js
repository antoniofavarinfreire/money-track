import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock do componente DropDown
const MockDropDown = {
  name: "DropDown",
  template: "<div>Mock DropDown</div>",
};

vi.mock("./components/Dropdown.vue", () => ({
  default: MockDropDown,
}));

describe("GlobalComponents", () => {
  let GlobalComponents;
  let mockVue;

  beforeEach(async () => {
    vi.clearAllMocks();
    GlobalComponents = (await import("./globalComponents")).default;
    mockVue = { component: vi.fn() };
  });

  it("should export a plugin object with install method", () => {
    expect(GlobalComponents).toBeDefined();
    expect(typeof GlobalComponents.install).toBe("function");
  });

  it("should register the drop-down component globally", () => {
    GlobalComponents.install(mockVue);

    expect(mockVue.component).toHaveBeenCalledTimes(1);
    expect(mockVue.component).toHaveBeenCalledWith("drop-down", MockDropDown);
  });

  it("should register component with kebab-case name", () => {
    GlobalComponents.install(mockVue);

    const [componentName] = mockVue.component.mock.calls[0];
    expect(componentName).toBe("drop-down");
  });

  it("should not throw errors during installation", () => {
    expect(() => GlobalComponents.install(mockVue)).not.toThrow();
  });

  it("should only register components, not directives or mixins", () => {
    mockVue.directive = vi.fn();
    mockVue.mixin = vi.fn();

    GlobalComponents.install(mockVue);

    expect(mockVue.component).toHaveBeenCalled();
    expect(mockVue.directive).not.toHaveBeenCalled();
    expect(mockVue.mixin).not.toHaveBeenCalled();
  });
});
