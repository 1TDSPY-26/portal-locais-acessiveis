import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Rodape from './Footer'

function renderizarRodape() {
  render(
    <MemoryRouter>
      <Rodape />
    </MemoryRouter>,
  )

  return within(
    screen.getByRole('navigation', { name: 'Links institucionais' }),
  )
}

describe('Footer', () => {
  it('"Sobre o portal" aponta para /sobre', () => {
    const rodape = renderizarRodape()

    expect(
      rodape.getByRole('link', { name: 'Sobre o portal' }),
    ).toHaveAttribute('href', '/sobre')
  })

  it('"Acessibilidade" aponta para /acessibilidade', () => {
    const rodape = renderizarRodape()

    expect(
      rodape.getByRole('link', { name: 'Acessibilidade' }),
    ).toHaveAttribute('href', '/acessibilidade')
  })

  it('nenhum link usa /* como destino', () => {
    const rodape = renderizarRodape()
    const links = rodape.getAllByRole('link')

    for (const link of links) {
      expect(link).not.toHaveAttribute('href', '/*')
    }
  })
})