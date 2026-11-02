
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Local } from '../../types/Local'
import { useLocais } from '../../hooks/useLocais'
import { useFiltrosNaUrl } from '../../hooks/useFiltrosNaUrl'
import Locais from './Locais'
import { AVISO_DADOS_RESERVA } from '../../components/AvisoDadosReserva/AvisoDadosReserva'

vi.mock('../../hooks/useLocais', () => ({
    useLocais: vi.fn(),
}))

vi.mock('../../hooks/useFiltrosNaUrl', () => ({
    useFiltrosNaUrl: vi.fn(),
}))

vi.mock('../../components/LocalCard/LocalCard', () => ({
    default: ({ local }: { local: Local }) => (
        <div>{local.nome}</div>
    ),
}))

const localExemplo = {
    id: 1,
    nome: 'Biblioteca Central',
    categoria: 'Cultura',
    tiposAcessibilidade: ['Rampa'],
} as Local

function prepararPagina({
    locais = [localExemplo],
    isLoading = false,
    errorMessage = '',
}: {
    locais?: Local[]
    isLoading?: boolean
    errorMessage?: string
} = {}) {
    vi.mocked(useLocais).mockReturnValue({
        locais,
        isLoading,
        revalidando: false,
        errorMessage,
        atualizadoEm: null,
        recarregar: vi.fn(),
    } as unknown as ReturnType<typeof useLocais>)

    vi.mocked(useFiltrosNaUrl).mockReturnValue({
        busca: '',
        categoria: '',
        recursos: [],
        setBusca: vi.fn(),
        setCategoria: vi.fn(),
        setRecursos: vi.fn(),
        limpar: vi.fn(),
    } as ReturnType<typeof useFiltrosNaUrl>)

    return render(
        <MemoryRouter>
            <Locais />
        </MemoryRouter>
    )
}

beforeEach(() => {
    vi.stubEnv('VITE_API_URL', '')
})

afterEach(() => {
    cleanup()
    vi.unstubAllEnvs()
    vi.clearAllMocks()
})

describe('Aviso de dados do servidor de reserva', () => {
    it('mostra aviso com URL vazia e locais carregados', () => {
        prepararPagina()

        const aviso = screen.getByRole('note')

        expect(aviso).toHaveTextContent(AVISO_DADOS_RESERVA)
        expect(aviso.id).toBe('aviso-dados-reserva')
    })

    it('mostra o aviso logo depois do título', () => {
        prepararPagina()

        const titulo = screen.getByRole('heading', {
            name: 'Locais acessíveis',
        })

        expect(titulo.nextElementSibling).toBe(
            screen.getByRole('note')
        )
    })

    it('não mostra aviso com URL configurada', () => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:3000')

        prepararPagina()

        expect(screen.queryByRole('note')).not.toBeInTheDocument()
    })

    it('não mostra aviso com lista vazia', () => {
        prepararPagina({ locais: [] })

        expect(screen.queryByRole('note')).not.toBeInTheDocument()
    })

    it('considera URL com espaços como vazia', () => {
        vi.stubEnv('VITE_API_URL', '   ')

        prepararPagina()

        expect(screen.getByRole('note')).toBeInTheDocument()
    })

    it('não mostra aviso durante carregamento sem locais', () => {
        prepararPagina({
            locais: [],
            isLoading: true,
        })

        expect(screen.queryByRole('note')).not.toBeInTheDocument()
    })

    it('não mostra aviso em caso de erro sem locais', () => {
        prepararPagina({
            locais: [],
            errorMessage: 'Erro de conexão',
        })

        expect(screen.queryByRole('note')).not.toBeInTheDocument()
    })

    it('não exibe endereço de servidor no aviso', () => {
        prepararPagina()

        const aviso = screen.getByRole('note')

        expect(aviso).not.toHaveTextContent('localhost')
        expect(aviso).not.toHaveTextContent('http://')
    })
})
