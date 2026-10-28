import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '../../services/api'
import { invalidarCacheLocais, lerCache } from '../../services/cacheLocais'
import Locais from './Locais'

vi.mock('../../services/api')
const api = vi.mocked(apiRequest)
const locais = Array.from({ length: 25 }, (_, indice) => ({
  id: indice + 1,
  nome: `Local ${String(indice + 1).padStart(2, '0')}`,
  endereco: `Rua ${indice + 1}`,
  categoria: indice % 2 === 0 ? 'Cultura' : 'Lazer',
  descricao: 'Local de teste',
  tiposAcessibilidade: indice % 2 === 0 ? ['Rampa'] : ['Elevador'],
  notaAcessibilidade: 4,
}))

beforeEach(() => {
  vi.resetAllMocks()
  invalidarCacheLocais()
  api.mockResolvedValue({ data: locais })
})

function RotaAtual() {
  return <output aria-label="URL atual">{useLocation().search}</output>
}

async function abrirListagem(url = '/locais') {
  render(<MemoryRouter initialEntries={[url]}><Locais /><RotaAtual /></MemoryRouter>)
  await screen.findByRole('heading', { name: 'Local 01' })
  return userEvent.setup()
}

function nomesVisiveis() {
  return screen.getAllByRole('heading', { level: 3 }).map((titulo) => titulo.textContent)
}

describe('Paginação integrada à listagem', () => {
  it('divide 25 locais em 9, 9 e 7 e anuncia a página atual e os limites', async () => {
    const user = await abrirListagem()
    const navegacao = screen.getByRole('navigation', { name: 'Paginação' })
    expect(within(navegacao).getAllByRole('button', { name: /Página \d/ })).toHaveLength(3)
    expect(nomesVisiveis()).toEqual(locais.slice(0, 9).map((local) => local.nome))
    expect(screen.getByText('Mostrando 1–9 de 25 locais')).toHaveAttribute('role', 'status')
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Próxima' }))
    expect(nomesVisiveis()).toEqual(locais.slice(9, 18).map((local) => local.nome))
    expect(screen.getByText('Mostrando 10–18 de 25 locais')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: 'Lista de locais cadastrados' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Página 3' }))
    expect(nomesVisiveis()).toEqual(locais.slice(18).map((local) => local.nome))
    expect(screen.getByText('Mostrando 19–25 de 25 locais')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled()
  })

  it('aciona os botões pelo teclado e leva o foco e a rolagem ao título', async () => {
    const user = await abrirListagem()
    const titulo = screen.getByRole('heading', { name: 'Lista de locais cadastrados' })
    const rolar = vi.fn()
    titulo.scrollIntoView = rolar
    const pagina2 = screen.getByRole('button', { name: 'Página 2' })
    pagina2.focus()
    await user.keyboard('{Enter}')
    expect(titulo).toHaveFocus()
    expect(rolar).toHaveBeenCalledWith({ block: 'start' })
    expect(screen.getByText('Mostrando 10–18 de 25 locais')).toBeInTheDocument()
    const pagina3 = screen.getByRole('button', { name: 'Página 3' })
    pagina3.focus()
    await user.keyboard(' ')
    expect(screen.getByText('Mostrando 19–25 de 25 locais')).toBeInTheDocument()
  })

  it('volta à primeira página ao mudar categoria, recurso e busca, preservando a URL', async () => {
    const user = await abrirListagem()
    await user.click(screen.getByRole('button', { name: 'Página 3' }))
    await user.selectOptions(screen.getByLabelText('Categoria'), 'Cultura')
    expect(screen.getByText('Mostrando 1–9 de 13 locais')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('button', { name: 'Página 2' }))
    await user.click(screen.getByRole('checkbox', { name: 'Rampa' }))
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('button', { name: 'Página 2' }))
    await user.type(screen.getByRole('searchbox'), 'Local 0')
    expect(screen.getByText('Mostrando 1–5 de 5 locais')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Paginação' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('URL atual')).toHaveTextContent('categoria=Cultura')
    expect(screen.getByLabelText('URL atual')).toHaveTextContent('recurso=Rampa')
    expect(api).toHaveBeenCalledTimes(1)
  })

  it('pagina a lista ordenada e mantém a página ao ordenar', async () => {
    const user = await abrirListagem()
    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'nome-desc')
    expect(nomesVisiveis()).toEqual([...locais].reverse().slice(0, 9).map((local) => local.nome))
    await user.click(screen.getByRole('button', { name: 'Página 2' }))
    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'nome-asc')
    expect(nomesVisiveis()).toEqual(locais.slice(9, 18).map((local) => local.nome))
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('esconde a navegação com nove locais e conta zero quando a busca não encontra', async () => {
    api.mockResolvedValueOnce({ data: locais.slice(0, 9) })
    const user = await abrirListagem()
    expect(screen.queryByRole('navigation', { name: 'Paginação' })).not.toBeInTheDocument()
    await user.type(screen.getByRole('searchbox'), 'ausente')
    expect(screen.getByText('Mostrando 0–0 de 0 locais')).toBeInTheDocument()
    expect(screen.getByText('Nenhum local encontrado')).toBeInTheDocument()
    expect(screen.getByText('Nenhum local corresponde a: busca "ausente". Tente remover algum filtro.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mostrar todos os locais' })).toBeInTheDocument()
  })

  it('corrige a página após excluir o último card sem perder filtros, ordem ou cache', async () => {
    api.mockResolvedValueOnce({ data: locais.slice(0, 19) })
    const user = await abrirListagem('/locais?busca=Local')
    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'nome-desc')
    await user.click(screen.getByRole('button', { name: 'Página 3' }))
    expect(nomesVisiveis()).toEqual(['Local 01'])
    const restantes = locais.slice(1, 19)
    api.mockResolvedValueOnce({ data: undefined }).mockResolvedValueOnce({ data: restantes })
    await user.click(screen.getByRole('button', { name: 'Excluir Local 01' }))
    await user.click(screen.getByRole('button', { name: 'Excluir local' }))
    await waitFor(() => expect(screen.getByText('Mostrando 10–18 de 18 locais')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('heading', { name: 'Local 01' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Ordenar por')).toHaveValue('nome-desc')
    expect(screen.getByRole('searchbox')).toHaveValue('Local')
    expect(screen.getByLabelText('URL atual')).toHaveTextContent('busca=Local')
    expect(lerCache()?.dados).toEqual(restantes)
  })
})
