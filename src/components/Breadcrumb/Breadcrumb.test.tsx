import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Breadcrumb from './Breadcrumb'
import DetalheLocal from '../../pages/DetalheLocal/DetalheLocal'
import EditLocation from '../../pages/EditLocation/EditLocation'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'

vi.mock('../../services/locais', () => ({
  obterLocalPorId: vi.fn(),
  atualizarLocal: vi.fn(),
}))

const local: Local = {
  id: 1,
  nome: 'Biblioteca Central',
  endereco: 'Rua A, 10',
  categoria: 'Cultura',
  tiposAcessibilidade: ['Rampa'],
  descricao: 'Espaço de leitura',
  notaAcessibilidade: 4,
}

const itens = [
  { rotulo: 'Início', para: '/' },
  { rotulo: 'Locais', para: '/locais' },
  { rotulo: 'Biblioteca Central' },
]

function abrirComponente(lista = itens) {
  render(
    <MemoryRouter>
      <Breadcrumb itens={lista} />
    </MemoryRouter>,
  )
}

function abrirPagina(url: string) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/locais/:id" element={<DetalheLocal />} />
        <Route path="/locais/editar/:id" element={<EditLocation />} />
      </Routes>
    </MemoryRouter>,
  )
}

function navegacao() {
  return screen.getByRole('navigation', { name: 'Caminho de navegação' })
}

describe('Breadcrumb acessível', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(obterLocalPorId).mockResolvedValue({ data: local })
  })

  it('mostra navegação com lista de três itens', () => {
    abrirComponente()
    expect(within(navegacao()).getByRole('list')).toBeInTheDocument()
    expect(within(navegacao()).getAllByRole('listitem')).toHaveLength(3)
  })

  it('itens anteriores têm links com destinos corretos', () => {
    abrirComponente()
    expect(within(navegacao()).getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/')
    expect(within(navegacao()).getByRole('link', { name: 'Locais' })).toHaveAttribute('href', '/locais')
  })

  it('último item é a página atual mesmo se receber destino', () => {
    abrirComponente([...itens.slice(0, 2), { rotulo: 'Biblioteca Central', para: '/locais/1' }])
    expect(within(navegacao()).getByText('Biblioteca Central')).toHaveAttribute('aria-current', 'page')
    expect(within(navegacao()).queryByRole('link', { name: 'Biblioteca Central' })).not.toBeInTheDocument()
  })

  it('oculta os dois separadores do leitor de tela', () => {
    abrirComponente()
    const separadores = navegacao().querySelectorAll('[aria-hidden="true"]')
    expect(separadores).toHaveLength(2)
    separadores.forEach((elemento) => expect(elemento).toHaveTextContent('›'))
  })

  it('não mostra navegação com lista vazia', () => {
    abrirComponente([])
    expect(screen.queryByRole('navigation', { name: 'Caminho de navegação' })).not.toBeInTheDocument()
  })

  it('mostra caminho no detalhe carregado', async () => {
    abrirPagina('/locais/1')
    expect(await screen.findByText('4 de 5')).toBeInTheDocument()
    expect(within(navegacao()).getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/')
    expect(within(navegacao()).getByRole('link', { name: 'Locais' })).toHaveAttribute('href', '/locais')
    expect(within(navegacao()).getByText('Biblioteca Central')).toHaveAttribute('aria-current', 'page')
  })

  it('não mostra caminho no detalhe com erro', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ error: { message: 'x', status: 404 } })
    abrirPagina('/locais/1')
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Caminho de navegação' })).not.toBeInTheDocument()
  })

  it('mostra caminho na edição carregada', async () => {
    abrirPagina('/locais/editar/1')
    expect(await screen.findByLabelText('Nome do local')).toBeInTheDocument()
    const nav = within(navegacao())
    expect(nav.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/')
    expect(nav.getByRole('link', { name: 'Locais' })).toHaveAttribute('href', '/locais')
    expect(nav.getByRole('link', { name: 'Biblioteca Central' })).toHaveAttribute('href', '/locais/1')
    expect(nav.getByText('Editar')).toHaveAttribute('aria-current', 'page')
  })

  it('mantém o nome original enquanto o campo é editado', async () => {
    const usuario = userEvent.setup()
    abrirPagina('/locais/editar/1')
    const campo = await screen.findByLabelText('Nome do local')
    await usuario.clear(campo)
    await usuario.type(campo, 'Outro nome')
    const nav = within(navegacao())
    expect(nav.getByRole('link', { name: 'Biblioteca Central' })).toHaveAttribute('href', '/locais/1')
    expect(nav.queryByRole('link', { name: 'Outro nome' })).not.toBeInTheDocument()
  })

  it('não mostra caminho na edição com erro', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ error: { message: 'Falha', status: 500 } })
    abrirPagina('/locais/editar/1')
    expect(await screen.findByText('Falha')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Caminho de navegação' })).not.toBeInTheDocument()
  })
})
