import glob from "tiny-glob";
import { defineConfig } from "tsup";

export default defineConfig(async () => {
  return [
    {
      entry: ["src/main.ts"],
      dts: true,
      sourcemap: true,
      clean: true,
      minify: true,
    },
  ];
});
