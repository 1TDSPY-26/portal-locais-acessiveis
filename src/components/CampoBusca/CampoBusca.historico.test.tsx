import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import CampoBusca from './CampoBusca'

describe('CampoBusca com histórico', () => {
  it('chama onPesquisar uma vez com o valor do campo ao apertar Enter', async () => {
    const onPesquisar = vi.fn()
    const user = userEvent.setup()
    render(<CampoBusca valor="biblioteca" onChange={vi.fn()} onPesquisar={onPesquisar} />)

    await user.type(screen.getByLabelText('Buscar por nome'), '{Enter}')

    expect(onPesquisar).toHaveBeenCalledTimes(1)
    expect(onPesquisar).toHaveBeenCalledWith('biblioteca')
  })

  it('só digitar chama onChange, mas não chama onPesquisar', async () => {
    const onChange = vi.fn()
    const onPesquisar = vi.fn()
    const user = userEvent.setup()
    render(<CampoBusca valor="" onChange={onChange} onPesquisar={onPesquisar} />)

    await user.type(screen.getByLabelText('Buscar por nome'), 'b')

    expect(onChange).toHaveBeenCalledWith('b')
    expect(onPesquisar).not.toHaveBeenCalled()
  })

  it('dentro de um formulário, o Enter não envia o formulário', async () => {
    const onPesquisar = vi.fn()
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(
      <form onSubmit={onSubmit}>
        <CampoBusca valor="museu" onChange={vi.fn()} onPesquisar={onPesquisar} />
      </form>,
    )

    await user.type(screen.getByLabelText('Buscar por nome'), '{Enter}')

    expect(onPesquisar).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('sem onPesquisar, digitar, apertar Enter e limpar continuam funcionando', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<CampoBusca valor="museu" onChange={onChange} />)

    const campo = screen.getByLabelText('Buscar por nome')
    await user.type(campo, '{Enter}')
    await user.type(campo, 's')
    expect(onChange).toHaveBeenLastCalledWith('museus')

    await user.click(screen.getByRole('button', { name: 'Limpar busca' }))
    expect(onChange).toHaveBeenLastCalledWith('')
  })
})