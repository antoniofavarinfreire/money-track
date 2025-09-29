// vitest.config.js
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".vue", ".json"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
    },
    setupFiles: ["./vitest.setup.js"],
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
});
