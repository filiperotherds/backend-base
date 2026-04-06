import { z } from 'zod'

export const resendVerificationBodySchema = z.object({
  email: z.string().email(),
})

export type ResendVerificationBodySchema = z.infer<
  typeof resendVerificationBodySchema
>
