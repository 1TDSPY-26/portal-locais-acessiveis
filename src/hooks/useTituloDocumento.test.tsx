
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NOME_DO_SITE, useTituloDocumento } from './useTituloDocumento'

function PaginaDeTeste({ titulo }: { titulo: string }) {
  useTituloDocumento(titulo)
  return null
}

describe('useTituloDocumento', () => {
  it('define o título no formato "Página | Site"', () => {
    render(<PaginaDeTeste titulo="Sobre o projeto" />)

    expect(document.title).toBe(`Sobre o projeto | ${NOME_DO_SITE}`)
  })

  it('atualiza quando o título muda', () => {
    const { rerender } = render(
      <PaginaDeTeste titulo="Carregando local" />,
    )

    rerender(<PaginaDeTeste titulo="Biblioteca Central" />)

    expect(document.title).toBe(`Biblioteca Central | ${NOME_DO_SITE}`)
  })

  it('restaura o título anterior quando a página sai', () => {
    document.title = 'Anterior'

    const { unmount } = render(<PaginaDeTeste titulo="Temporário" />)

    unmount()

    expect(document.title).toBe('Anterior')
  })
})
