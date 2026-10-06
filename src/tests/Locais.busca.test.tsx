import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Locais from '../pages/Locais/Locais'
import { listarLocais } from '../services/locais'

vi.mock('../services/locais', () => ({
  listarLocais: vi.fn(),
}))

const locaisMock = [
  {
    id: 1,
    nome: 'Biblioteca Central',
    endereco: 'Rua das Flores, 100',
    categoria: 'Biblioteca',
    tiposAcessibilidade: ['Rampa', 'Elevador'],
    descricao: 'Biblioteca acessível',
    notaAcessibilidade: 5,
  },
  {
    id: 2,
    nome: 'Museu de Arte',
    endereco: 'Avenida Paulista, 1000',
    categoria: 'Museu',
    tiposAcessibilidade: ['Elevador'],
    descricao: 'Museu acessível',
    notaAcessibilidade: 4,
  },
]

function renderizarPagina() {
  return render(
    <MemoryRouter>
      <Locais />
    </MemoryRouter>,
  )
}

describe('Busca de locais', () => {
  beforeEach(() => {
   vi.mocked(listarLocais).mockResolvedValue({
  data: locaisMock,
})
  })

  it('filtra os locais pelo nome digitado na busca', async () => {
    const user = userEvent.setup()

    renderizarPagina()

    await waitFor(() => {
      expect(screen.getByText('Biblioteca Central')).toBeInTheDocument()
      expect(screen.getByText('Museu de Arte')).toBeInTheDocument()
    })

    const campoBusca = screen.getByRole('searchbox')

    await user.type(campoBusca, 'Biblioteca')

    expect(screen.getByText('Biblioteca Central')).toBeInTheDocument()
    expect(screen.queryByText('Museu de Arte')).not.toBeInTheDocument()
    expect(screen.getByText('1 local encontrado')).toBeInTheDocument()
  })

  it('ignora letras maiúsculas e minúsculas na busca', async () => {
    const user = userEvent.setup()

    renderizarPagina()

    const campoBusca = await screen.findByRole('searchbox')

    await user.type(campoBusca, 'BIBLIOTECA')

    expect(screen.getByText('Biblioteca Central')).toBeInTheDocument()
    expect(screen.queryByText('Museu de Arte')).not.toBeInTheDocument()
  })

  it('exibe mensagem quando a busca não encontra locais', async () => {
    const user = userEvent.setup()

    renderizarPagina()

    const campoBusca = await screen.findByRole('searchbox')

    await user.type(campoBusca, 'Restaurante')

    expect(
      screen.getByText(
        'Nenhum local corresponde à pesquisa e aos filtros selecionados.',
      ),
    ).toBeInTheDocument()

    expect(screen.getByText('0 locais encontrados')).toBeInTheDocument()
  })
})