import { z } from "zod"

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password is required." }),
})

type SignIn = z.infer<typeof signInSchema>

export { signInSchema, type SignIn }
