import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { InitialEntry } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LocalCard from '../../components/LocalCard/LocalCard'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'
import DetalheLocal from './DetalheLocal'

vi.mock('../../services/locais')

const localDeTeste: Local = {
    id: 1,
    nome: 'Biblioteca Central',
    endereco: 'Rua A, 10',
    categoria: 'Cultura',
    tiposAcessibilidade: ['Rampa', 'Elevador'],
    descricao: 'Espaço de leitura',
    notaAcessibilidade: 4,
}

function abrirEm(endereco: InitialEntry) {
    render(
        <MemoryRouter initialEntries={[endereco]}>
            <Routes>
                <Route path="/locais" element={<LocalCard local={localDeTeste} />} />
                <Route path="/locais/:id" element={<DetalheLocal />} />
            </Routes>
        </MemoryRouter>,
    )
}

async function irDaListaParaODetalhe(enderecoDaLista: string) {
    const usuario = userEvent.setup()
    abrirEm(enderecoDaLista)

    await usuario.click(screen.getByRole('link', { name: /Ver detalhes/ }))
}

function linkVoltar() {
    return screen.findByRole('link', { name: 'Voltar para a lista de locais' })
}

describe('Voltar do detalhe para a lista', () => {
    beforeEach(() => {
        vi.mocked(obterLocalPorId).mockResolvedValue({ data: localDeTeste })
    })

    it('volta para a lista com busca e filtros', async () => {
        await irDaListaParaODetalhe('/locais?busca=bib&categoria=Cultura')

        expect(await linkVoltar()).toHaveAttribute('href', '/locais?busca=bib&categoria=Cultura')
    })

    it('mantém recursos repetidos e a ordem', async () => {
        const endereco = '/locais?recurso=Rampa&recurso=Elevador&ordem=nota-desc'
        await irDaListaParaODetalhe(endereco)

        expect(await linkVoltar()).toHaveAttribute('href', endereco)
    })

    it('vai para a lista sem filtros quando o detalhe é aberto direto', async () => {
        abrirEm('/locais/1')

        expect(await linkVoltar()).toHaveAttribute('href', '/locais')
    })

    it('ignora origem que não é a listagem', async () => {
        abrirEm({ pathname: '/locais/1', state: { origem: '/sobre' } })

        expect(await linkVoltar()).toHaveAttribute('href', '/locais')
    })

    it('mantém a origem quando o local não é encontrado', async () => {
        vi.mocked(obterLocalPorId).mockResolvedValue({ error: { message: 'x', status: 404 } })
        abrirEm({ pathname: '/locais/1', state: { origem: '/locais?busca=bib' } })

        expect(await screen.findByText('Local não encontrado.')).toBeInTheDocument()
        expect(await linkVoltar()).toHaveAttribute('href', '/locais?busca=bib')
    })
})