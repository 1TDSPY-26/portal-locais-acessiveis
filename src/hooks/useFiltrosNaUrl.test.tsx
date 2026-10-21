import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useFiltrosNaUrl } from './useFiltrosNaUrl'

function ComponenteDeTeste() {
  const filtros = useFiltrosNaUrl()
  const { search } = useLocation()

  return (
    <>
      <p>busca={filtros.busca}</p>
      <p>categoria={filtros.categoria}</p>
      <p>recursos={filtros.recursos.join('|')}</p>
      <p>url={search}</p>
      <button onClick={() => filtros.setBusca('')}>esvazia busca</button>
      <button onClick={() => filtros.setCategoria('Lazer')}>lazer</button>
      <button onClick={filtros.limpar}>limpar</button>
    </>
  )
}

function abrirEm(url: string) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <ComponenteDeTeste />
    </MemoryRouter>,
  )
}

describe('useFiltrosNaUrl', () => {
  it('lê os filtros da URL', () => {
    abrirEm('/locais?categoria=Cultura&recurso=Rampa&recurso=Libras')

    expect(screen.getByText('categoria=Cultura')).toBeInTheDocument()
    expect(screen.getByText('recursos=Rampa|Libras')).toBeInTheDocument()
  })

  it('escreve na URL sem apagar os outros parâmetros', async () => {
    abrirEm('/locais?busca=bib')

    await userEvent.click(screen.getByText('lazer'))

    expect(screen.getByText('url=?busca=bib&categoria=Lazer')).toBeInTheDocument()
  })

  it('limpar remove todos os parâmetros', async () => {
    abrirEm('/locais?busca=x&categoria=Cultura')

    await userEvent.click(screen.getByText('limpar'))

    expect(screen.getByText('url=')).toBeInTheDocument()
  })

  it('remove parâmetros vazios', async () => {
    abrirEm('/locais?busca=bib')

    await userEvent.click(screen.getByText('esvazia busca'))

    expect(screen.getByText('url=')).toBeInTheDocument()
    expect(screen.getByText('busca=')).toBeInTheDocument()
  })
})
