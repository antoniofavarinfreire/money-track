const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const FiscalRule = require("../../models/FiscalRules"); // Modelo Sequelize
const IncomeTaxCategory = require("../../models/IncomeTax_Categories");
const Expense = require("../../models/Expenses");
const FiscalRulesLimit = require("../../models/FiscalRules");
const JWT_SECRET = "chave-super-secreta";
const { Op } = require("sequelize");

const rateLimit = require("express-rate-limit");
// limiter de taxa: máximo de 100 solicitações por 15 minutos por IP
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 500, // máximo de 500 solicitações por IP
  standardHeaders: true, // informa os headers RateLimit
  legacyHeaders: false, // desativa os headers X-RateLimit
});

// Aplicar limiter de taxa a todas as rotas neste roteador
router.use(limiter);

// Middleware de verificação do token
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

// Criar regra fiscal
router.post("/create-tax-rule", limiter, verifyToken, async (req, res) => {
  try {
    const { fiscal_year, income_tax_category_id, annual_limit, monthly_limit } =
      req.body;

    const existingRule = await FiscalRule.findOne({
      where: { fiscal_year, income_tax_category_id },
    });
    if (existingRule)
      return res.status(400).json({
        error: "Já existe uma regra para essa categoria nesse ano fiscal.",
      });

    const newRule = await FiscalRule.create({
      fiscal_year,
      income_tax_category_id,
      annual_limit,
      monthly_limit,
      last_updated: new Date(),
    });

    res.status(201).json({ message: "Regra fiscal criada", rule: newRule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Atualizar regra fiscal específica
router.put(
  "/update-id-tax-rule/:id",
  limiter,
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { annual_limit, monthly_limit } = req.body;

      const rule = await FiscalRule.findByPk(id);
      if (!rule) return res.status(404).json({ error: "Regra não encontrada" });

      rule.annual_limit =
        annual_limit !== undefined ? annual_limit : rule.annual_limit;
      rule.monthly_limit =
        monthly_limit !== undefined ? monthly_limit : rule.monthly_limit;
      rule.last_updated = new Date();

      await rule.save();
      res.json({ message: "Regra atualizada", rule });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
);

// Visualizar todas as regras fiscais
router.get("/view-all-tax-rule", limiter, verifyToken, async (req, res) => {
  try {
    const rules = await FiscalRule.findAll();
    res.json(rules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Visualizar regra fiscal específica
router.get("/view-id-tax-rule/:id", limiter, verifyToken, async (req, res) => {
  try {
    const rule = await FiscalRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ error: "Regra não encontrada" });
    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Deletar regra fiscal específica
router.delete(
  "/delete-id-tax-rule/:id",
  limiter,
  verifyToken,
  async (req, res) => {
    try {
      const rule = await FiscalRule.findByPk(req.params.id);
      if (!rule) return res.status(404).json({ error: "Regra não encontrada" });

      await rule.destroy();
      res.json({ message: "Regra fiscal deletada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
);

// Retornar todas as categorias com os limites fiscais correspondentes
router.get(
  "/tax-limit-with-categories",
  limiter,
  verifyToken,
  async (req, res) => {
    try {
      const categories = await IncomeTaxCategory.findAll({
        attributes: [
          "income_tax_category_id",
          "name",
          "deductible",
          "description",
        ],
        include: [
          {
            model: FiscalRulesLimit,
            as: "fiscal_limits",
            attributes: [
              "rule_id",
              "fiscal_year",
              "annual_limit",
              "monthly_limit",
              "last_updated",
            ],
          },
        ],
      });

      res.json(categories);
    } catch (error) {
      console.error("Erro ao buscar categorias com limites:", error);
      res
        .status(500)
        .json({ error: "Erro ao buscar categorias com limites fiscais." });
    }
  }
);

// Nova rota: resumo fiscal do usuário logado (baseado no ano vigente)
router.get("/tax-summary", limiter, verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const currentYear = new Date().getFullYear();

    const categories = await IncomeTaxCategory.findAll({
      attributes: [
        "income_tax_category_id",
        "name",
        "deductible",
        "description",
      ],
      include: [
        {
          model: FiscalRulesLimit,
          as: "fiscal_limits",
          where: { fiscal_year: currentYear },
          attributes: ["annual_limit"],
          required: false,
        },
        {
          model: Expense,
          as: "expenses",
          attributes: ["amount", "transaction_type", "expense_date"],
          where: {
            user_id: userId,
            expense_date: {
              [Op.between]: [
                new Date(`${currentYear}-01-01`),
                new Date(`${currentYear}-12-31`),
              ],
            },
          },
          required: false,
        },
      ],
    });

    // 🔹 Separa dedutíveis e não dedutíveis
    const dedutiveis = categories.filter((c) => c.deductible === true);
    const naoDedutiveis = categories.filter((c) => c.deductible === false);

    // 🔹 Monta o resumo das dedutíveis
    const resumoPorCategoria = dedutiveis.map((cat) => {
      const fiscalRule =
        cat.fiscal_limits.length > 0 ? cat.fiscal_limits[0] : null;

      // Soma apenas créditos (gastos)
      const totalGasto = cat.expenses
        .filter((exp) => exp.transaction_type === "credito")
        .reduce((acc, exp) => acc + parseFloat(exp.amount || 0), 0);

      const teto = fiscalRule ? parseFloat(fiscalRule.annual_limit || 0) : 0;
      const restante = Math.max(teto - totalGasto, 0);

      return {
        categoria: cat.name,
        descricao: cat.description,
        dedutivel: "Sim",
        teto_anual: teto,
        total_gasto: totalGasto,
        restante: restante,
      };
    });

    // 🔹 Soma total de gastos não dedutíveis (somente créditos)
    const totalNaoDedutivel = naoDedutiveis.reduce((acc, cat) => {
      const totalGasto = cat.expenses
        .filter(
          (exp) =>
            exp.transaction_type &&
            exp.transaction_type.toLowerCase() === "credito"
        )
        .reduce((acc, exp) => acc + parseFloat(exp.amount || 0), 0);
      return acc + totalGasto;
    }, 0);

    // 🔹 Retorno final
    res.json({
      ano_fiscal: currentYear,
      resumo_por_categoria: resumoPorCategoria,
      total_gastos_nao_dedutiveis: totalNaoDedutivel,
    });
  } catch (error) {
    console.error("Erro ao gerar resumo fiscal:", error);
    res.status(500).json({ error: "Erro ao gerar resumo fiscal do usuário." });
  }
});

module.exports = router;
