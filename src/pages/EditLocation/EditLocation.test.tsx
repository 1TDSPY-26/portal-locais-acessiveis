import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { atualizarLocal, obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'
import EditLocation from './EditLocation'

vi.mock('../../services/locais')

const biblioteca: Local = {
  id: 1,
  nome: 'Biblioteca Central',
  endereco: 'Rua A, 10',
  categoria: 'Cultura',
  tiposAcessibilidade: ['Rampa'],
  descricao: 'Espaço de leitura',
  notaAcessibilidade: 4,
}

function abrirEdicao() {
  render(
    <MemoryRouter initialEntries={['/locais/editar/1']}>
      <Routes>
        <Route
          path="/locais/editar/:id"
          element={<EditLocation />}
        />
        <Route
          path="/locais"
          element={<h1>Página de locais</h1>}
        />
        <Route
          path="/locais/:id"
          element={<h1>Página de detalhe</h1>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('EditLocation', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.mocked(obterLocalPorId).mockResolvedValue({
      data: biblioteca,
    })

    vi.mocked(atualizarLocal).mockResolvedValue({
      data: biblioteca,
    })
  })

  it('exibe o carregamento enquanto busca o local', () => {
    vi.mocked(obterLocalPorId).mockReturnValue(
      new Promise(() => { }),
    )

    abrirEdicao()

    expect(
      screen.getByRole('status'),
    ).toHaveTextContent('Carregando dados do local...')
  })

  it('preenche o formulário com o nome do local', async () => {
    abrirEdicao()

    expect(
      await screen.findByLabelText(/nome do local/i),
    ).toHaveValue('Biblioteca Central')

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Editar local' }),
    ).toBeInTheDocument()
  })

  it('busca o local com o id da URL convertido para número', async () => {
    abrirEdicao()

    await screen.findByLabelText(/nome do local/i)

    expect(obterLocalPorId).toHaveBeenCalledWith(1)
  })

  it('mostra o erro ao carregar', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({
      error: {
        message: 'Falha ao carregar',
        status: 500,
      },
    })

    abrirEdicao()

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(/^Erro:.*Falha ao carregar/)
  })

  it('envia o nome alterado para atualizarLocal', async () => {
    const user = userEvent.setup()

    abrirEdicao()

    const input = await screen.findByLabelText(/nome do local/i)

    await user.clear(input)
    await user.type(input, 'Novo Nome')

    await user.click(
      screen.getByRole('button', {
        name: /salvar alterações/i,
      }),
    )

    await waitFor(() => {
      expect(atualizarLocal).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          nome: 'Novo Nome',
        }),
      )
    })

    expect(
      await screen.findByRole('status'),
    ).toHaveTextContent('Sucesso: local atualizado com sucesso!')
  })

  it('redireciona após salvar com sucesso', async () => {
    const user = userEvent.setup()

    abrirEdicao()

    const input = await screen.findByLabelText(/nome do local/i)

    await user.clear(input)
    await user.type(input, 'Novo Nome')

    await user.click(
      screen.getByRole('button', {
        name: /salvar alterações/i,
      }),
    )

    expect(
      await screen.findByRole(
        'heading',
        { name: /página de locais/i },
        { timeout: 3000 },
      ),
    ).toBeInTheDocument()
  })

  it('mostra o erro ao salvar e mantém o texto digitado', async () => {
    const user = userEvent.setup()

    vi.mocked(atualizarLocal).mockResolvedValueOnce({
      error: {
        message: 'Falha ao salvar',
        status: 500,
      },
    })

    abrirEdicao()

    const input = await screen.findByLabelText(/nome do local/i)

    await user.clear(input)
    await user.type(input, 'Novo Nome')

    await user.click(
      screen.getByRole('button', {
        name: /salvar alterações/i,
      }),
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(/^Erro:.*Falha ao salvar/)

    expect(input).toHaveValue('Novo Nome')

    expect(
      screen.queryByText(/local atualizado com sucesso/i),
    ).not.toBeInTheDocument()
  })

  it('impede salvar um campo inválido e foca o primeiro erro', async () => {
    const user = userEvent.setup()
    abrirEdicao()
    const nome = await screen.findByLabelText(/nome do local/i)
    await user.clear(nome)
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

    expect(atualizarLocal).not.toHaveBeenCalled()
    expect(nome).toHaveAttribute('aria-invalid', 'true')
    expect(nome).toHaveFocus()
    expect(nome).toHaveAccessibleDescription('Informe o nome do local com pelo menos 3 letras.')
  })
})
