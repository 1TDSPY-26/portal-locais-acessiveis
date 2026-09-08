export const ACCESSIBILITY_TYPES = {
  cadeirante: 'Cadeirante',
  visual: 'Visual',
  auditiva: 'Auditiva',
  intelectual: 'Intelectual',
} as const

export type AccessibilityType = keyof typeof ACCESSIBILITY_TYPES