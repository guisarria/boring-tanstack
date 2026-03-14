import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite-plus"

const config = defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    printWidth: 80,
    semi: false,
    useTabs: false,
    tabWidth: 2,
    tailwindcss: true,
    experimentalSortPackageJson: true,
    sortImports: {},
    sortTailwindcss: {},
  },
  oxc: {
    exclude: ["**/routeTree.gen.ts"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    nitro(),
    tailwindcss(),
    tanstackStart(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
      parserOpts: {
        plugins: ["jsx", "typescript"],
      },
    }),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: true,
      },
    },
  },
  optimizeDeps: { exclude: ["better-auth"] },
  resolve: {
    tsconfigPaths: true,
  },
})

export default config
