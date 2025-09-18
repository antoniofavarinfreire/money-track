FROM node:18-bullseye

# Instala dependências básicas e ferramentas de desenvolvimento
RUN apt-get update && apt-get install -y \
    git \
    curl \
    vim \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /workspaces

# Instala ferramentas globais do Node.js (opcional)
RUN npm install -g nodemon

# Mantém o container rodando
CMD ["sleep", "infinity"]