import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import RegistrationModal from "@/components/Modals/RegistrationModal.vue";

describe("RegistrationModal.vue", () => {
  let wrapper;

  const defaultModelValue = {
    expense_date: "",
    description: "",
    amount: 0,
    transaction_type: "",
    financial_source: "",
  };

  beforeEach(() => {
    wrapper = mount(RegistrationModal, {
      propsData: {
        value: false,
        modelValue: { ...defaultModelValue },
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  describe("Renderização", () => {
    it("deve renderizar o componente corretamente", () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".modal").exists()).toBe(true);
    });

    it("deve exibir o título correto", () => {
      expect(wrapper.find(".modal-title").text()).toBe("Cadastro de Despesas");
    });

    it("deve ter todos os campos do formulário", () => {
      expect(wrapper.find('input[type="date"]').exists()).toBe(true);
      expect(wrapper.findAll('input[type="text"]').length).toBe(2);
      expect(wrapper.findAll("select").length).toBe(2);
    });

    it("deve ter os botões Cancelar e Salvar", () => {
      const buttons = wrapper.findAll(".modal-footer button");
      expect(buttons.length).toBe(2);
      expect(buttons.at(0).text()).toBe("Cancelar");
      expect(buttons.at(1).text()).toBe("Salvar");
    });
  });

  describe("Visibilidade do Modal", () => {
    it("não deve exibir o modal quando value é false", () => {
      expect(wrapper.vm.localVisible).toBe(false);
      expect(wrapper.find(".modal").element.style.display).toBe("none");
    });

    it("deve exibir o modal quando value é true", async () => {
      await wrapper.setProps({ value: true });
      expect(wrapper.vm.localVisible).toBe(true);
      expect(wrapper.find(".modal").element.style.display).toBe("block");
      expect(wrapper.find(".modal").classes()).toContain("show");
    });

    it("deve emitir evento input quando localVisible muda", async () => {
      wrapper.vm.localVisible = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("input")).toBeTruthy();
      expect(wrapper.emitted("input")[0]).toEqual([true]);
    });
  });

  describe("Campos do Formulário", () => {
    it("deve atualizar expense_date quando o usuário digita", async () => {
      const input = wrapper.find('input[type="date"]');
      await input.setValue("2025-11-03");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.computedModalValue.expense_date).toBe("2025-11-03");
    });

    it("deve atualizar description quando o usuário digita", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      // O primeiro input[type="text"] é o campo de descrição
      await inputs.at(0).setValue("Compra no supermercado");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.computedModalValue.description).toBe(
        "Compra no supermercado"
      );
    });

    it("deve formatar o valor monetário corretamente", () => {
      wrapper = mount(RegistrationModal, {
        propsData: {
          value: true,
          modelValue: { ...defaultModelValue, amount: 1234.56 },
        },
      });
      expect(wrapper.vm.formattedAmount).toBe("R$ 1.234,56");
    });

    it("deve formatar valor zero corretamente", () => {
      expect(wrapper.vm.formattedAmount).toBe("R$ 0,00");
    });

    it("deve atualizar transaction_type quando selecionado", async () => {
      const select = wrapper.findAll("select").at(0);
      await select.setValue("Débito");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.computedModalValue.transaction_type).toBe("Débito");
    });

    it("deve atualizar financial_source quando selecionado", async () => {
      const select = wrapper.findAll("select").at(1);
      await select.setValue("Salário");
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.computedModalValue.financial_source).toBe("Salário");
    });
  });

  describe("handleInput - Formatação de Valor", () => {
    it("deve converter entrada numérica corretamente", async () => {
      const event = {
        target: { value: "12345" },
      };

      wrapper.vm.handleInput(event);
      await wrapper.vm.$nextTick();

      // Verifica o evento emitido
      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].amount).toBe(123.45);
      expect(event.target.value).toBe("R$ 123,45");
    });

    it("deve remover caracteres não numéricos", async () => {
      const event = {
        target: { value: "R$ 100,00" },
      };

      wrapper.vm.handleInput(event);
      await wrapper.vm.$nextTick();

      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].amount).toBe(100.0);
    });

    it("deve limpar erro do campo amount ao digitar", async () => {
      wrapper.vm.errors = { amount: "Erro de teste" };

      const event = {
        target: { value: "100" },
      };

      wrapper.vm.handleInput(event);
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.errors.amount).toBeUndefined();
    });
  });

  describe("Validação do Formulário", () => {
    it("deve validar data obrigatória", () => {
      const isValid = wrapper.vm.validateForm();
      expect(isValid).toBe(false);
      expect(wrapper.vm.errors.expense_date).toBe("A data é obrigatória");
    });

    it("deve validar valor obrigatório", () => {
      wrapper = mount(RegistrationModal, {
        propsData: {
          value: true,
          modelValue: {
            ...defaultModelValue,
            expense_date: "2025-11-03",
          },
        },
      });

      const isValid = wrapper.vm.validateForm();
      expect(isValid).toBe(false);
      expect(wrapper.vm.errors.amount).toBe("O valor deve ser maior que zero");
    });

    it("deve validar transaction_type obrigatório", () => {
      wrapper = mount(RegistrationModal, {
        propsData: {
          value: true,
          modelValue: {
            ...defaultModelValue,
            expense_date: "2025-11-03",
            amount: 100,
          },
        },
      });

      const isValid = wrapper.vm.validateForm();
      expect(isValid).toBe(false);
      expect(wrapper.vm.errors.transaction_type).toBe(
        "A ocorrência é obrigatória"
      );
    });

    it("deve validar financial_source obrigatório", () => {
      wrapper = mount(RegistrationModal, {
        propsData: {
          value: true,
          modelValue: {
            ...defaultModelValue,
            expense_date: "2025-11-03",
            amount: 100,
            transaction_type: "Débito",
          },
        },
      });

      const isValid = wrapper.vm.validateForm();
      expect(isValid).toBe(false);
      expect(wrapper.vm.errors.financial_source).toBe(
        "A origem financeira é obrigatória"
      );
    });

    it("deve passar na validação com todos os campos preenchidos", () => {
      wrapper = mount(RegistrationModal, {
        propsData: {
          value: true,
          modelValue: {
            expense_date: "2025-11-03",
            description: "Teste",
            amount: 100,
            transaction_type: "Débito",
            financial_source: "Salário",
          },
        },
      });

      const isValid = wrapper.vm.validateForm();
      expect(isValid).toBe(true);
      expect(Object.keys(wrapper.vm.errors).length).toBe(0);
    });

    it("deve definir errorMessage quando há erros", () => {
      wrapper.vm.validateForm();
      expect(wrapper.vm.errorMessage).toBe(
        "Por favor, preencha todos os campos obrigatórios."
      );
    });
  });

  describe("Ações do Modal", () => {
    it("deve fechar o modal ao clicar em Cancelar", async () => {
      await wrapper.setProps({ value: true });
      const cancelButton = wrapper.findAll(".modal-footer button").at(0);
      await cancelButton.trigger("click");

      expect(wrapper.emitted("cancel")).toBeTruthy();
      expect(wrapper.vm.localVisible).toBe(false);
    });

    it("deve fechar o modal ao clicar no X", async () => {
      await wrapper.setProps({ value: true });
      const closeButton = wrapper.find(".btn-close");
      await closeButton.trigger("click");

      expect(wrapper.emitted("cancel")).toBeTruthy();
      expect(wrapper.vm.localVisible).toBe(false);
    });

    it("não deve salvar com formulário inválido", async () => {
      await wrapper.setProps({ value: true });
      const saveButton = wrapper.findAll(".modal-footer button").at(1);
      await saveButton.trigger("click");

      expect(wrapper.emitted("save")).toBeFalsy();
      expect(wrapper.vm.localVisible).toBe(true);
    });

    it("deve salvar e fechar com formulário válido", async () => {
      const validData = {
        expense_date: "2025-11-03",
        description: "Teste",
        amount: 100,
        transaction_type: "Débito",
        financial_source: "Salário",
      };

      wrapper = mount(RegistrationModal, {
        propsData: {
          value: true,
          modelValue: validData,
        },
      });

      const saveButton = wrapper.findAll(".modal-footer button").at(1);
      await saveButton.trigger("click");

      expect(wrapper.emitted("save")).toBeTruthy();
      expect(wrapper.emitted("save")[0][0]).toEqual(validData);
      expect(wrapper.vm.localVisible).toBe(false);
    });
  });

  describe("Computed Properties", () => {
    it("computedModalValue deve retornar cópia do modelValue", () => {
      const testData = {
        expense_date: "2025-11-03",
        description: "Teste",
        amount: 100,
        transaction_type: "Débito",
        financial_source: "Salário",
      };

      wrapper = mount(RegistrationModal, {
        propsData: {
          value: true,
          modelValue: testData,
        },
      });

      expect(wrapper.vm.computedModalValue).toEqual(testData);
    });

    it("deve emitir update:modelValue ao modificar computedModalValue", () => {
      const newValue = {
        ...defaultModelValue,
        description: "Nova descrição",
      };

      wrapper.vm.computedModalValue = newValue;

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")[0][0]).toEqual(newValue);
    });
  });

  describe("Limpeza de Erros", () => {
    it("deve limpar erros ao abrir o modal", async () => {
      wrapper.vm.errors = { expense_date: "Erro" };
      wrapper.vm.errorMessage = "Mensagem de erro";

      await wrapper.setProps({ value: true });

      expect(Object.keys(wrapper.vm.errors).length).toBe(0);
      expect(wrapper.vm.errorMessage).toBe("");
    });
  });

  describe("Exibição de Erros", () => {
    it("deve exibir mensagem de erro para campo expense_date", async () => {
      wrapper.vm.errors = { expense_date: "A data é obrigatória" };
      await wrapper.vm.$nextTick();

      const errorDivs = wrapper.findAll(".invalid-feedback");
      expect(errorDivs.length).toBeGreaterThan(0);
      expect(errorDivs.at(0).text()).toBe("A data é obrigatória");
    });

    it("deve exibir mensagem de erro para campo amount", async () => {
      wrapper.vm.errors = { amount: "O valor deve ser maior que zero" };
      await wrapper.vm.$nextTick();

      const errorDivs = wrapper.findAll(".invalid-feedback");
      // Procura pela mensagem específica
      const amountError = errorDivs.filter(
        (div) => div.text() === "O valor deve ser maior que zero"
      );
      expect(amountError.length).toBe(1);
      expect(amountError.at(0).text()).toBe("O valor deve ser maior que zero");
    });
  });
});
