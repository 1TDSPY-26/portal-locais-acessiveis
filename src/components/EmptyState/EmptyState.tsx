type EmptyStateProps = {
  message?: string
}

export function EmptyState({
  message = 'Nenhum item encontrado.',
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="mt-6 rounded-md border border-gray-200 p-8 text-center"
    >
      <p className="text-base text-gray-700">{message}</p>
    </div>
  )
}
