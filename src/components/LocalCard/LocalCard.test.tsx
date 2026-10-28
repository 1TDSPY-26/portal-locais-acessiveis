import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import LocalCard from './LocalCard'
import type { Local } from '../../types/Local'

const localTeste = {
  id: 1,
  nome: 'Biblioteca Central',
  categoria: 'Biblioteca',
  endereco: 'Avenida Paulista, 1000',
  tiposAcessibilidade: ['Rampa de acesso', 'Elevador'],
} as Local

describe('LocalCard', () => {
  it('exibe as informações do local', () => {
    render(
      <MemoryRouter>
        <LocalCard local={localTeste} onExcluir={() => {}} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        name: 'Biblioteca Central',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
    expect(screen.getByText('Avenida Paulista, 1000')).toBeInTheDocument()
    expect(screen.getByText('Rampa de acesso')).toBeInTheDocument()
    expect(screen.getByText('Elevador')).toBeInTheDocument()
  })

  it('chama onExcluir ao clicar no botão Excluir', async () => {
    const user = userEvent.setup()
    const onExcluir = vi.fn()

    render(
      <MemoryRouter>
        <LocalCard local={localTeste} onExcluir={onExcluir} />
      </MemoryRouter>,
    )

    const botaoExcluir = screen.getByRole('button', {
      name: /excluir.*biblioteca central/i,
    })

    await user.click(botaoExcluir)

    expect(onExcluir).toHaveBeenCalledTimes(1)
    expect(onExcluir).toHaveBeenCalledWith(localTeste)
  })
})