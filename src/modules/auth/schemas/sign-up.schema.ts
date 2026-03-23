import { z } from 'zod'

export const signUpBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

export type SignUpBodySchema = z.infer<typeof signUpBodySchema>
