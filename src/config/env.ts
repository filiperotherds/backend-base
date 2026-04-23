import 'dotenv/config'
import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  RESEND_API_KEY: z.string(),
  STORAGE_ENDPOINT: z.string().url(),
  STORAGE_KEY: z.string(),
  STORAGE_SECRET: z.string(),
  STORAGE_BUCKET: z.string(),
  REGION: z.string().default('us-east-1'),
  PORT: z.coerce.number().default(3333),
  APP_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid enviroment variables.', _env.error.format())

  throw new Error('Invalid enviroment variables.')
}

export const env = _env.data