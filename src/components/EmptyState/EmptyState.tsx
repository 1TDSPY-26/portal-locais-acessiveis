type EmptyStateProps = {
  message?: string
}

export function EmptyState({
  message = "Nenhum item encontrado.",
}: EmptyStateProps) {
  return (
    <div role="status" aria-live="polite">
      <p>{message}</p>
    </div>
  )
}