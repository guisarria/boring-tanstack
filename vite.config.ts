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
    sortImports: {},
    sortTailwindcss: {
      attributes: ["class", "className"],
      functions: ["clsx", "cn", "cva", "tw"],
    },
    sortPackageJson: true,
    ignorePatterns: [
      "pnpm-lock.yaml",
      "package-lock.json",
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
      "dist",
    ],
  },
  lint: {
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
