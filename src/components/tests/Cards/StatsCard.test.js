import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { mount, createLocalVue } from "@vue/test-utils";
import VueMaterial from "vue-material";
import StatsCard from "@/components/Cards/StatsCard.vue";

const localVue = createLocalVue();
localVue.use(VueMaterial);

describe("StatsCard.vue", () => {
  let wrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  it("deve renderizar o componente corretamente", () => {
    wrapper = mount(StatsCard, { localVue });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("md-card-stats");
  });

  it("deve aplicar a prop dataBackgroundColor ao header", () => {
    const color = "blue";
    wrapper = mount(StatsCard, {
      localVue,
      propsData: {
        dataBackgroundColor: color,
      },
    });

    const header = wrapper.find(".md-card-header");
    expect(header.attributes("data-background-color")).toBe(color);
  });

  it("deve usar string vazia como valor padrão para dataBackgroundColor", () => {
    wrapper = mount(StatsCard, { localVue });
    const header = wrapper.find(".md-card-header");
    expect(header.attributes("data-background-color")).toBe("");
  });

  it("deve renderizar o slot header", () => {
    wrapper = mount(StatsCard, {
      localVue,
      slots: {
        header: '<div class="test-header">Header Content</div>',
      },
    });

    expect(wrapper.find(".test-header").exists()).toBe(true);
    expect(wrapper.find(".test-header").text()).toBe("Header Content");
  });

  it("deve renderizar o slot content", () => {
    wrapper = mount(StatsCard, {
      localVue,
      slots: {
        content: '<p class="test-content">Content Text</p>',
      },
    });

    expect(wrapper.find(".test-content").exists()).toBe(true);
    expect(wrapper.find(".test-content").text()).toBe("Content Text");
  });

  it("deve renderizar o slot footer", () => {
    wrapper = mount(StatsCard, {
      localVue,
      slots: {
        footer: '<span class="test-footer">Footer Info</span>',
      },
    });

    expect(wrapper.find(".test-footer").exists()).toBe(true);
    expect(wrapper.find(".test-footer").text()).toBe("Footer Info");
  });

  it("deve renderizar todos os slots simultaneamente", () => {
    wrapper = mount(StatsCard, {
      localVue,
      propsData: {
        dataBackgroundColor: "green",
      },
      slots: {
        header: '<div class="header-slot">Header</div>',
        content: '<div class="content-slot">Content</div>',
        footer: '<div class="footer-slot">Footer</div>',
      },
    });

    expect(wrapper.find(".header-slot").exists()).toBe(true);
    expect(wrapper.find(".content-slot").exists()).toBe(true);
    expect(wrapper.find(".footer-slot").exists()).toBe(true);
  });

  it('deve ter o atributo md-alignment="left" no card-actions', () => {
    wrapper = mount(StatsCard, { localVue });
    const actions = wrapper.find(".md-card-actions");
    expect(actions.exists()).toBe(true);
    // Verifica se o componente md-card-actions foi renderizado com a prop correta
    const actionsComponent = wrapper.findComponent({ name: "md-card-actions" });
    if (actionsComponent.exists()) {
      expect(actionsComponent.props("mdAlignment")).toBe("left");
    }
  });

  it("deve aceitar diferentes cores como prop", () => {
    const colors = ["red", "blue", "green", "orange", "purple"];

    colors.forEach((color) => {
      wrapper = mount(StatsCard, {
        localVue,
        propsData: {
          dataBackgroundColor: color,
        },
      });

      const header = wrapper.find(".md-card-header");
      expect(header.attributes("data-background-color")).toBe(color);
      wrapper.destroy();
    });
  });
});
