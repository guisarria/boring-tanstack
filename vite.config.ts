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
    trailingComma: "all",
    tabWidth: 2,
    sortImports: {},
    sortPackageJson: true,
    tailwindcss: true,
    sortTailwindcss: {
      stylesheet: "src/styles.css",
      attributes: ["class", "className"],
      functions: ["clsx", "cn", "cva", "tw"],
    },
    ignorePatterns: [
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "bun.lock",
      "routeTree.gen.ts",
      ".tanstack-start/",
      ".tanstack/",
      "drizzle/",
      "migrations/",
      ".drizzle/",
      ".cache",
      "worker-configuration.d.ts",
      ".vercel",
      ".output",
      ".wrangler",
      ".netlify",
      "dist",
    ],
  },
  lint: {
    plugins: ["react", "typescript", "unicorn", "react-perf"],
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: [
      "dist",
      ".wrangler",
      ".vercel",
      ".output",
      "build/",
      "scripts/",
    ],
  },
  plugins: [
    nitro(),
    tailwindcss(),
    tanstackStart(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
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
