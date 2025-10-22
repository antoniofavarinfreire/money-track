const { DataTypes } = require('sequelize');
// Assumindo que você tem seu arquivo de conexão no caminho '../db'
const sequelize = require('../database/db'); 

const Usuario = sequelize.define('Usuario', {
    // Coluna: usuario_id (INT AUTO_INCREMENT PRIMARY KEY)
    usuario_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    // Coluna: nome (VARCHAR(100) NOT NULL)
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    // Coluna: email (VARCHAR(100) NOT NULL UNIQUE)
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    // Coluna: senha_hash (VARCHAR(255) NOT NULL)
    senha_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // Coluna: tipo_usuario (VARCHAR(10) NOT NULL DEFAULT 'Padrão')
    tipo_usuario: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'Padrão'
    },
    // Coluna: data_cadastro (DATETIME NOT NULL)
    data_cadastro: {
        type: DataTypes.DATE,
        allowNull: false
    },
    // Coluna: ultimo_login (DATETIME)
    ultimo_login: {
        type: DataTypes.DATE,
        allowNull: true // Permite valores nulos (DEFAULT)
    }
}, {
    // Opções do Modelo
    tableName: 'Usuarios', // Garante que o nome da tabela no DB seja 'Usuarios'
    timestamps: false // Desabilita os campos 'createdAt' e 'updatedAt' automáticos do Sequelize,
                      // pois você já definiu 'data_cadastro' e 'ultimo_login' manualmente.
});

module.exports = Usuario;