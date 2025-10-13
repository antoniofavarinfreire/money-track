import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import App from "@/App.vue";

describe("App.vue", () => {
  it("renderiza corretamente", () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("contém o componente router-view", () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: true,
        },
      },
    });

    expect(wrapper.findComponent({ name: "RouterView" }).exists()).toBe(true);
  });

  it("renderiza sem erros", () => {
    expect(() => {
      mount(App, {
        global: {
          stubs: {
            RouterView: true,
          },
        },
      });
    }).not.toThrow();
  });
});
