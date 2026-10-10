import { OPCOES_ORDENACAO, type CriterioOrdenacao } from '../../utils/ordenarLocais'

type SeletorOrdenacaoProps = {
    valor: CriterioOrdenacao
    onChange: (valor: CriterioOrdenacao) => void
}

export default function SeletorOrdenacao({ valor, onChange }: SeletorOrdenacaoProps) {
    return (
        <div className="flex w-full flex-col gap-1 sm:w-auto">
            <label htmlFor="ordenacao" className="font-medium">
                Ordenar por
            </label>
            <select
                id="ordenacao"
                value={valor}
                onChange={(e) => onChange(e.target.value as CriterioOrdenacao)}
                className="w-full rounded-md border border-gray-400 bg-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:w-auto"
            >
                {OPCOES_ORDENACAO.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                        {opcao.rotulo}
                    </option>
                ))}
            </select>
        </div>
    )
}