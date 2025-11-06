import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import RegistrationModal from "@/components/Modals/RegistrationModal.vue";
import api from "@/services/api"; // Importa o api para mockar

// Mock do módulo api
vi.mock("@/services/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("RegistrationModal.vue", () => {
  let wrapper;

  const defaultModelValue = {
    expense_date: "",
    description: "",
    amount: 0,
    income_tax_category_id: "", // Adicionado para teste de validação
    transaction_type: "",
    financial_source: "",
  };

  const mockCategorias = [
    { income_tax_category_id: 1, name: "Alimentação" },
    { income_tax_category_id: 2, name: "Transporte" },
  ];

  beforeEach(() => {
    // Configura o mock da API para retornar as categorias
    api.get.mockResolvedValue({ data: mockCategorias });

    wrapper = mount(RegistrationModal, {
      propsData: {
        value: false,
        modelValue: { ...defaultModelValue },
      },
    });
    // Espia a função de busca para verificar se é chamada
    vi.spyOn(wrapper.vm, "buscarCategorias");
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
    vi.clearAllMocks(); // Limpa mocks após cada teste
  });

  describe("Renderização", () => {
    // ... Seus testes de renderização existentes ...
    it("deve renderizar o componente corretamente", () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".modal").exists()).toBe(true);
    });

    it("deve exibir o título correto", () => {
      expect(wrapper.find(".modal-title").text()).toBe("Cadastro de Despesas");
    });

    it("deve ter todos os campos do formulário (3 selects)", () => {
      expect(wrapper.find('input[type="date"]').exists()).toBe(true);
      expect(wrapper.findAll('input[type="text"]').length).toBe(2);
      // Categoria, Ocorrência e Origem Financeira
      expect(wrapper.findAll("select").length).toBe(3);
    });

    it("deve ter os botões Cancelar e Salvar", () => {
      const buttons = wrapper.findAll(".modal-footer button");
      expect(buttons.length).toBe(2);
      expect(buttons.at(0).text()).toBe("Cancelar");
      expect(buttons.at(1).text()).toBe("Salvar");
    });
  });

  describe("Visibilidade e Categorias", () => {
    it("não deve exibir o modal quando value é false", () => {
      expect(wrapper.vm.localVisible).toBe(false);
      expect(wrapper.find(".modal").element.style.display).toBe("none");
    });

    it("deve exibir o modal, buscar categorias e limpar erros quando value é true", async () => {
      // Cria um erro antes de abrir
      wrapper.vm.errors = { expense_date: "Erro antigo" };
      wrapper.vm.errorMessage = "Mensagem antiga";

      await wrapper.setProps({ value: true });

      expect(wrapper.vm.localVisible).toBe(true);
      expect(wrapper.find(".modal").element.style.display).toBe("block");
      expect(wrapper.find(".modal").classes()).toContain("show");

      // Teste novo: Verificar se a busca é chamada
      expect(wrapper.vm.buscarCategorias).toHaveBeenCalledTimes(1);

      // Teste novo: Verificar se os erros são limpos
      expect(Object.keys(wrapper.vm.errors).length).toBe(0);
      expect(wrapper.vm.errorMessage).toBe("");
    });

    it("deve emitir evento update:modelValue quando computedModalValue é alterado", async () => {
      const newValue = { ...defaultModelValue, description: "Novo" };
      wrapper.vm.computedModalValue = newValue;
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")[0][0]).toEqual(newValue);
    });
  });

  describe("Campos do Formulário", () => {
    it("deve atualizar expense_date quando o usuário digita", async () => {
      const input = wrapper.find('input[type="date"]');
      await input.setValue("2025-11-03");
      expect(wrapper.vm.computedModalValue.expense_date).toBe("2025-11-03");
    });

    it("deve atualizar description quando o usuário digita", async () => {
      const inputs = wrapper.findAll('input[type="text"]');
      await inputs.at(0).setValue("Compra no supermercado");
      expect(wrapper.vm.computedModalValue.description).toBe(
        "Compra no supermercado"
      );
    });

    it("deve atualizar transaction_type (Ocorrência) quando selecionado", async () => {
      // Ocorrência é o segundo select no template
      const select = wrapper.findAll("select").at(1);
      // O valor deve ser o 'value' do option, não o texto
      await select.setValue("credito");
      expect(wrapper.vm.computedModalValue.transaction_type).toBe("credito");
    });

    it("deve atualizar financial_source (Origem Financeira) quando selecionado", async () => {
      // Origem Financeira é o terceiro select no template
      const select = wrapper.findAll("select").at(2);
      // O valor deve ser o 'value' do option, não o texto
      await select.setValue("PIX(BB)");
      expect(wrapper.vm.computedModalValue.financial_source).toBe("PIX(BB)");
    });

    it("deve renderizar as categorias após a busca e permitir seleção", async () => {
      // Garante que o modal está aberto para acionar a busca
      await wrapper.setProps({ value: true });
      await wrapper.vm.$nextTick();

      // Verifica se as categorias mockadas estão na lista de categorias do componente
      expect(wrapper.vm.categorias).toEqual(mockCategorias);

      // Seleciona o primeiro select (Categoria)
      const selectCategoria = wrapper.findAll("select").at(0);

      // Verifica se as opções de categorias foram renderizadas
      // Deve ter 1 'disabled selected' + 2 mockCategorias = 3 options
      const options = selectCategoria.findAll("option");
      expect(options.length).toBe(3);
      expect(options.at(1).text()).toBe("Alimentação");
      expect(options.at(1).attributes().value).toBe("1"); // Verifica o ID como string

      // Seleciona uma categoria (o value é um número no v-model.number)
      await selectCategoria.setValue(1);

      // O Vue Test Utils converte o setValue para string, então precisamos
      // checar o valor convertido no computedModalValue
      expect(wrapper.vm.computedModalValue.income_tax_category_id).toBe(1);
    });
  });

  describe("handleInput - Formatação de Valor", () => {
    // ... Seus testes de handleInput existentes ...
    it("deve converter entrada numérica corretamente (12345 -> 123.45)", async () => {
      const event = { target: { value: "12345" } };
      wrapper.vm.handleInput(event);
      await wrapper.vm.$nextTick();

      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].amount).toBe(123.45);
      expect(event.target.value).toBe("R$ 123,45");
    });

    it("deve remover caracteres não numéricos e formatar", async () => {
      const event = { target: { value: "R$ 100,00" } };
      wrapper.vm.handleInput(event);
      await wrapper.vm.$nextTick();

      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted).toBeTruthy();
      expect(emitted[0][0].amount).toBe(100.0);
      expect(event.target.value).toBe("R$ 100,00");
    });

    it("deve limpar erro do campo amount ao digitar, mas manter errorMessage se houver outros erros", async () => {
      wrapper.vm.errors = {
        amount: "Erro de teste",
        expense_date: "Outro erro",
      };
      wrapper.vm.errorMessage = "Preencha tudo"; // Usando a mensagem padrão de erro
      const event = { target: { value: "100" } };
      wrapper.vm.handleInput(event);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.errors.amount).toBeUndefined();
      expect(wrapper.vm.errors.expense_date).toBe("Outro erro"); // O errorMessage deve ser mantido, pois AINDA há um erro (expense_date)
      expect(wrapper.vm.errorMessage).toBe("Preencha tudo");
    });
  });

  describe("Validação do Formulário", () => {
    // ... Seus testes de validação existentes (com ajustes para a categoria) ...

    it("deve validar categoria obrigatória", () => {
      wrapper = mount(RegistrationModal, {
        propsData: {
          value: true,
          modelValue: {
            ...defaultModelValue,
            expense_date: "2025-11-03",
            amount: 100,
            transaction_type: "debito",
            financial_source: "PIX(BB)",
            income_tax_category_id: "", // Deixa vazio para testar
          },
        },
      });

      const isValid = wrapper.vm.validateForm();
      expect(isValid).toBe(false);
      expect(wrapper.vm.errors.income_tax_category_id).toBe(
        "A categoria é obrigatória"
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
            income_tax_category_id: 1, // Preenchido
            transaction_type: "debito",
            financial_source: "Salário(Dinheiro)",
          },
        },
      });

      const isValid = wrapper.vm.validateForm();
      expect(isValid).toBe(true);
      expect(Object.keys(wrapper.vm.errors).length).toBe(0);
    });
  });

  describe("Ações do Modal", () => {
    // ... Seus testes de ação existentes (com ajustes na validação) ...

    it("deve salvar e fechar com formulário válido", async () => {
      const validData = {
        expense_date: "2025-11-03",
        description: "Teste",
        amount: 100,
        income_tax_category_id: 1, // Preenchido
        transaction_type: "debito",
        financial_source: "Salário(Dinheiro)",
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
});
