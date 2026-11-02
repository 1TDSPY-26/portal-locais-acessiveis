import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FiltrosLocais from './FiltrosLocais'

const propsBase = {
  categorias: ['Cultura', 'Lazer'],
  recursosDisponiveis: ['Elevador', 'Libras', 'Rampa'],
  categoria: '',
  recursos: [],
  buscaAtiva: false,
  onCategoriaChange: vi.fn(),
  onRecursosChange: vi.fn(),
  onLimpar: vi.fn(),
}

describe('FiltrosLocais', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exibe "Todas as categorias" mais as categorias recebidas', () => {
    render(<FiltrosLocais {...propsBase} />)

    const categoria = screen.getByLabelText('Categoria')

    expect(categoria).toHaveTextContent('Todas as categorias')
    expect(categoria).toHaveTextContent('Cultura')
    expect(categoria).toHaveTextContent('Lazer')
  })

  it('exibe o grupo de recursos de acessibilidade', () => {
    render(<FiltrosLocais {...propsBase} />)

    expect(
      screen.getByRole('group', {
        name: 'Recursos de acessibilidade',
      }),
    ).toBeInTheDocument()
  })

  it('marcar um recurso chama onRecursosChange', async () => {
    const onRecursosChange = vi.fn()

    render(
      <FiltrosLocais
        {...propsBase}
        onRecursosChange={onRecursosChange}
      />,
    )

    await userEvent.click(screen.getByLabelText('Rampa'))

    expect(onRecursosChange).toHaveBeenCalledWith(['Rampa'])
  })

  it('desmarcar um recurso chama onRecursosChange', async () => {
    const onRecursosChange = vi.fn()

    render(
      <FiltrosLocais
        {...propsBase}
        recursos={['Rampa']}
        onRecursosChange={onRecursosChange}
      />,
    )

    await userEvent.click(screen.getByLabelText('Rampa'))

    expect(onRecursosChange).toHaveBeenCalledWith([])
  })

  it('não exibe o botão de limpar quando não há filtros ativos', () => {
    render(<FiltrosLocais {...propsBase} />)

    expect(
      screen.queryByRole('button', {
        name: /Limpar filtros e busca/,
      }),
    ).not.toBeInTheDocument()
  })

  it('conta categoria, recurso e busca ativa no botão de limpar', () => {
    render(
      <FiltrosLocais
        {...propsBase}
        categoria="Cultura"
        recursos={['Rampa']}
        buscaAtiva
      />,
    )

    expect(
      screen.getByRole('button', {
        name: 'Limpar filtros e busca (3)',
      }),
    ).toBeInTheDocument()
  })
})