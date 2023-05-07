import { defineConfig } from "vite";
import path, { resolve } from "path";
import react from "@vitejs/plugin-react";

import manifest from "./manifest";
import addHmr from "./utils/plugins/add-hmr";
import makeManifest from "./utils/plugins/make-manifest";
import customDynamicImport from "./utils/plugins/custom-dynamic-import";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

// ENABLE HMR IN BACKGROUND SCRIPT
const enableHmrInBackgroundScript = true;

export default defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@pages": pagesDir,
      "@assets": assetsDir,
    },
  },
  plugins: [
    react(),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
    makeManifest(manifest, {
      isDev,
      contentScriptCssKey: regenerateCacheInvalidationKey(),
    }),
  ],
  publicDir,
  build: {
    outDir,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      input: {
        panel: resolve(pagesDir, "panel", "index.html"),
        popup: resolve(pagesDir, "popup", "index.html"),
        newtab: resolve(pagesDir, "newtab", "index.html"),
        content: resolve(pagesDir, "content", "index.ts"),
        options: resolve(pagesDir, "options", "index.html"),
        devtools: resolve(pagesDir, "devtools", "index.html"),
        background: resolve(pagesDir, "background", "index.ts"),
        contentStyle: resolve(pagesDir, "content", "style.scss"),
      },
      watch: {
        include: ["src/**", "vite.config.ts"],
        exclude: ["node_modules/**", "src/**/*.spec.ts"],
      },
      output: {
        entryFileNames: "src/pages/[name]/index.js",
        chunkFileNames: isDev
          ? "assets/js/[name].js"
          : "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = path.parse(assetInfo.name);
          const assetFolder = dir.split("/").at(-1);
          const name = assetFolder + firstUpperCase(_name);
          if (name === "contentStyle") {
            return `assets/css/contentStyle${cacheInvalidationKey}.chunk.css`;
          }
          return `assets/[ext]/${name}.chunk.[ext]`;
        },
      },
    },
  },
});

function firstUpperCase(str: string) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}

let cacheInvalidationKey: string = generateKey();
function regenerateCacheInvalidationKey() {
  cacheInvalidationKey = generateKey();
  return cacheInvalidationKey;
}

function generateKey(): string {
  return `${(Date.now() / 100).toFixed()}`;
}
