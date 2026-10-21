import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '../../services/api'
import { invalidarCacheLocais, lerCache } from '../../services/cacheLocais'
import Locais from './Locais'

vi.mock('../../services/api')
const api = vi.mocked(apiRequest)
const local = {
  id: 1, nome: 'Biblioteca Central', endereco: 'Rua A, 10', categoria: 'Cultura',
  descricao: 'Espaço de leitura', tiposAcessibilidade: ['Rampa'], notaAcessibilidade: 4,
}

beforeEach(() => {
  vi.resetAllMocks()
  invalidarCacheLocais()
  api.mockResolvedValue({ data: [local] })
})

function EstadoRota() {
  const rota = useLocation()
  return <output aria-label="URL atual">{rota.pathname + rota.search}</output>
}

async function abrirListagem(url = '/locais') {
  render(<MemoryRouter initialEntries={[url]}><Locais /><EstadoRota /></MemoryRouter>)
  await screen.findByRole('heading', { name: local.nome })
  return userEvent.setup()
}

describe('Integração da exclusão com o cache', () => {
  it('preserva filtros da URL e ordenação ao excluir e limpar os filtros', async () => {
    const arena = { ...local, id: 2, nome: 'Arena Acessível' }
    api.mockResolvedValueOnce({ data: [local, arena] })
    const user = await abrirListagem('/locais?busca=Biblioteca&categoria=Cultura&recurso=Rampa')
    expect(screen.getByRole('searchbox')).toHaveValue('Biblioteca')
    expect(screen.getByLabelText('Categoria')).toHaveValue('Cultura')
    expect(screen.getByRole('checkbox', { name: 'Rampa' })).toBeChecked()
    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'nome-desc')
    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'Arena')
    expect(screen.getByRole('heading', { name: arena.nome })).toBeInTheDocument()
    expect(screen.getByLabelText('URL atual')).toHaveTextContent('busca=Arena')
    expect(api).toHaveBeenCalledTimes(1)

    api.mockResolvedValueOnce({ data: undefined }).mockResolvedValueOnce({ data: [local] })
    await user.click(screen.getByRole('button', { name: `Excluir ${arena.nome}` }))
    await user.click(screen.getByRole('button', { name: 'Excluir local' }))
    await waitFor(() => expect(screen.queryByRole('heading', { name: arena.nome })).not.toBeInTheDocument())
    expect(screen.getByRole('searchbox')).toHaveValue('Arena')
    expect(screen.getByLabelText('Ordenar por')).toHaveValue('nome-desc')
    expect(lerCache()?.dados).toEqual([local])
    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(screen.getByLabelText('URL atual')).toHaveTextContent('/locais')
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('heading', { name: local.nome })).toBeInTheDocument()
  })

  it('mantém a ordenação e a ação de excluir ao atualizar a lista', async () => {
    const arena = { ...local, id: 2, nome: 'Arena Acessível' }
    api.mockResolvedValueOnce({ data: [local, arena] })
    const user = await abrirListagem()
    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'nome-desc')
    expect(screen.getAllByRole('heading', { level: 3 }).map((item) => item.textContent))
      .toEqual([local.nome, arena.nome])
    api.mockResolvedValueOnce({ data: undefined }).mockResolvedValueOnce({ data: [arena] })
    await user.click(screen.getByRole('button', { name: `Excluir ${local.nome}` }))
    await user.click(screen.getByRole('button', { name: 'Excluir local' }))
    await waitFor(() => expect(screen.queryByRole('heading', { name: local.nome })).not.toBeInTheDocument())
    expect(screen.getByLabelText('Ordenar por')).toHaveValue('nome-desc')
    expect(lerCache()?.dados).toEqual([arena])
  })

  it('recarrega a lista e atualiza o cache após excluir', async () => {
    const user = await abrirListagem()
    api.mockResolvedValueOnce({ data: undefined }).mockResolvedValueOnce({ data: [] })
    await user.click(screen.getByRole('button', { name: `Excluir ${local.nome}` }))
    expect(api).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Excluir local' }))

    expect(api).toHaveBeenCalledWith('/locais/1', { method: 'DELETE' })
    await waitFor(() => expect(screen.queryByRole('heading', { name: local.nome })).not.toBeInTheDocument())
    expect(screen.getByText(`Local "${local.nome}" excluído.`)).toBeInTheDocument()
    expect(lerCache()?.dados).toEqual([])
  })

  it('cancelar e Esc mantêm o card e não chamam a exclusão', async () => {
    const user = await abrirListagem()
    await user.click(screen.getByRole('button', { name: `Excluir ${local.nome}` }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('button', { name: `Excluir ${local.nome}` }))
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: local.nome })).toBeInTheDocument()
    expect(api).toHaveBeenCalledTimes(1)
  })

  it('falha na exclusão mantém o card, o cache e o diálogo com erro', async () => {
    const user = await abrirListagem()
    api.mockResolvedValueOnce({ error: { message: 'Falha na exclusão', status: 500 } })
    await user.click(screen.getByRole('button', { name: `Excluir ${local.nome}` }))
    await user.click(screen.getByRole('button', { name: 'Excluir local' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha na exclusão')
    expect(screen.getByRole('dialog')).toHaveAttribute('open')
    expect(screen.getByRole('heading', { name: local.nome })).toBeInTheDocument()
    expect(lerCache()?.dados).toEqual([local])
  })
})
