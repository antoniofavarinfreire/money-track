import { vi } from "vitest";

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
