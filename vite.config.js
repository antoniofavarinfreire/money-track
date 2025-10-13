import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";
import path from "path";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["tests/setup.js"],
      coverage: {
        reporter: ["text", "html"],
      },
      resolveSnapshotPath: (testPath, snapshotExtension) => {
        return testPath.replace(/\.test\.js$/, `.snap${snapshotExtension}`);
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: [".js", ".vue", ".json"],
    },
  })
);
