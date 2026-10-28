import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'
import DetalheLocal from './DetalheLocal'

vi.mock('../../services/locais', () => ({ obterLocalPorId: vi.fn() }))

const local: Local = {
  id: 1,
  nome: 'Biblioteca Central',
  endereco: 'Rua A, 10',
  categoria: 'Cultura',
  tiposAcessibilidade: ['Rampa', 'Elevador'],
  descricao: 'Espaço de leitura com acervo em braile.',
  notaAcessibilidade: 4,
}

function renderizarDetalhe(id: string) {
  render(
    <MemoryRouter initialEntries={[`/locais/${id}`]}>
      <Routes>
        <Route path="/locais/:id" element={<DetalheLocal />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DetalheLocal', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('mostra os dados do local quando o serviço responde', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ data: local })
    renderizarDetalhe('1')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Biblioteca Central' }),
    ).toBeInTheDocument()
    expect(obterLocalPorId).toHaveBeenCalledTimes(1)
    expect(obterLocalPorId).toHaveBeenCalledWith(1)

    const artigo = screen.getByRole('article')
    expect(artigo).toHaveTextContent('Cultura')
    expect(artigo).toHaveTextContent('Rua A, 10')

    const descricao = screen.getByRole('region', { name: 'Descrição' })
    expect(descricao).toHaveTextContent('Espaço de leitura com acervo em braile.')

    const recursos = screen.getByRole('region', { name: 'Recursos de acessibilidade' })
    const itens = within(recursos).getAllByRole('listitem')
    expect(itens).toHaveLength(2)
    expect(itens[0]).toHaveTextContent('Rampa')
    expect(itens[1]).toHaveTextContent('Elevador')
  })

  it('mostra o carregamento enquanto o serviço não responde', () => {
    vi.mocked(obterLocalPorId).mockReturnValue(
      new Promise<Awaited<ReturnType<typeof obterLocalPorId>>>(() => {}),
    )
    renderizarDetalhe('1')

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando informações do local...',
    )
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /^Editar local/ }),
    ).not.toBeInTheDocument()
  })

  it('mostra a mensagem quando o local não tem recursos de acessibilidade', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({
      data: { ...local, tiposAcessibilidade: [] },
    })
    renderizarDetalhe('1')

    const recursos = await screen.findByRole('region', {
      name: 'Recursos de acessibilidade',
    })
    expect(recursos).toHaveTextContent('Nenhum recurso de acessibilidade informado.')
    expect(within(recursos).queryByRole('list')).not.toBeInTheDocument()
  })

  it('mostra os links de voltar e editar com os destinos corretos após carregar', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ data: local })
    renderizarDetalhe('1')

    expect(
      await screen.findByRole('link', { name: 'Voltar para a lista de locais' }),
    ).toHaveAttribute('href', '/locais')
    expect(
      screen.getByRole('link', { name: /Editar local\s?Biblioteca Central/ }),
    ).toHaveAttribute('href', '/locais/editar/1')
  })

  // Testes existentes da avaliação: mantenha-os.
  it('mostra a nota "4 de 5" quando o local tem avaliação', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({ data: local })
    renderizarDetalhe('1')
    expect(await screen.findByText('4 de 5')).toBeInTheDocument()
  })

  it('mostra mensagem amigável, sem erro, quando não há avaliação', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({
      data: { ...local, notaAcessibilidade: null },
    })
    renderizarDetalhe('4')
    expect(
      await screen.findByText('Este local ainda não foi avaliado quanto à acessibilidade.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('mostra erro quando a API falha', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({
      error: { status: 500, message: 'Erro de conexão com a API' },
    })
    renderizarDetalhe('1')
    expect(await screen.findByRole('alert')).toHaveTextContent('Erro de conexão com a API')
    expect(
      screen.queryByRole('link', { name: /^Editar local/ }),
    ).not.toBeInTheDocument()
  })

  it.each(['abc', '0', '-3', '2.5'])(
    'rejeita identificador inválido "%s" sem chamar o serviço',
    (id) => {
      vi.mocked(obterLocalPorId).mockResolvedValue({ data: local })
      renderizarDetalhe(id)

      expect(screen.getByRole('alert')).toHaveTextContent(
        'Endereço inválido: o identificador do local precisa ser um número.',
      )
      expect(obterLocalPorId).not.toHaveBeenCalled()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: /^Editar local/ }),
      ).not.toBeInTheDocument()
    },
  )

  it('mostra local não encontrado quando o serviço responde com 404', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({
      error: {
        status: 404,
        message: 'Não encontramos o que você procurou. Ele pode ter sido removido.',
      },
    })
    renderizarDetalhe('1')

    expect(await screen.findByRole('alert')).toHaveTextContent('Local não encontrado.')
    expect(screen.getByRole('alert')).not.toHaveTextContent('Não encontramos')
    expect(
      screen.queryByRole('link', { name: /^Editar local/ }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para a lista de locais' }),
    ).toHaveAttribute('href', '/locais')
  })

  it('mostra erro inesperado quando o serviço rejeita a Promise', async () => {
    vi.mocked(obterLocalPorId).mockRejectedValue(new Error('Falha inesperada'))
    renderizarDetalhe('1')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Erro inesperado ao carregar o local.',
    )
    expect(
      screen.queryByRole('link', { name: /^Editar local/ }),
    ).not.toBeInTheDocument()
  })

  it('mostra local não encontrado quando o serviço responde sem dados', async () => {
    vi.mocked(obterLocalPorId).mockResolvedValue({})
    renderizarDetalhe('1')

    expect(await screen.findByRole('alert')).toHaveTextContent('Local não encontrado.')
    expect(
      screen.queryByRole('link', { name: /^Editar local/ }),
    ).not.toBeInTheDocument()
  })
})
