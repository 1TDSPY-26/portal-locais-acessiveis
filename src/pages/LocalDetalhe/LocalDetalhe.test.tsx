import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LocalDetalhe from './LocalDetalhe'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'

vi.mock('../../services/locais', () => ({ obterLocalPorId: vi.fn() }))

const local: Local = {
  id: 1,
  nome: 'Biblioteca Central',
  endereco: 'Rua A, 10',
  categoria: 'Cultura',
  tiposAcessibilidade: ['Rampa'],
  descricao: 'Espaço de leitura',
  notaAcessibilidade: 4,
}

function renderizar(id: string) {
  render(
    <MemoryRouter initialEntries={[`/locais/${id}`]}>
      <Routes>
        <Route path="/locais/:id" element={<LocalDetalhe />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LocalDetalhe', () => {
  beforeEach(() => vi.clearAllMocks())

  it('mostra a nota "4 de 5" quando o local tem avaliação', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ data: local })
    renderizar('1')
    expect(await screen.findByText('4 de 5')).toBeInTheDocument()
  })

  it('mostra mensagem amigável, sem erro, quando não há avaliação', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({
      data: { ...local, notaAcessibilidade: null },
    })
    renderizar('4')
    expect(
      await screen.findByText('Este local ainda não foi avaliado quanto à acessibilidade.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('mostra erro quando a API falha', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ error: { message: 'Erro de conexão com a API' } })
    renderizar('1')
    expect(await screen.findByRole('alert')).toHaveTextContent('Erro de conexão com a API')
  })
})