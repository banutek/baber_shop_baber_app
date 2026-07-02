import { z } from 'zod'

// ─── Messages d'erreur en français ───────────────────────────────────────────
const MSG = {
  required: 'Ce champ est requis',
  email: 'Email invalide',
  minChars: (n: number) => `Minimum ${n} caractères`,
  maxChars: (n: number) => `Maximum ${n} caractères`,
  phone: 'Numéro de téléphone invalide',
  passwordMatch: 'Les mots de passe ne correspondent pas',
  terms: 'Vous devez accepter les conditions',
  timeFormat: 'Format attendu : HH:MM',
} as const

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: MSG.required })
    .check(z.email({ message: MSG.email })),
  password: z.string().min(1, { message: MSG.required }),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: MSG.required })
      .max(50, { message: MSG.maxChars(50) }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: MSG.required })
      .max(50, { message: MSG.maxChars(50) }),
    email: z
      .string()
      .trim()
      .min(1, { message: MSG.required })
      .check(z.email({ message: MSG.email })),
    phone: z
      .string()
      .trim()
      .min(1, { message: MSG.required })
      .regex(/^\+?\d[\d\s]{7,18}$/, { message: MSG.phone }),
    address: z
      .string()
      .trim()
      .min(1, { message: MSG.required })
      .max(200, { message: MSG.maxChars(200) }),
    password: z
      .string()
      .min(6, { message: MSG.minChars(6) })
      .max(100, { message: MSG.maxChars(100) }),
    confirmPassword: z.string().min(1, { message: MSG.required }),
    agreeTerms: z.boolean().refine((v) => v === true, { message: MSG.terms }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MSG.passwordMatch,
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

// ─── Create Shop ──────────────────────────────────────────────────────────────
export const createShopSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: MSG.required })
    .max(100, { message: MSG.maxChars(100) }),
  address: z
    .string()
    .trim()
    .min(1, { message: MSG.required })
    .max(200, { message: MSG.maxChars(200) }),
  phone: z
    .string()
    .trim()
    .min(1, { message: MSG.required })
    .regex(/^\+?\d[\d\s]{7,18}$/, { message: MSG.phone }),
  email: z
    .string()
    .trim()
    .check(z.email({ message: MSG.email }))
    .optional()
    .or(z.literal('')),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, { message: MSG.timeFormat }),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, { message: MSG.timeFormat }),
})

export type CreateShopFormData = z.infer<typeof createShopSchema>

// ─── Helper ───────────────────────────────────────────────────────────────────
/** Retourne un Record champ → message d'erreur (vide si valide) */
export function getFieldErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Partial<Record<keyof T, string>> {
  const result = schema.safeParse(data)
  if (result.success) return {} as Partial<Record<keyof T, string>>

  const fieldErrors: Partial<Record<string, string>> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    // Ne pas écraser une erreur déjà présente (priorité à la première)
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message
    }
  }
  return fieldErrors as Partial<Record<keyof T, string>>
}

/** Retourne le premier message d'erreur global (hors champ) ou null */
export function getFirstGlobalError(schema: z.ZodSchema<unknown>, data: unknown): string | null {
  const result = schema.safeParse(data)
  if (result.success) return null
  // Cherche une issue sans path (erreur globale comme .refine)
  const globalIssue = result.error.issues.find((i) => i.path.length === 0)
  return globalIssue?.message ?? null
}
