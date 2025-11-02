const IncomeTaxCategory = require("./IncomeTax_Categories");
const FiscalRulesLimit = require("./FiscalRules");
const FiscalRule = require("./FiscalRules");
const User = require("./Users");
const Expense = require("./Expenses");

// Todas as associações ficam aqui, após os models já terem sido importados

// IncomeTaxCategory -> FiscalRulesLimit
IncomeTaxCategory.hasMany(FiscalRulesLimit, {
  foreignKey: "income_tax_category_id",
  as: "fiscal_limits",
});

// FiscalRule -> IncomeTaxCategory
FiscalRule.belongsTo(IncomeTaxCategory, {
  foreignKey: "income_tax_category_id",
  as: "category",
});

// Expense -> User
Expense.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Expense -> IncomeTaxCategory
Expense.belongsTo(IncomeTaxCategory, {
  foreignKey: "income_tax_category_id",
  as: "category",
});

module.exports = {
  IncomeTaxCategory,
  FiscalRulesLimit,
  FiscalRule,
};
