import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import DetalheLocal from './DetalheLocal'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'
import { DICA_FALHAS_SEGUIDAS } from '../../utils/novaTentativa'

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

const falha503 = {
  error: { message: 'O serviço está temporariamente indisponível.', status: 503 },
}

function renderizar(id: string) {
  render(
    <MemoryRouter initialEntries={[`/locais/${id}`]}>
      <Routes>
        <Route path="/locais/:id" element={<DetalheLocal />} />
      </Routes>
    </MemoryRouter>,
  )
}

function clicarEmTentarNovamente() {
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
}

describe('DetalheLocal - nova tentativa', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('mostra "Tentar novamente" quando a falha não tem status', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ error: { message: 'Erro de conexão com a API' } })
    renderizar('1')
    await screen.findByRole('alert')
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it.each([408, 429, 500, 503])('mostra "Tentar novamente" no status %i', async (status) => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ error: { message: 'Falha temporária.', status } })
    renderizar('1')
    await screen.findByRole('alert')
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it.each([400, 403, 404])('não mostra "Tentar novamente" no status %i', async (status) => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ error: { message: 'Falha definitiva.', status } })
    renderizar('1')
    await screen.findByRole('alert')
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).not.toBeInTheDocument()
  })

  it('não mostra "Tentar novamente" com id inválido', async () => {
    renderizar('abc')
    await screen.findByRole('alert')
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).not.toBeInTheDocument()
    expect(obterLocalPorId).not.toHaveBeenCalled()
  })

  it('não mostra "Tentar novamente" quando o serviço não devolve dados', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({})
    renderizar('1')
    expect(await screen.findByText('Local não encontrado.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).not.toBeInTheDocument()
  })

  it('mostra o carregamento durante a nova tentativa', async () => {
    vi.mocked(obterLocalPorId)
      .mockResolvedValueOnce(falha503)
      .mockReturnValueOnce(new Promise(() => {}))
    renderizar('1')
    await screen.findByRole('alert')
    clicarEmTentarNovamente()
    expect(await screen.findByRole('status')).toHaveTextContent('Carregando informações do local...')
  })

  it('busca de novo e mostra o local com o foco no resultado', async () => {
    vi.mocked(obterLocalPorId)
      .mockResolvedValueOnce(falha503)
      .mockResolvedValueOnce({ data: local })
    renderizar('1')
    await screen.findByRole('alert')
    clicarEmTentarNovamente()
    expect(await screen.findByRole('heading', { level: 1, name: 'Biblioteca Central' })).toBeInTheDocument()
    expect(obterLocalPorId).toHaveBeenCalledTimes(2)
    await waitFor(() => expect(document.getElementById('resultado-detalhe')).toHaveFocus())
  })

  it('leva o foco para a nova mensagem quando a nova tentativa falha', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue(falha503)
    renderizar('1')
    await screen.findByRole('alert')
    clicarEmTentarNovamente()
    await waitFor(() => expect(obterLocalPorId).toHaveBeenCalledTimes(2))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    await waitFor(() => expect(document.getElementById('resultado-detalhe')).toHaveFocus())
  })

  it('não move o foco no primeiro carregamento', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue(falha503)
    renderizar('1')
    await screen.findByRole('alert')
    expect(document.body).toHaveFocus()
  })

  it('acrescenta a dica só a partir da 3ª falha seguida', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue(falha503)
    renderizar('1')
    await screen.findByRole('alert')

    clicarEmTentarNovamente()
    await waitFor(() => expect(obterLocalPorId).toHaveBeenCalledTimes(2))
    const alertaDaSegundaFalha = await screen.findByRole('alert')
    expect(alertaDaSegundaFalha).not.toHaveTextContent(DICA_FALHAS_SEGUIDAS)

    clicarEmTentarNovamente()
    await waitFor(() => expect(obterLocalPorId).toHaveBeenCalledTimes(3))
    const alertaDaTerceiraFalha = await screen.findByRole('alert')
    expect(alertaDaTerceiraFalha).toHaveTextContent(DICA_FALHAS_SEGUIDAS)
  })
})
it('mantém o foco no resultado da tentativa mesmo com aviso vindo da edição', async () => {
  vi.mocked(obterLocalPorId)
    .mockResolvedValueOnce(falha503)
    .mockResolvedValueOnce({ data: local })
  render(
    <MemoryRouter initialEntries={[{ pathname: '/locais/1', state: { mensagem: 'Local atualizado.' } }]}>
      <Routes><Route path='/locais/:id' element={<DetalheLocal />} /></Routes>
    </MemoryRouter>,
  )
  await screen.findByRole('alert')
  clicarEmTentarNovamente()
  await screen.findByRole('heading', { name: 'Biblioteca Central' })
  const aviso = screen.getByText('Local atualizado.').closest('p')
  const resultado = document.getElementById('resultado-detalhe')
  expect(aviso?.nextElementSibling).toBe(resultado)
  await waitFor(() => expect(resultado).toHaveFocus())
  expect(document.title).toBe('Biblioteca Central | Portal Acessível')
})