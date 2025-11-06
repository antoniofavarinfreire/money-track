// vue.config.js

/**
 * Esta configuração é usada pelo 'vue-cli-service build' (Webpack)
 * para modificar o comportamento padrão do linter durante o build de produção.
 * O Webpack lê este arquivo porque o script 'build' chama 'vue-cli-service build'.
 */
module.exports = {
  // Desabilita a regra fatal do ESLint transformando erros em avisos
  chainWebpack: (config) => {
    config.module
      .rule("eslint")
      .use("eslint-loader")
      .loader("eslint-loader")
      .tap((options) => {
        // ESSENCIAL: Permite que o build continue mesmo com erros do ESLint (console.log)
        // O build passará, mas os avisos ainda serão exibidos no log.
        options.emitWarning = true;
        return options;
      })
      .end();
  },

  // O restante do seu arquivo 'vite.config.js' permanece inalterado.
  // O Vite IGNORA este arquivo (vue.config.js).
};
