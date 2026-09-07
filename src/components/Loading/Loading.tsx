export function Loading() {
    return (
        <div
            className="flex flex-col items-center justify-center gap-2"
            role="status"
            aria-live="polite"
        >
            <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
                aria-hidden="true"
            />
            <span className="text-sm">Carregando...</span>
        </div>
    )
}