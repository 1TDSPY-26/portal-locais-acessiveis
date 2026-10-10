import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import EditLocation from './EditLocation'
import {
  atualizarLocal,
  obterLocalPorId,
} from '../../services/locais'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ id: '1' }),
}))

vi.mock('../../services/locais', () => ({
  atualizarLocal: vi.fn(),
  obterLocalPorId: vi.fn(),
}))

describe('EditLocation', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(obterLocalPorId).mockResolvedValue({
      data: {
        id: 1,
        nome: 'Biblioteca Central',
        endereco: 'Rua Principal, 100',
        categoria: 'Biblioteca',
        tiposAcessibilidade: ['Rampa'],
        descricao: 'Biblioteca acessível',
        notaAcessibilidade: 9,
      },
    })

    vi.mocked(atualizarLocal).mockResolvedValue({
      data: {
        id: 1,
        nome: 'Biblioteca Central',
        endereco: 'Rua Principal, 100',
        categoria: 'Biblioteca',
        tiposAcessibilidade: ['Rampa'],
        descricao: 'Biblioteca acessível',
        notaAcessibilidade: 9,
      },
    })
  })

  it('carrega o nome do local no formulário', async () => {
    render(<EditLocation />)

    const input = await screen.findByRole('textbox', {
      name: 'Nome do Local:',
    })

    expect(input).toHaveValue('Biblioteca Central')
    expect(obterLocalPorId).toHaveBeenCalledWith(1)
  })

  it('permite alterar o nome e salvar', async () => {
    const user = userEvent.setup()

    render(<EditLocation />)

    const input = await screen.findByRole('textbox', {
      name: 'Nome do Local:',
    })

    await user.clear(input)
    await user.type(input, 'Novo Nome')

    await user.click(
      screen.getByRole('button', {
        name: 'Salvar Alterações',
      }),
    )

    await waitFor(() => {
      expect(atualizarLocal).toHaveBeenCalledWith(1, {
        nome: 'Novo Nome',
      })
    })

    expect(
      screen.getByText('Local atualizado com sucesso!'),
    ).toBeInTheDocument()
  })

  it('exibe a mensagem de erro retornada pela API', async () => {
    const user = userEvent.setup()

    vi.mocked(atualizarLocal).mockResolvedValueOnce({
      error: {
        message: 'Erro ao atualizar o local',
      },
    })

    render(<EditLocation />)

    const input = await screen.findByRole('textbox', {
      name: 'Nome do Local:',
    })

    await user.clear(input)
    await user.type(input, 'Novo Nome')

    await user.click(
      screen.getByRole('button', {
        name: 'Salvar Alterações',
      }),
    )

    expect(
      await screen.findByText('Erro ao atualizar o local'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Local atualizado com sucesso!'),
    ).not.toBeInTheDocument()
  })
})