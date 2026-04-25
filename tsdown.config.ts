import {defineConfig} from "tsdown";

export default defineConfig({
  entry: ["./src/main.ts", "./src/post.ts"],
  outDir: "./dist",
  minify: true,
  format: "esm",
  platform: "node",
  fixedExtension: false,
  clean: true,
  deps: {
    alwaysBundle: ["*", "*/**"]
  },
})