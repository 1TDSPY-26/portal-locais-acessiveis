import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import SkipLink from './SkipLink'

function PaginaDeTeste() {
  return (
    <>
      <SkipLink />
      <a href="/outro">Outro link</a>
      <main id="conteudo-principal" tabIndex={-1}>
        Conteúdo
      </main>
    </>
  )
}

describe('SkipLink', () => {
  it('é o primeiro elemento a receber foco com Tab', async () => {
    render(<PaginaDeTeste />)

    await userEvent.tab()

    expect(
      screen.getByRole('link', { name: 'Ir para o conteúdo' }),
    ).toHaveFocus()
  })

  it('tem o href que aponta para o conteúdo principal', () => {
    render(<PaginaDeTeste />)

    expect(
      screen.getByRole('link', { name: 'Ir para o conteúdo' }),
    ).toHaveAttribute('href', '#conteudo-principal')
  })

  it('leva o foco para o conteúdo principal ao ser ativado', async () => {
    const user = userEvent.setup()
    render(<PaginaDeTeste />)

    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('main')).toHaveFocus()
  })
})