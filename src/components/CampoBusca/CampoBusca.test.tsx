import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import CampoBusca from './CampoBusca'

function CampoBuscaComEstado() {
  const [valor, setValor] = useState('')

  return <CampoBusca valor={valor} onChange={setValor} />
}

describe('CampoBusca', () => {
  it('exibe o campo de busca com o rótulo correto', () => {
    render(<CampoBuscaComEstado />)

    expect(
      screen.getByLabelText('Buscar por nome'),
    ).toBeInTheDocument()
  })

  it('atualiza o valor ao digitar no campo', async () => {
    const user = userEvent.setup()

    render(<CampoBuscaComEstado />)

    const campo = screen.getByLabelText('Buscar por nome')

    await user.type(campo, 'parque')

    expect(campo).toHaveValue('parque')
  })

  it('exibe o botão de limpar quando existe texto na busca', async () => {
    const user = userEvent.setup()

    render(<CampoBuscaComEstado />)

    const campo = screen.getByLabelText('Buscar por nome')

    await user.type(campo, 'parque')

    expect(
      screen.getByRole('button', { name: 'Limpar busca' }),
    ).toBeInTheDocument()
  })

  it('limpa o texto e devolve o foco ao campo', async () => {
    const user = userEvent.setup()

    render(<CampoBuscaComEstado />)

    const campo = screen.getByLabelText('Buscar por nome')

    await user.type(campo, 'parque')
    await user.click(
      screen.getByRole('button', { name: 'Limpar busca' }),
    )

    expect(campo).toHaveValue('')
    expect(campo).toHaveFocus()
  })
})