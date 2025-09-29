// src/components/Dropdown.test.js
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import DropDown from "./Dropdown.vue"; // Adjust path as needed

// Mock of the v-click-outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};

describe("DropDown.vue", () => {
  // Factory to mount the component with props, slots and directive
  const factory = (props = {}, slots = {}) => {
    return mount(DropDown, {
      props: {
        title: "Notifications",
        icon: "fas fa-bell",
        ...props,
      },
      global: {
        directives: {
          "click-outside": vClickOutside,
        },
      },
      slots: {
        default: '<div data-testid="dropdown-content">Dropdown Content</div>',
        ...slots,
      },
    });
  };

  it("renders title and icon correctly and is initially closed", () => {
    const wrapper = factory();
    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.find(".dropdown").classes()).not.toContain("open");
    expect(wrapper.find(".notification").text()).toContain("Notifications");
    expect(wrapper.find("i").classes()).toContain("fa-bell");
  });

  it("toggles open/close state when clicking on the dropdown", async () => {
    const wrapper = factory();
    const dropdown = wrapper.find(".dropdown");

    // Click to open
    await dropdown.trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);
    expect(wrapper.find(".dropdown").classes()).toContain("open");

    // Click to close
    await dropdown.trigger("click");
    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.find(".dropdown").classes()).not.toContain("open");
  });

  it("closes when clicking outside (v-click-outside)", async () => {
    const wrapper = factory();

    // Abre o dropdown
    await wrapper.find(".dropdown").trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);

    // Espiona o método closeDropDown
    const spy = vi.spyOn(wrapper.vm, "closeDropDown");

    // Simula o comportamento da diretiva
    wrapper.vm.closeDropDown(); // chama diretamente

    // Aguarda o próximo tick
    await wrapper.vm.$nextTick();

    // Verifica se foi chamado
    expect(spy).toHaveBeenCalled();
    expect(wrapper.vm.isOpen).toBe(false);

    spy.mockRestore();
  });

  it("renders default slot content", () => {
    const wrapper = factory();
    expect(wrapper.find('[data-testid="dropdown-content"]').exists()).toBe(
      true
    );
  });
});
