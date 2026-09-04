import { z } from 'zod'

// Schemas de validação
export const emailSchema = z.string().email('Email inválido')
export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter letra maiúscula')
  .regex(/[0-9]/, 'Senha deve conter número')
  .regex(/[!@#$%]/, 'Senha deve conter caractere especial (!@#$%)')

export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  userType: z.enum(['artist', 'producer', 'company', 'influencer', 'band', 'tv_radio']),
})

export const talentSchema = z.object({
  specialty: z.enum(['singing', 'acting', 'dancing', 'presenting', 'voice']),
  bio: z.string().max(1000),
  city: z.string().max(100),
  rating: z.number().min(0).max(10).optional(),
})

export const campaignSchema = z.object({
  title: z.string().min(5).max(200),
  brief: z.string().min(10).max(2000),
  budget: z.number().min(100).max(1000000),
  target_region: z.string().max(100),
  city: z.string().max(100),
  deadline: z.string().datetime(),
})

export const videoSubmissionSchema = z.object({
  campaign_id: z.string().uuid(),
  video_url: z.string().url(),
})

// Validação genérica
export function validate<T>(schema: z.ZodSchema, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated as T }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Validação falhou' }
  }
}

// Sanitização de input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .substring(0, 1000)
}

// Validação de URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
