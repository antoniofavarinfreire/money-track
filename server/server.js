if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
global.dbAvailable = true;

const checkDatabase = (req, res, next) => {
  if (!global.dbAvailable && req.path !== "/" && req.path !== "/health") {
    return res.status(503).json({
      error: "Service temporarily unavailable",
      message: "Database connection is not available. Please try again later.",
    });
  }
  next();
};

app.use(checkDatabase);

// IMPORTANTE: Registrar rotas ANTES do app.listen
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "✅ MoneyTrack API online!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", async (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "unknown",
  };

  try {
    await sequelize.authenticate();
    health.database = "connected";
    global.dbAvailable = true;
  } catch (error) {
    health.database = "disconnected";
    health.dbError = error.message;
    global.dbAvailable = false;
  }

  const statusCode = health.database === "connected" ? 200 : 503;
  res.status(statusCode).json(health);
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
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Porta configurada pelo Azure
const PORT = process.env.PORT || 3000;

// Função para tentar reconectar ao banco periodicamente
function scheduleDbReconnect() {
  setInterval(async () => {
    if (!global.dbAvailable) {
      try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("✅ Database reconnected successfully");
        global.dbAvailable = true;
      } catch (error) {
        console.log("⚠️  Database still unavailable, will retry...");
      }
    }
  }, 30000); // Tentar a cada 30 segundos
}

// Função para iniciar o servidor
async function startServer() {
  // Iniciar servidor primeiro - CRÍTICO: usar 0.0.0.0 no Azure
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });

  // Tentar conectar ao banco de dados de forma assíncrona
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    await sequelize.sync();
    console.log("✅ Database synchronized");
    global.dbAvailable = true;
  } catch (error) {
    console.error("⚠️  Database connection failed:", error.message);
    console.error(
      "⚠️  Server will run without database. Check your DB configuration."
    );

    // Não fazer process.exit(1) - deixar o servidor rodar
    // Você pode implementar uma flag global para verificar se o DB está disponível
    global.dbAvailable = false;
  }

  // Iniciar tentativas de reconexão
  scheduleDbReconnect();
}

// Iniciar servidor
startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  // console.log("SIGTERM received, closing server...");
  await sequelize.close();
  process.exit(0);
});
