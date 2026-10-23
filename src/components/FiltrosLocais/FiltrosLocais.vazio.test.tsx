import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FiltrosLocais, { MENSAGEM_SEM_RECURSOS } from './FiltrosLocais'

function criarProps() {
  return {
    categorias: ['Saúde', 'Cultura'],
    categoria: '',
    recursos: [],
    buscaAtiva: false,
    onCategoriaChange: vi.fn(),
    onRecursosChange: vi.fn(),
    onLimpar: vi.fn(),
  }
}

describe('Estado vazio do filtro de recursos', () => {
  it('sem recursos, mostra o aviso dentro do grupo de recursos', () => {
    const { container } = render(
      <FiltrosLocais recursosDisponiveis={[]} {...criarProps()} />,
    )

    const grupo = screen.getByRole('group', {
      name: 'Recursos de acessibilidade',
    })

    expect(within(grupo).getByText(MENSAGEM_SEM_RECURSOS)).toBeInTheDocument()
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(0)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('com recursos, mostra um checkbox por recurso e nenhum aviso', () => {
    render(
      <FiltrosLocais recursosDisponiveis={['Elevador', 'Rampa']} {...criarProps()} />,
    )

    expect(screen.getByRole('checkbox', { name: 'Elevador' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Rampa' })).toBeInTheDocument()
    expect(screen.queryByText(MENSAGEM_SEM_RECURSOS)).not.toBeInTheDocument()
  })

  it('sem recursos, a categoria continua funcionando', async () => {
    const props = criarProps()
    const user = userEvent.setup()

    render(<FiltrosLocais recursosDisponiveis={[]} {...props} />)

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Categoria' }),
      'Saúde',
    )

    expect(props.onCategoriaChange).toHaveBeenCalledWith('Saúde')
    expect(props.onLimpar).not.toHaveBeenCalled()
  })
})
