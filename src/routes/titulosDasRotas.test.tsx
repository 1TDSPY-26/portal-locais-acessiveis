
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppRoutes from './AppRoutes'
import { NOME_DO_SITE } from '../hooks/useTituloDocumento'
import ErrorBoundary, {
    TITULO_ERRO_INESPERADO,
} from '../components/Error/ErrorBoundary'

vi.mock('../services/locais', () => {
    const localDeExemplo = {
        id: 1,
        nome: 'Biblioteca Central',
        endereco: 'Rua A, 10',
        categoria: 'Cultura',
        tiposAcessibilidade: ['Rampa'],
        descricao: 'Espaço de leitura',
        notaAcessibilidade: 4,
    }

    return {
        listarLocais: vi.fn().mockResolvedValue({
            data: [localDeExemplo],
        }),
        obterLocalPorId: vi.fn().mockResolvedValue({
            data: localDeExemplo,
        }),
        criarLocal: vi.fn().mockResolvedValue({
            data: localDeExemplo,
        }),
        atualizarLocal: vi.fn().mockResolvedValue({
            data: localDeExemplo,
        }),
    }
})

const TITULOS_POR_ROTA = [
    ['/', 'Início'],
    ['/locais', 'Locais acessíveis'],
    ['/locais/editar/1', 'Editar local'],
    ['/cadastro', 'Cadastrar local'],
    ['/cadastrar', 'Cadastrar local'],
    ['/sobre', 'Sobre o projeto'],
    ['/acessibilidade', 'Acessibilidade'],
    ['/rota-que-nao-existe', 'Página não encontrada'],
] as const

describe('Títulos de documento', () => {
    it.each(TITULOS_POR_ROTA)(
        'a rota %s mostra "%s | Portal Acessível" na aba',
        async (rota, titulo) => {
            render(
                <MemoryRouter initialEntries={[rota]}>
                    <AppRoutes />
                </MemoryRouter>
            )

            await waitFor(() => {
                expect(document.title).toBe(
                    `${titulo} | ${NOME_DO_SITE}`
                )
            })
        }
    )

    it('o título acompanha a navegação pelo menu principal', async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(document.title).toBe(
                `Início | ${NOME_DO_SITE}`
            )
        })

        const navegacao = screen.getByRole('navigation', {
            name: 'Navegação principal',
        })

        const linkSobre = within(navegacao).getByRole('link', {
            name: 'Sobre',
        })

        await user.click(linkSobre)

        await waitFor(() => {
            expect(document.title).toBe(
                `Sobre o projeto | ${NOME_DO_SITE}`
            )
        })
    })

    it(
        'o aviso de erro inesperado mostra "Erro inesperado | Portal Acessível"',
        async () => {
            const consoleSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => { })

            function ComponenteComErro(): never {
                throw new Error('Erro simulado para teste')
            }

            try {
                render(
                    <ErrorBoundary>
                        <ComponenteComErro />
                    </ErrorBoundary>
                )

                await waitFor(() => {
                    expect(document.title).toBe(
                        `${TITULO_ERRO_INESPERADO} | ${NOME_DO_SITE}`
                    )
                })

                expect(
                    screen.getByText(
                        'Ocorreu um erro inesperado ao carregar a página.'
                    )
                ).toBeInTheDocument()
            } finally {
                consoleSpy.mockRestore()
            }
        }
    )
})
