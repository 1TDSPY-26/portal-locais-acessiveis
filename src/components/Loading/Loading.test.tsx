import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Loading } from './Loading'

describe('Loading', () => {
  it('renderiza o indicador de carregamento', () => {
    render(<Loading />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})