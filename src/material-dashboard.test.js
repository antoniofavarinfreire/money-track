import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks
const MockSideBar = { install: vi.fn() };
vi.mock("./components/SidebarPlugin", () => ({ default: MockSideBar }));

const MockVueMaterial = { install: vi.fn() };
vi.mock("vue-material", () => ({ default: MockVueMaterial }));

// Mock de assets (CSS/SCSS)
vi.mock("vue-material/dist/vue-material.css", () => ({}));
vi.mock("./assets/scss/material-dashboard.scss", () => ({}));
vi.mock("es6-promise/auto", () => ({}));

describe("Material Dashboard Plugin", () => {
  let MaterialDashboard;
  let mockVue;

  beforeEach(async () => {
    vi.clearAllMocks();
    MaterialDashboard = (await import("./material-dashboard")).default;
    mockVue = { use: vi.fn() };
  });

  it("should export a plugin object with install method", () => {
    expect(MaterialDashboard).toBeDefined();
    expect(typeof MaterialDashboard.install).toBe("function");
  });

  it("should register SideBar and VueMaterial plugins", () => {
    MaterialDashboard.install(mockVue);

    expect(mockVue.use).toHaveBeenCalledTimes(2);
    expect(mockVue.use).toHaveBeenCalledWith(MockSideBar);
    expect(mockVue.use).toHaveBeenCalledWith(MockVueMaterial);
  });

  it("should register plugins in correct order (SideBar first, then VueMaterial)", () => {
    MaterialDashboard.install(mockVue);

    expect(mockVue.use.mock.calls[0][0]).toBe(MockSideBar);
    expect(mockVue.use.mock.calls[1][0]).toBe(MockVueMaterial);
  });

  it("should not throw errors during installation", () => {
    expect(() => MaterialDashboard.install(mockVue)).not.toThrow();
  });
});
