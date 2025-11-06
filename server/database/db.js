const { Sequelize } = require("sequelize");

// Configuração da conexão:
// Sequelize('nome_do_banco', 'usuário', 'senha', { ...opções });
const sequelize = new Sequelize("MoneyTrack", "root", "10042023", {
  host: "localhost", // Se estiver rodando na sua máquina
  dialect: "mysql", // Diz ao Sequelize qual banco usar
});

// Testar a conexão
async function authenticate() {
  try {
    await sequelize.authenticate();
  } catch (error) {}
}

authenticate();

module.exports = sequelize;
