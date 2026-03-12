import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"

const config = defineConfig({
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
