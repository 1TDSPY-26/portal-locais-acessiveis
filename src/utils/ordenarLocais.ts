import type { Local } from '../types/Local'

export type CriterioOrdenacao = 'nome-asc' | 'nome-desc' | 'nota-desc' | 'recursos-desc'

export const OPCOES_ORDENACAO = [
    { valor: 'nome-asc', rotulo: 'Nome (A–Z)' },
    { valor: 'nome-desc', rotulo: 'Nome (Z–A)' },
    { valor: 'nota-desc', rotulo: 'Maior nota de acessibilidade' },
    { valor: 'recursos-desc', rotulo: 'Mais recursos de acessibilidade' },
]

function compararPorNome(a: Local, b: Local) {
    return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
}

function compararPorNota(a: Local, b: Local) {
    return b.notaAcessibilidade - a.notaAcessibilidade || compararPorNome(a, b)
}

function compararPorRecursos(a: Local, b: Local) {
    return (
        b.tiposAcessibilidade.length - a.tiposAcessibilidade.length ||
        compararPorNome(a, b)
    )
}

export function ordenarLocais(locais: Local[], criterio: CriterioOrdenacao): Local[] {
    const copia = [...locais]

    switch (criterio) {
        case 'nome-desc':
            return copia.sort((a, b) => compararPorNome(b, a))
        case 'nota-desc':
            return copia.sort(compararPorNota)
        case 'recursos-desc':
            return copia.sort(compararPorRecursos)
        case 'nome-asc':
        default:
            return copia.sort(compararPorNome)
    }
}