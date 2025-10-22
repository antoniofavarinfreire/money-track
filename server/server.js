const express = require('express');
const sequelize = require('./database/db.js'); // Testa a conexão e importa a instância
const Usuario = require('./models/Users.js'); // Importa o modelo

const app = express();
app.use(express.json()); // Habilita o uso de JSON no corpo das requisições

// Sincronizar os modelos com o banco de dados
// O 'force: true' apaga e recria as tabelas (use com cautela em produção!)
// Para desenvolvimento, use `alter: true` ou simplesmente `sequelize.sync()`
sequelize.sync({ force: true }) 
    .then(() => {
        console.log('Tabelas sincronizadas!');

        // ----------------------------------------------------
        // EXECUTANDO UMA OPERAÇÃO CRUD (CREATE)
        // ----------------------------------------------------
        app.post('/usuarios', async (req, res) => {
            try {
                // Cria um novo usuário usando o método do Sequelize
                const novoUsuario = await Usuario.create(req.body);
                return res.status(201).json(novoUsuario);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ erro: 'Erro ao criar usuário.' });
            }
        });

        // ----------------------------------------------------
        // EXECUTANDO UMA OPERAÇÃO CRUD (READ)
        // ----------------------------------------------------
        app.get('/usuarios', async (req, res) => {
            try {
                // Busca todos os usuários
                const usuarios = await Usuario.findAll();
                return res.json(usuarios);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
            }
        });

        // Inicia o servidor
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => console.error('Falha na sincronização do banco:', err));