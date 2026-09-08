import {
  ACCESSIBILITY_TYPES,
  type AccessibilityType,
} from '../../constants/accessibilityTypes'

type AccessibilityBadgeProps = {
  type: AccessibilityType
}

export default function AccessibilityBadge({
  type,
}: AccessibilityBadgeProps) {
  const label = ACCESSIBILITY_TYPES[type]

  return (
    <span
      className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800"
      aria-label={`Tipo de acessibilidade: ${label}`}
    >
      {label}
    </span>
  )
}