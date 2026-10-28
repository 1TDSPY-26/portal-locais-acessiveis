import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LocalCard from './LocalCard'
import type { Local } from '../../types/Local'

const localTeste = {
    id: 1,
    nome: 'Biblioteca Central',
    categoria: 'Biblioteca',
    endereco: 'Avenida Paulista, 1000',
    tiposAcessibilidade: ['Rampa de acesso', 'Elevador'],
} as Local

function renderizar(distanciaKm?: number | null, onExcluir?: (local: Local) => void) {
    return render(
        <MemoryRouter>
            <LocalCard local={localTeste} distanciaKm={distanciaKm} onExcluir={onExcluir} />
        </MemoryRouter>,
    )
}

describe('LocalCard com distância', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('mostra a distância em metros quando há medida válida', () => {
        renderizar(0.5)

        expect(screen.getByText('Distância aproximada: 500 m')).toBeInTheDocument()
    })

    it('mostra a distância em quilômetros', () => {
        renderizar(1)

        expect(screen.getByText('Distância aproximada: 1,0 km')).toBeInTheDocument()
    })

    it('mostra 0 m quando a distância é zero', () => {
        renderizar(0)

        expect(screen.getByText('Distância aproximada: 0 m')).toBeInTheDocument()
    })

    it('não mostra texto de distância sem a prop (usos atuais continuam iguais)', () => {
        renderizar()

        expect(screen.queryByText(/distância aproximada/i)).not.toBeInTheDocument()
        expect(screen.getByText('Avenida Paulista, 1000')).toBeInTheDocument()
    })

    it.each([
        ['null', null],
        ['negativo', -1],
        ['NaN', Number.NaN],
        ['infinito', Number.POSITIVE_INFINITY],
    ])('não mostra texto de distância para %s', (_nome, valor) => {
        renderizar(valor)

        expect(screen.queryByText(/distância aproximada/i)).not.toBeInTheDocument()
    })

    it('mantém o link de detalhes e o botão de excluir funcionando com distância', async () => {
        const user = userEvent.setup()
        const onExcluir = vi.fn()
        renderizar(2.5, onExcluir)

        expect(screen.getByRole('link', { name: /ver detalhes.*biblioteca central/i })).toHaveAttribute(
            'href',
            '/locais/1',
        )

        await user.click(screen.getByRole('button', { name: /excluir.*biblioteca central/i }))

        expect(onExcluir).toHaveBeenCalledTimes(1)
        expect(onExcluir).toHaveBeenCalledWith(localTeste)
    })

    it('mostra a distância em um parágrafo comum, sem região ao vivo', () => {
        renderizar(0.5)

        const paragrafo = screen.getByText('Distância aproximada: 500 m')
        expect(paragrafo.tagName).toBe('P')
        expect(paragrafo).not.toHaveAttribute('aria-live')
        expect(paragrafo).not.toHaveAttribute('role')
    })

    it('nunca pede a localização do usuário', () => {
        const getCurrentPosition = vi.fn()
        const watchPosition = vi.fn()
        Object.defineProperty(navigator, 'geolocation', {
            configurable: true,
            value: { getCurrentPosition, watchPosition },
        })

        renderizar(0.5)

        expect(getCurrentPosition).not.toHaveBeenCalled()
        expect(watchPosition).not.toHaveBeenCalled()
    })
})
