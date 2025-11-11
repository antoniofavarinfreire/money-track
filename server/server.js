const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/Users/userRouter");
const incomeTaxCategoriesRoutes = require("./routes/IncomeTaxCategories/incomeTaxCategoriesRouter");
const expensesRoutes = require("./routes/Expenses/expensesRouter");
const fiscalRulesRoutes = require("./routes/FiscalRules/fiscalRulesRouter");
const sequelize = require("./database/db");
require("./models/associations");
sequelize.sync();

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://money-track-service.azurewebsites.net",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/users", userRoutes);
app.use("/income-tax-categories", incomeTaxCategoriesRoutes);
app.use("/expenses", expensesRoutes);
app.use("/fiscal-rules", fiscalRulesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("✅ MoneyTrack API online!");
});
