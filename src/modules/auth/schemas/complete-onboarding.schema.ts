import { z } from 'zod'

export const completeOnboardingBodySchema = z.object({
  name: z.string().min(3),
  cpf: z.string().length(11),
})

export type CompleteOnboardingBodySchema = z.infer<
  typeof completeOnboardingBodySchema
>
