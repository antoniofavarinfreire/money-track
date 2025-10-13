import { vi } from "vitest";
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

// 2. Mock do VueRouter
const MockVueRouter = vi.fn().mockImplementation(function (options) {
  this.options = options;
  this.push = vi.fn();
  this.replace = vi.fn();
  this.go = vi.fn();
  this.back = vi.fn();
  this.forward = vi.fn();
});
MockVueRouter.install = vi.fn();
vi.mock("vue-router", () => ({ default: MockVueRouter }));

// 3. Mock do App (usar caminho completo com extensão nos mocks)
vi.mock("./App", () => ({ default: { name: "MockApp" } }));
vi.mock("./App.vue", () => ({ default: { name: "MockApp" } }));

// 4. Mock das rotas
vi.mock("./routes/routes", () => ({ default: [{ path: "/mock" }] }));
vi.mock("./routes/routes.js", () => ({ default: [{ path: "/mock" }] }));

// 5. Mocks dos plugins locais
const MockGlobalComponents = { install: vi.fn() };
vi.mock("./globalComponents", () => ({ default: MockGlobalComponents }));
vi.mock("./globalComponents.js", () => ({ default: MockGlobalComponents }));

const MockGlobalDirectives = { install: vi.fn() };
vi.mock("./globalDirectives", () => ({ default: MockGlobalDirectives }));
vi.mock("./globalDirectives.js", () => ({ default: MockGlobalDirectives }));

const MockNotifications = { install: vi.fn() };
vi.mock("./components/NotificationPlugin", () => ({
  default: MockNotifications,
}));
vi.mock("./components/NotificationPlugin.js", () => ({
  default: MockNotifications,
}));
vi.mock("./components/NotificationPlugin.vue", () => ({
  default: MockNotifications,
}));

const MockMaterialDashboard = { install: vi.fn() };
vi.mock("./material-dashboard", () => ({ default: MockMaterialDashboard }));
vi.mock("./material-dashboard.js", () => ({ default: MockMaterialDashboard }));

// 6. Mock do Chartist
const MockChartist = { version: "1.0" };
vi.mock("chartist", () => ({ default: MockChartist }));
