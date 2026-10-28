import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { lerCriterioOrdenacao, useOrdenacaoNaUrl } from './useOrdenacaoNaUrl'

function ComponenteDeTeste() {
    const { ordenacao, setOrdenacao } = useOrdenacaoNaUrl()
    const { search } = useLocation()

    return (
        <>
            <p>ordenacao={ordenacao}</p>
            <p>url={search}</p>
            <button onClick={() => setOrdenacao('nota-desc')}>maior nota</button>
            <button onClick={() => setOrdenacao('nome-asc')}>nome a-z</button>
        </>
    )
}

function abrirEm(url: string) {
    render(
        <MemoryRouter initialEntries={[url]}>
            <ComponenteDeTeste />
        </MemoryRouter>,
    )
}

describe('lerCriterioOrdenacao', () => {
    it('aceita um critério conhecido', () => {
        expect(lerCriterioOrdenacao('recursos-desc')).toBe('recursos-desc')
    })

    it('usa Nome (A–Z) quando o parâmetro não existe', () => {
        expect(lerCriterioOrdenacao(null)).toBe('nome-asc')
    })

    it('usa Nome (A–Z) quando o valor é desconhecido', () => {
        expect(lerCriterioOrdenacao('xyz')).toBe('nome-asc')
    })
})

describe('useOrdenacaoNaUrl', () => {
    it('lê a ordenação da URL', () => {
        abrirEm('/locais?ordem=nota-desc')

        expect(screen.getByText('ordenacao=nota-desc')).toBeInTheDocument()
    })

    it('usa Nome (A–Z) quando a URL não tem ordem', () => {
        abrirEm('/locais')

        expect(screen.getByText('ordenacao=nome-asc')).toBeInTheDocument()
    })

    it('escreve na URL sem apagar a busca e os filtros', async () => {
        abrirEm('/locais?busca=bib&recurso=Rampa')

        await userEvent.click(screen.getByText('maior nota'))

        expect(screen.getByText('url=?busca=bib&recurso=Rampa&ordem=nota-desc')).toBeInTheDocument()
        expect(screen.getByText('ordenacao=nota-desc')).toBeInTheDocument()
    })

    it('remove o parâmetro quando volta para Nome (A–Z)', async () => {
        abrirEm('/locais?categoria=Cultura&ordem=nota-desc')

        await userEvent.click(screen.getByText('nome a-z'))

        expect(screen.getByText('url=?categoria=Cultura')).toBeInTheDocument()
        expect(screen.getByText('ordenacao=nome-asc')).toBeInTheDocument()
    })

    it('usa Nome (A–Z) quando a URL tem um valor de ordem desconhecido', () => {
        abrirEm('/locais?ordem=xyz')

        expect(screen.getByText('ordenacao=nome-asc')).toBeInTheDocument()
    })
})