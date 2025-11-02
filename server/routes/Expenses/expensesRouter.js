const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Expense = require("../../models/Expenses");
const IncomeTaxCategory = require("../../models/IncomeTax_Categories");
const FiscalRulesLimit = require("../../models/FiscalRules");
const JWT_SECRET = "chave-super-secreta";

const rateLimit = require("express-rate-limit");
const { deprecations } = require("sass");
const { Op, literal } = require("sequelize");

// limiter de taxa: máximo de 100 solicitações por 5 minutos por IP
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(limiter);

// Middleware JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

// Criar Expense (com novos campos)
router.post("/create-id-expense", limiter, verifyToken, async (req, res) => {
  try {
    const {
      user_id,
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
      transaction_type,
      financial_source,
    } = req.body;

    const newExpense = await Expense.create({
      user_id,
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
      transaction_type,
      financial_source,
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar expense" });
  }
});

// Visualizar todos Expenses
router.get("/view-id-all-expense", limiter, verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar expenses" });
  }
});

// Visualizar Expense específico
router.post("/view-id-expense", limiter, verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const expense = await Expense.findByPk(id);
    if (!expense)
      return res.status(404).json({ error: "Expense não encontrado" });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar expense" });
  }
});

// Atualizar Expense específico (com novos campos)
router.put("/update-id-expense", limiter, verifyToken, async (req, res) => {
  try {
    const {
      expense_id,
      user_id,
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
      transaction_type,
      financial_source,
    } = req.body;

    const expense = await Expense.findByPk(expense_id);
    if (!expense)
      return res.status(404).json({ error: "Expense não encontrado" });

    await expense.update({
      user_id,
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
      transaction_type,
      financial_source,
    });

    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar expense" });
  }
});

// Deletar Expense específico
router.delete("/delete-id-expense", limiter, verifyToken, async (req, res) => {
  try {
    const { expense_id } = req.body;
    const expense = await Expense.findByPk(expense_id);
    if (!expense)
      return res.status(404).json({ error: "Expense não encontrado" });

    await expense.destroy();
    res.json({ message: "Expense deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar expense" });
  }
});

// Criar Expense vinculado ao usuário logado (com novos campos)
router.post("/create-user-expense", limiter, verifyToken, async (req, res) => {
  try {
    const {
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
      transaction_type,
      financial_source,
    } = req.body;

    const newExpense = await Expense.create({
      user_id: req.userId,
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
      transaction_type,
      financial_source,
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar despesa" });
  }
});

// Visualizar todas as despesas do usuário logado (com nome da categoria)
router.get(
  "/view-user-all-expenses",
  limiter,
  verifyToken,
  async (req, res) => {
    try {
      const expenses = await Expense.findAll({
        where: { user_id: req.userId },
        include: [
          {
            model: IncomeTaxCategory,
            as: "category",
            attributes: ["name", "deductible"],
          },
        ],
      });

      console.log("🔹 Despesas encontradas:", expenses.length);

      const formatted = expenses.map((e) => ({
        expense_id: e.expense_id,
        expense_date: e.expense_date,
        amount: e.amount,
        description: e.description,
        transaction_type: e.transaction_type,
        financial_source: e.financial_source,
        category_name: e.category ? e.category.name : "Sem categoria",
        is_deductible: e.category
          ? e.category.deductible
            ? "Sim"
            : "Não"
          : "—",
      }));

      res.json(formatted);
    } catch (err) {
      console.error("❌ Erro ao buscar despesas:", err);
      res.status(500).json({ error: "Erro ao buscar despesas" });
    }
  }
);

// Visualizar apenas as despesas dedutíveis do usuário logado
router.get(
  "/view-user-deductible-expenses",
  limiter,
  verifyToken,
  async (req, res) => {
    try {
      const expenses = await Expense.findAll({
        where: { user_id: req.userId },
        include: [
          {
            model: IncomeTaxCategory,
            as: "category",
            attributes: ["name", "deductible"],
            where: { deductible: true }, // 🔹 Filtra apenas categorias dedutíveis
          },
        ],
      });

      console.log("🔹 Despesas dedutíveis encontradas:", expenses.length);

      const formatted = expenses.map((e) => ({
        expense_id: e.expense_id,
        expense_date: e.expense_date,
        amount: e.amount,
        description: e.description,
        transaction_type: e.transaction_type,
        financial_source: e.financial_source,
        category_name: e.category ? e.category.name : "Sem categoria",
        is_deductible: e.category?.deductible ? "Sim" : "Não",
      }));

      res.json(formatted);
    } catch (err) {
      console.error("❌ Erro ao buscar despesas dedutíveis:", err);
      res.status(500).json({ error: "Erro ao buscar despesas dedutíveis" });
    }
  }
);

// Visualizar despesa específica do usuário logado
router.post("/view-user-expense", limiter, verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const expense = await Expense.findOne({
      where: { expense_id: id, user_id: req.userId },
    });
    if (!expense)
      return res.status(404).json({ error: "Despesa não encontrada" });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar despesa" });
  }
});

// Atualizar despesa do usuário logado (com novos campos)
router.put("/update-user-expense", limiter, verifyToken, async (req, res) => {
  try {
    const {
      expense_id,
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
      transaction_type,
      financial_source,
    } = req.body;

    const expense = await Expense.findOne({
      where: { expense_id, user_id: req.userId },
    });
    if (!expense)
      return res.status(404).json({ error: "Despesa não encontrada" });

    await expense.update({
      income_tax_category_id,
      expense_date,
      amount,
      description,
      validated_for_tax,
      invoice_file_path,
      transaction_type,
      financial_source,
    });

    res.json({ message: "Despesa atualizada com sucesso", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar despesa" });
  }
});

// Deletar despesa do usuário logado
router.delete(
  "/delete-user-expense",
  limiter,
  verifyToken,
  async (req, res) => {
    try {
      const { expense_id } = req.body;

      const expense = await Expense.findOne({
        where: { expense_id, user_id: req.userId },
      });
      if (!expense)
        return res.status(404).json({ error: "Despesa não encontrada" });

      await expense.destroy();
      res.json({ message: "Despesa deletada com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao deletar despesa" });
    }
  }
);

// Retornar despesas com flag de dedutibilidade
router.get("/with-deductible-flag", limiter, verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: IncomeTaxCategory,
          as: "category",
          attributes: ["name", "deductible"],
        },
      ],
    });

    const formatted = expenses.map((e) => ({
      expense_id: e.expense_id,
      expense_date: e.expense_date,
      amount: e.amount,
      description: e.description,
      validated_for_tax: e.validated_for_tax,
      invoice_file_path: e.invoice_file_path,
      income_tax_category_id: e.income_tax_category_id,
      transaction_type: e.transaction_type,
      financial_source: e.financial_source,
      is_deductible: e.category?.deductible === 1,
      category_name: e.category?.name || null,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar despesas com flag dedutível:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar despesas com flag dedutível." });
  }
});

// Buscar todas as categorias do imposto de renda
router.get("/income-tax-categories", verifyToken, async (req, res) => {
  try {
    const categories = await IncomeTax_Category.findAll({
      attributes: ["income_tax_category_id", "name", "deductible"],
      order: [["name", "ASC"]],
    });
    res.json(categories);
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

//ALTERAR dePOIS

router.get("/summary", limiter, verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // ----------------------
    // KPIS
    // ----------------------

    // Cartões de crédito (transaction_type contém "crédito")
    const creditSum = await Expense.sum("amount", {
      where: {
        user_id: userId,
        transaction_type: { [Op.like]: "%credito%" },
      },
    });

    // Débitos (Vale refeição)
    const debitSum = await Expense.sum("amount", {
      where: {
        user_id: userId,
        transaction_type: { [Op.like]: "%debito%" },
      },
    });

    // Gastos dos últimos 30 dias
    const last30DaysSum = await Expense.sum("amount", {
      where: {
        user_id: userId,
        expense_date: {
          [Op.between]: [
            literal("DATE_SUB(CURDATE(), INTERVAL 30 DAY)"),
            literal("CURDATE()"),
          ],
        },
      },
    });

    // Gastos dos próximos 30 dias
    const next30DaysSum = await Expense.sum("amount", {
      where: {
        user_id: userId,
        expense_date: {
          [Op.between]: [
            literal("CURDATE()"),
            literal("DATE_ADD(CURDATE(), INTERVAL 30 DAY)"),
          ],
        },
      },
    });

    // ----------------------
    // TABELA: Últimos gastos cadastrados
    // ----------------------
    const recentExpenses = await Expense.findAll({
      where: { user_id: userId },
      include: [
        {
          model: IncomeTaxCategory,
          as: "category",
          attributes: ["name", "deductible"],
        },
      ],
      order: [["expense_date", "DESC"]],
      limit: 6,
      attributes: [
        "expense_id",
        "description",
        "amount",
        "expense_date",
        "transaction_type",
      ],
    });

    // Formatar despesas para o front
    const formattedExpenses = recentExpenses.map((e) => ({
      expense_id: e.expense_id,
      description: e.description,
      amount: e.amount,
      expense_date: e.expense_date,
      transaction_type: e.transaction_type,
      category_name: e.category ? e.category.name : "Sem categoria",
      is_deductible:
        e.category && e.category.deductible ? "Sim" : e.category ? "Não" : "—",
    }));

    // ----------------------
    // FEED: Últimas atualizações das regras fiscais
    // ----------------------
    const recentFiscalUpdates = await FiscalRulesLimit.findAll({
      include: [
        {
          model: IncomeTaxCategory,
          as: "category",
          attributes: ["name"],
        },
      ],
      order: [["last_updated", "DESC"]],
      limit: 6,
      attributes: [
        "rule_id",
        "fiscal_year",
        "annual_limit",
        "monthly_limit",
        "last_updated",
      ],
    });

    const formattedFiscalUpdates = recentFiscalUpdates.map((rule) => ({
      rule_id: rule.rule_id,
      category_name: rule.category ? rule.category.name : "Desconhecida",
      fiscal_year: rule.fiscal_year,
      annual_limit: rule.annual_limit,
      monthly_limit: rule.monthly_limit,
      last_updated: rule.last_updated,
    }));

    // ----------------------
    // Retornar tudo
    // ----------------------
    res.json({
      kpis: {
        credit_sum: creditSum || 0,
        debit_sum: debitSum || 0,
        last_30_days_sum: last30DaysSum || 0,
        next_30_days_sum: next30DaysSum || 0,
      },
      recent_expenses: formattedExpenses,
      recent_fiscal_updates: formattedFiscalUpdates,
    });
  } catch (err) {
    console.error("❌ Erro ao carregar dados do dashboard:", err);
    res.status(500).json({ error: "Erro ao carregar dados do dashboard" });
  }
});

module.exports = router;
