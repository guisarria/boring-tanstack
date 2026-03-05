import { z } from "zod"

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password should have at least 8 characters")
      .max(100),
    confirmPassword: z.string().min(8).max(100),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

export { changePasswordSchema, type ChangePasswordSchema }
