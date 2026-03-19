import { z } from "zod"

export const passwordField = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(50)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, & 1 number",
  })

export const confirmPasswordField = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(50)
