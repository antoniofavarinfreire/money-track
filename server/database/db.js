const { Sequelize } = require("sequelize");

// Função para parsear a URL do banco (formato Railway/Produção)
function parseDatabaseUrl(url) {
  // Formato: mysql://user:password@host:port/database
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(regex);

  if (match) {
    return {
      username: match[1],
      password: match[2],
      host: match[3],
      port: parseInt(match[4]),
      database: match[5],
    };
  }
  return null;
}

let sequelize;

// Se existe DATABASE_URL (produção), usa ela
if (process.env.DATABASE_URL) {
  console.log("🔧 Using DATABASE_URL for connection");

  const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

  if (dbConfig) {
    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: "mysql",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        dialectOptions: {
          connectTimeout: 60000,
          ssl:
            process.env.NODE_ENV === "production"
              ? {
                  require: true,
                  rejectUnauthorized: false,
                }
              : false,
        },
      }
    );
  } else {
    throw new Error("Invalid DATABASE_URL format");
  }
} else {
  // Configuração local ou via variáveis individuais
  console.log("🔧 Using individual environment variables or defaults");

  sequelize = new Sequelize(
    process.env.DB_NAME || "MoneyTrack",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "10042023",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

// Testar a conexão (não bloquear se falhar)
async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection test successful");
  } catch (error) {
    console.error("⚠️  Database connection test failed:", error.message);
  }
}

authenticate();

module.exports = sequelize;
