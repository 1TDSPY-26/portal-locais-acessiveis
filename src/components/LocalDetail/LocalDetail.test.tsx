import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import LocalDetail from './LocalDetail'
import type { Local } from '../../types/Local'

const base: Local = {
  id: 1,
  nome: 'Biblioteca Central',
  endereco: 'Rua A, 10',
  categoria: 'Cultura',
  tiposAcessibilidade: ['Rampa'],
  descricao: 'Espaço de leitura',
  notaAcessibilidade: 4,
}

describe('LocalDetail', () => {
  it('mostra a nota quando o local foi avaliado', () => {
    render(<LocalDetail local={base} />)
    expect(screen.getByText('4 de 5')).toBeInTheDocument()
  })

  it('mostra mensagem clara quando o local não tem avaliação', () => {
    render(<LocalDetail local={{ ...base, notaAcessibilidade: null }} />)
    expect(
      screen.getByText('Este local ainda não foi avaliado quanto à acessibilidade.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})