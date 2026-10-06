import { render, screen } from '@testing-library/react'
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
  {
    id: 3,
    nome: 'Centro Cultural',
    endereco: 'Rua da Cultura, 50',
    categoria: 'Centro Cultural',
    tiposAcessibilidade: ['Rampa'],
    descricao: 'Centro cultural acessível',
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

describe('Filtros de locais', () => {
  beforeEach(() => {
    vi.mocked(listarLocais).mockResolvedValue({
      data: locaisMock,
      error: null,
    })
  })

  it('filtra os locais pela categoria selecionada', async () => {
    const user = userEvent.setup()

    renderizarPagina()

    await screen.findByRole('heading', {
      name: 'Biblioteca Central',
    })

    const filtroCategoria = screen.getByRole('combobox', {
      name: 'Categoria',
    })

    await user.selectOptions(filtroCategoria, 'Museu')

    expect(
      screen.getByRole('heading', { name: 'Museu de Arte' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Biblioteca Central' }),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Centro Cultural' }),
    ).not.toBeInTheDocument()

    expect(screen.getByText('1 local encontrado')).toBeInTheDocument()
  })

  it('filtra os locais por recurso de acessibilidade', async () => {
    const user = userEvent.setup()

    renderizarPagina()

    await screen.findByRole('heading', {
      name: 'Biblioteca Central',
    })

    const rampa = screen.getByRole('checkbox', {
      name: 'Rampa',
    })

    await user.click(rampa)

    expect(
      screen.getByRole('heading', { name: 'Biblioteca Central' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Centro Cultural' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Museu de Arte' }),
    ).not.toBeInTheDocument()

    expect(screen.getByText('2 locais encontrados')).toBeInTheDocument()
  })

  it('combina mais de um recurso de acessibilidade', async () => {
    const user = userEvent.setup()

    renderizarPagina()

    await screen.findByRole('heading', {
      name: 'Biblioteca Central',
    })

    const rampa = screen.getByRole('checkbox', {
      name: 'Rampa',
    })

    const elevador = screen.getByRole('checkbox', {
      name: 'Elevador',
    })

    await user.click(rampa)
    await user.click(elevador)

    expect(
      screen.getByRole('heading', { name: 'Biblioteca Central' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Museu de Arte' }),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Centro Cultural' }),
    ).not.toBeInTheDocument()

    expect(screen.getByText('1 local encontrado')).toBeInTheDocument()
  })

  it('limpa os filtros selecionados', async () => {
    const user = userEvent.setup()

    renderizarPagina()

    await screen.findByRole('heading', {
      name: 'Biblioteca Central',
    })

    const filtroCategoria = screen.getByRole('combobox', {
      name: 'Categoria',
    })

    await user.selectOptions(filtroCategoria, 'Museu')

    expect(
      screen.getByRole('heading', { name: 'Museu de Arte' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { name: 'Biblioteca Central' }),
    ).not.toBeInTheDocument()

    const botaoLimpar = screen.getByRole('button', {
      name: /Limpar filtros e busca/,
    })

    await user.click(botaoLimpar)

    expect(
      screen.getByRole('heading', { name: 'Biblioteca Central' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Museu de Arte' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Centro Cultural' }),
    ).toBeInTheDocument()

    expect(filtroCategoria).toHaveValue('')
    expect(screen.getByText('3 locais encontrados')).toBeInTheDocument()
  })
})