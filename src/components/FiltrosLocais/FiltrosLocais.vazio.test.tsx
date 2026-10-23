import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FiltrosLocais, { MENSAGEM_SEM_RECURSOS } from './FiltrosLocais'

function criarProps(categoria = '') {
  return {
    categorias: ['Saúde', 'Cultura'],
    categoria,
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

  it('sem recursos e com categoria ativa, o botão "Limpar filtros e busca" continua funcionando', async () => {
    const props = criarProps('Saúde')
    const user = userEvent.setup()

    render(<FiltrosLocais recursosDisponiveis={[]} {...props} />)

    const botaoLimpar = screen.getByRole('button', {
      name: 'Limpar filtros e busca (1)',
    })

    await user.click(botaoLimpar)

    expect(props.onLimpar).toHaveBeenCalledTimes(1)
  })

  it('quando os recursos voltam, o aviso sai e a grade de checkboxes reaparece', () => {
    const props = criarProps()
    const { rerender } = render(
      <FiltrosLocais recursosDisponiveis={[]} {...props} />,
    )

    expect(screen.getByText(MENSAGEM_SEM_RECURSOS)).toBeInTheDocument()

    rerender(
      <FiltrosLocais recursosDisponiveis={['Elevador', 'Rampa']} {...props} />,
    )

    expect(screen.queryByText(MENSAGEM_SEM_RECURSOS)).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Elevador' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Rampa' })).toBeInTheDocument()
  })
})
