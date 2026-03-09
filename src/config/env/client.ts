import { createEnv } from "@t3-oss/env-core"
import z from "zod"

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_BASE_URL: z.url(),
  },
  runtimeEnv: import.meta.env,
})
