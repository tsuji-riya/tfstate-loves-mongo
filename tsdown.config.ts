import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/entry/cli.ts", "./src/entry/actions/main.ts", "./src/entry/actions/post.ts"],
  outDir: "./dist",
  minify: true,
  format: "esm",
  platform: "node",
  fixedExtension: false,
  clean: true,
  deps: {
    alwaysBundle: ["*", "*/**"],
  },
  banner: {
    js: "#!/usr/bin/env node",
  },
});
