import { NOTA_MAXIMA, normalizarNota } from '../../utils/nota'

type NotaAcessibilidadeProps = {
  nota?: number | null
}

const formatadorNota = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

export default function NotaAcessibilidade({ nota }: NotaAcessibilidadeProps) {
  const notaValida = normalizarNota(nota)

  if (notaValida === null) {
    return (
      <p className="text-sm text-gray-700">
        Este local ainda não foi avaliado quanto à acessibilidade.
      </p>
    )
  }

  const preenchidas = Math.round(notaValida)
  const texto = `${formatadorNota.format(notaValida)} de ${NOTA_MAXIMA}`

  return (
    <p className="flex items-center gap-2 text-base text-gray-900">
      <span aria-hidden="true" className="text-lg tracking-wide text-amber-700">
        {'★'.repeat(preenchidas)}
        {'☆'.repeat(NOTA_MAXIMA - preenchidas)}
      </span>
      <span className="font-semibold">{texto}</span>
    </p>
  )
}