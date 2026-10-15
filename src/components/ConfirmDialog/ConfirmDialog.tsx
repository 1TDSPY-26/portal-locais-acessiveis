
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type SyntheticEvent,
} from 'react'

type ConfirmDialogProps = {
  aberto: boolean
  titulo: string
  mensagem: ReactNode
  textoConfirmar: string
  carregando?: boolean
  erro?: string
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  textoConfirmar,
  carregando = false,
  erro,
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const tituloId = useId()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (aberto && !dialog.open) {
      dialog.showModal()
    } else if (!aberto && dialog.open) {
      dialog.close()
    }
  }, [aberto])

  function cancelarComEsc(
    evento: SyntheticEvent<HTMLDialogElement>,
  ) {
    evento.preventDefault()

    if (!carregando) {
      onCancelar()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={tituloId}
      onCancel={cancelarComEsc}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl p-0 text-gray-900 shadow-xl backdrop:bg-black/50 open:animate-none"
    >
      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <h2
            id={tituloId}
            className="text-xl font-bold"
          >
            {titulo}
          </h2>

          <div className="text-sm leading-6 text-gray-700">
            {mensagem}
          </div>

          {erro && (
            <p
              role="alert"
              className="rounded-md bg-red-50 p-3 text-sm text-red-800"
            >
              <strong>Erro:</strong> {erro}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            onClick={onCancelar}
            disabled={carregando}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={carregando}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando
              ? 'Excluindo...'
              : textoConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  )
}
