import colorLog from "../log";
import { PluginOption, build } from "vite";
import { fileURLToPath } from "url";

const packages = [
  {
    content: fileURLToPath(
      new URL("../../src/pages/content/index.ts", import.meta.url)
    ),
  },
];

export default function buildContent(): PluginOption {
  return {
    name: "build-content",
    async buildEnd() {
      for (const _package of packages) {
        await build({
          publicDir: false,
          build: {
            outDir: "build",
            sourcemap: true,
            emptyOutDir: false,
            rollupOptions: {
              input: _package,
              output: {
                entryFileNames: (chunk) => {
                  return `src/pages/${chunk.name}/index.js`;
                },
              },
            },
          },
          configFile: false,
        });
      }
      colorLog("content file build", "success");
    },
  };
}
