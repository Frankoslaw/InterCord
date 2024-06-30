import glob from "tiny-glob";
import { defineConfig } from "tsup";

export default defineConfig(async () => {
  return [
    {
      entry: [
        ...(await glob("./src/commands/**/*.ts")),
        ...(await glob("./src/events/**/*.ts")),
        "src/main.ts",
      ],
      dts: true,
      sourcemap: true,
      clean: true,
      minify: true,
    },
  ];
});
