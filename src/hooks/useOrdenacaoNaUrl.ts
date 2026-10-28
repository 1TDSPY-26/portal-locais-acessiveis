import { useSearchParams } from 'react-router-dom'
import { OPCOES_ORDENACAO, type CriterioOrdenacao } from '../utils/ordenarLocais'


export const PARAMETRO_ORDEM = 'ordem'

export const CRITERIO_PADRAO: CriterioOrdenacao = 'nome-asc'


export function lerCriterioOrdenacao(valor: string | null): CriterioOrdenacao {
    const opcao = OPCOES_ORDENACAO.find((item) => item.valor === valor)

    if (!opcao) {
        return CRITERIO_PADRAO
    }

    return opcao.valor as CriterioOrdenacao
}

export function useOrdenacaoNaUrl() {
    const [params, setParams] = useSearchParams()

    const ordenacao = lerCriterioOrdenacao(params.get(PARAMETRO_ORDEM))

    function setOrdenacao(criterio: CriterioOrdenacao) {
        const novosParams = new URLSearchParams(params)

        if (criterio === CRITERIO_PADRAO) {
            novosParams.delete(PARAMETRO_ORDEM)
            setParams(novosParams, { replace: true })
            return
        }

        novosParams.set(PARAMETRO_ORDEM, criterio)

    
        setParams(novosParams, { replace: true })
    }

    return { ordenacao, setOrdenacao }
}