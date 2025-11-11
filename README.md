# 🪙 MoneyTrack

## Sobre o Projeto

O **MoneyTrack** é uma plataforma para controle e organização de finanças pessoais, permitindo aos usuários registrar despesas, categorizá-las e visualizar sua saúde financeira através de dashboards intuitivos.

## Funcionalidades Principais

- Gerenciamento de despesas (comuns, cartão de crédito e recorrentes)
- Dashboards e relatórios financeiros
- Filtragem e categorização de gastos

## Stack Tecnológica

### Frontend

- Vue.js + Javascript

### Backend

- Node.js
- JWT para autenticação

### Banco de Dados

- MySQL

### Arquitetura

- Padrão MVC (Model-View-Controller)
- Microserviços

## Objetivo

Proporcionar aos usuários uma ferramenta eficaz para monitorar e planejar suas despesas, facilitando o controle financeiro pessoal através de uma interface intuitiva e relatórios detalhados.

## Documentação do Sistema

### Tela de Login

Ações:
1. Campos para adicionar seu e-mail e sua senha cadastrada.
2. Botão para realizar o login.
3. Link para a pagina de cadastro de usuário.

<img width="1917" height="897" alt="image" src="https://github.com/user-attachments/assets/d93d7356-1823-497f-9f67-4a7f785ada49" />

### Tela de Registro

Ações:
1. Campos para adicionar seu nome de usuário, e-mail, sua senha e verificar sua senha.
2. Botão para realizar o cadastro.
3. Link para a pagina de Login.

<img width="1916" height="892" alt="image" src="https://github.com/user-attachments/assets/a34c338f-aa83-4f16-8fca-d3396968160e" />

### Tela de Dashboard

Ações:
1. Menu com as demais telas do sistema e botão de logout.
2. Dashboard com os dados de cartões de crédito, débitos, gastos dos ultimos 30 dias e também dos próximos 30 dias. Além de exibir os ultimos gastos cadastrados e um feed com as ultimas atualizações das regras fiscais no sistema.

<img width="1915" height="895" alt="image" src="https://github.com/user-attachments/assets/d21d79aa-8ba1-4f22-a36b-db7cf6282ec2" />

### Tela de Lista de Gastos

Ações:
1. Tela com uma tabela exibindo os gastos que o usuario logado possui cadastrado em seu perfil.
2. Cada gasto possui uma coluna de ações que no momento apenas possui uma lata de lixo para a exclusão do gasto.
3. Seleção no topo da tabela para quantidade de registros exibidos em tela.
4. Barra de pesquisa para pesquisar algum dado na tabela.
5. Filtro em cada coluna para ordenação dos dados.
6. Botão inferior para abrir o modal de cadastro de despesas.

<img width="1910" height="895" alt="image" src="https://github.com/user-attachments/assets/e3dce306-db7c-480c-962c-944d790213d6" />

### Tela do Modal de Cadastro de Despesas

Ações:
1. Modal com os campos para o cadastro de uma despesa.
2. Campos personalizados com mascara e etc, seletor de data, valores monetários e seletores de dados pré-cadastrados no banco.
3. Botão de cancelar e salvar a despesa.

<img width="531" height="656" alt="image" src="https://github.com/user-attachments/assets/472592cb-8069-44dc-b202-b7211406341d" />
<img width="527" height="648" alt="image" src="https://github.com/user-attachments/assets/8a1b1b9e-a6d3-4272-9a8a-5fbd7ff12d4e" />
<img width="524" height="646" alt="image" src="https://github.com/user-attachments/assets/688ea1fc-9eaa-4857-9d78-9cf420b10bb0" />
<img width="514" height="648" alt="image" src="https://github.com/user-attachments/assets/739a6642-5a19-43ec-b972-099f5e3e3e66" />

### Tela de Lista de Dedutiveis

Ações:
1. Tela com uma tabela exibindo os gastos dedutiveis que o usuario logado possui cadastrado em seu perfil.
2. Seleção no topo da tabela para quantidade de registros exibidos em tela.
3. Barra de pesquisa para pesquisar algum dado na tabela.
4. Filtro em cada coluna para ordenação dos dados.

<img width="1899" height="873" alt="image" src="https://github.com/user-attachments/assets/e7008bbc-6831-445f-826f-c23e933e9119" />

### Tela de Regras Fiscais

Ações:
1. Tela com uma tabela exibindo as regras fiscais com a categoria, descrição, se é dedutivel ou não o cadastro, teto anual, total gasto pelo usuário logado e o restante do teto.
2. No canto inferior da tabela temos o Total de gastos não dedutiveis, onde são somados os valores que não se enquadram como categorias dedutiveis do IR.
3. Seleção no topo da tabela para quantidade de registros exibidos em tela.
4. Barra de pesquisa para pesquisar algum dado na tabela.
5. Filtro em cada coluna para ordenação dos dados.

<img width="1890" height="885" alt="image" src="https://github.com/user-attachments/assets/631d1376-baff-4324-8bd7-c1a0d6f0f87c" />

### Menu de Sair

Ações:
1. Ao clicar no botão o usuario é redirecionado ao Login do sistema e seu token é apagado/invalidado para proteção JWT.

<img width="274" height="852" alt="image" src="https://github.com/user-attachments/assets/2f1a7636-5d2c-4d92-a296-ecddcba04033" />


