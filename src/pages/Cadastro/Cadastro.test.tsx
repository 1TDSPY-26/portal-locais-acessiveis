import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Cadastro from './Cadastro'

describe('Cadastro', () => {
  it('explica os erros e leva o foco ao primeiro campo inválido', async () => {
    const user = userEvent.setup()
    render(<Cadastro />)

    await user.click(screen.getByRole('button', { name: 'Cadastrar local' }))

    const nome = screen.getByRole('textbox', { name: /Nome do local/ })
    expect(nome).toHaveFocus()
    expect(nome).toHaveAttribute('aria-invalid', 'true')
    expect(nome).toHaveAccessibleDescription('Nome do local é obrigatório.')

    await user.type(nome, 'Biblioteca Exemplo')
    expect(nome).toHaveAttribute('aria-invalid', 'false')
    expect(screen.queryByText('Nome do local é obrigatório.')).not.toBeInTheDocument()
  })
})
