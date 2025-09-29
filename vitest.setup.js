// vitest.setup.js
import { vi } from "vitest";

// Intercepta todos os requires de imagens
global.require = new Proxy(global.require || (() => {}), {
  apply(target, thisArg, args) {
    const path = args[0];
    if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(path)) {
      return "mocked-image-path";
    }
    return Reflect.apply(target, thisArg, args);
  },
});
