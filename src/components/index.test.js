// src/components/index.test.js
import { describe, it, expect } from "vitest";
import * as Components from "./index"; // ajuste o caminho do barrel file

describe("Components barrel file", () => {
  it("should export all expected components", () => {
    expect(Components.ChartCard).toBeDefined();
    expect(Components.NavTabsCard).toBeDefined();
    expect(Components.StatsCard).toBeDefined();
    expect(Components.NavTabsTable).toBeDefined();
    expect(Components.OrderedTable).toBeDefined();
    expect(Components.SimpleTable).toBeDefined();
  });

  it("should export Vue components", () => {
    Object.values(Components).forEach((component) => {
      // Um componente Vue 3 deve ter a propriedade 'name' definida
      expect(component).toHaveProperty("name");
      expect(typeof component.name).toBe("string");
    });
  });
});
