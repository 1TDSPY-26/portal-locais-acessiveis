import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import NotaAcessibilidade from './NotaAcessibilidade'

describe('NotaAcessibilidade', () => {
  it('mostra a nota em texto explícito', () => {
    render(<NotaAcessibilidade nota={4} />)
    expect(screen.getByText('4 de 5')).toBeInTheDocument()
  })

  it.each([null, undefined, 0, 7])('mostra mensagem amigável para %s', (nota) => {
    render(<NotaAcessibilidade nota={nota} />)
    expect(
      screen.getByText('Este local ainda não foi avaliado quanto à acessibilidade.'),
    ).toBeInTheDocument()
  })
})