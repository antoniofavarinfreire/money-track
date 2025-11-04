import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FabButton from "@/components/Buttons/FabButton.vue";

describe("FabButton.vue", () => {
  describe("Renderização", () => {
    it("deve renderizar o componente corretamente", () => {
      const wrapper = mount(FabButton);
      expect(wrapper.find("button").exists()).toBe(true);
      expect(wrapper.classes()).toContain("btn");
      expect(wrapper.classes()).toContain("fab");
    });

    it("deve renderizar o ícone padrão quando não fornecido", () => {
      const wrapper = mount(FabButton);
      const icon = wrapper.find("i");
      expect(icon.exists()).toBe(true);
      expect(icon.classes()).toContain("bi");
      expect(icon.classes()).toContain("bi-plus");
    });

    it("deve renderizar o ícone personalizado quando fornecido", () => {
      const wrapper = mount(FabButton, {
        propsData: {
          icon: "bi bi-pencil",
        },
      });
      const icon = wrapper.find("i");
      expect(icon.classes()).toContain("bi");
      expect(icon.classes()).toContain("bi-pencil");
    });

    it("deve renderizar conteúdo customizado no slot", () => {
      const wrapper = mount(FabButton, {
        slots: {
          default: '<span class="custom-content">Custom</span>',
        },
      });
      expect(wrapper.find(".custom-content").exists()).toBe(true);
      expect(wrapper.text()).toBe("Custom");
    });
  });

  describe("Props", () => {
    it("deve aplicar o title padrão", () => {
      const wrapper = mount(FabButton);
      expect(wrapper.attributes("title")).toBe("Adicionar");
    });

    it("deve aplicar title personalizado", () => {
      const wrapper = mount(FabButton, {
        propsData: {
          title: "Criar novo",
        },
      });
      expect(wrapper.attributes("title")).toBe("Criar novo");
    });

    it("deve aplicar posição bottom personalizada", () => {
      const wrapper = mount(FabButton, {
        propsData: {
          bottom: "50px",
        },
      });
      expect(wrapper.attributes("style")).toContain("bottom: 50px");
    });

    it("deve aplicar posição right personalizada", () => {
      const wrapper = mount(FabButton, {
        propsData: {
          right: "50px",
        },
      });
      expect(wrapper.attributes("style")).toContain("right: 50px");
    });

    it("deve aplicar tamanho personalizado", () => {
      const wrapper = mount(FabButton, {
        propsData: {
          size: "64px",
        },
      });
      const style = wrapper.attributes("style");
      expect(style).toContain("width: 64px");
      expect(style).toContain("height: 64px");
    });
  });

  describe("Computed Properties", () => {
    it("deve ter os estilos computados corretos", () => {
      const wrapper = mount(FabButton);
      const style = wrapper.attributes("style");

      expect(style).toContain("position: fixed");
      expect(style).toContain("bottom: 24px");
      expect(style).toContain("right: 24px");
      expect(style).toContain("width: 56px");
      expect(style).toContain("height: 56px");
      expect(style).toContain("border-radius: 50%");
      expect(style).toContain("z-index: 1050");
    });
  });

  describe("Eventos", () => {
    it("deve emitir evento click quando clicado", async () => {
      const wrapper = mount(FabButton);
      await wrapper.trigger("click");

      expect(wrapper.emitted()).toHaveProperty("click");
      expect(wrapper.emitted().click).toHaveLength(1);
    });

    it("deve emitir múltiplos eventos click", async () => {
      const wrapper = mount(FabButton);

      await wrapper.trigger("click");
      await wrapper.trigger("click");
      await wrapper.trigger("click");

      expect(wrapper.emitted().click).toHaveLength(3);
    });
  });

  describe("Atributos de Acessibilidade", () => {
    it("deve ter aria-label correto", () => {
      const wrapper = mount(FabButton);
      expect(wrapper.attributes("aria-label")).toBe("Floating Action Button");
    });

    it('deve ter type="button"', () => {
      const wrapper = mount(FabButton);
      expect(wrapper.attributes("type")).toBe("button");
    });

    it("deve ter aria-hidden no ícone", () => {
      const wrapper = mount(FabButton);
      const icon = wrapper.find("i");
      expect(icon.attributes("aria-hidden")).toBe("true");
    });
  });

  describe("Estilos", () => {
    it("deve ter as classes CSS corretas", () => {
      const wrapper = mount(FabButton);
      expect(wrapper.classes()).toContain("btn");
      expect(wrapper.classes()).toContain("fab");
    });

    it("deve ter o gradiente de fundo correto", () => {
      const wrapper = mount(FabButton);
      const style = wrapper.attributes("style");
      expect(style).toContain(
        "background-image: linear-gradient(60deg, rgb(102, 187, 106), rgb(67, 160, 71))"
      );
    });
  });

  describe("Snapshot", () => {
    it("deve corresponder ao snapshot", () => {
      const wrapper = mount(FabButton);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it("deve corresponder ao snapshot com props customizadas", () => {
      const wrapper = mount(FabButton, {
        propsData: {
          icon: "bi bi-star",
          title: "Favoritar",
          bottom: "40px",
          right: "40px",
          size: "64px",
        },
      });
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
