const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/Users/userRouter");
const incomeTaxCategoriesRoutes = require("./routes/IncomeTaxCategories/incomeTaxCategoriesRouter");
const expensesRoutes = require("./routes/Expenses/expensesRouter");
const fiscalRulesRoutes = require("./routes/FiscalRules/fiscalRulesRouter");
const sequelize = require("./database/db");
require("./models/associations");

// Configuração CORS - permite múltiplas origens
const allowedOrigins = [
  "http://localhost:8080",
  "https://green-flower-0fbe0ed0f.3.azurestaticapps.net", // Adicione a URL do seu frontend em produção
  process.env.FRONTEND_URL, // Variável de ambiente para flexibilidade
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requisições sem origin (como Postman, apps mobile)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// IMPORTANTE: Registrar rotas ANTES do app.listen
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "✅ MoneyTrack API online!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Health check para Azure
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Rotas da aplicação
app.use("/users", userRoutes);
app.use("/income-tax-categories", incomeTaxCategoriesRoutes);
app.use("/expenses", expensesRoutes);
app.use("/fiscal-rules", fiscalRulesRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  // console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Porta configurada pelo Azure
const PORT = process.env.PORT || 3000;

// Função para iniciar o servidor
async function startServer() {
  try {
    // Sincronizar banco de dados
    await sequelize.sync();
    // console.log("✅ Database synchronized");

    // Testar conexão
    await sequelize.authenticate();
    // console.log("✅ Database connection established");

    // Iniciar servidor - CRÍTICO: usar 0.0.0.0 no Azure
    app.listen(PORT, "0.0.0.0", () => {
      // console.log(`✅ Server running on port ${PORT}`);
      // console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    // console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  // console.log("SIGTERM received, closing server...");
  await sequelize.close();
  process.exit(0);
});
