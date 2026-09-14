
import { useEffect, useState } from 'react'
import type { Local } from '../../types/Local'
import LocalCard from '../../components/LocalCard/LocalCard'
import { Loading } from '../../components/Loading/Loading'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import Pagination from '../../components/Pagination/Pagination'

const LIMITE_POR_PAGINA = 6

const locaisMock: Local[] = [
  {
    id: 1,
    nome: 'Shopping Acessível',
    endereco: 'Av. Paulista, 1000',
    categoria: 'Shopping',
    tiposAcessibilidade: ['Rampa', 'Elevador'],
    descricao: 'Shopping com estrutura acessível.',
    notaAcessibilidade: 5,
  },
  {
    id: 2,
    nome: 'Biblioteca Central',
    endereco: 'Rua Augusta, 200',
    categoria: 'Biblioteca',
    tiposAcessibilidade: ['Piso tátil', 'Elevador'],
    descricao: 'Biblioteca com recursos de acessibilidade.',
    notaAcessibilidade: 4,
  },
  {
    id: 3,
    nome: 'Parque da Cidade',
    endereco: 'Rua das Flores, 300',
    categoria: 'Parque',
    tiposAcessibilidade: ['Rampa', 'Banheiros acessíveis'],
    descricao: 'Parque com espaços adaptados.',
    notaAcessibilidade: 4,
  },
  {
    id: 4,
    nome: 'Museu Municipal',
    endereco: 'Av. Central, 400',
    categoria: 'Museu',
    tiposAcessibilidade: ['Elevador', 'Audiodescrição'],
    descricao: 'Museu preparado para receber todos os públicos.',
    notaAcessibilidade: 5,
  },
  {
    id: 5,
    nome: 'Restaurante Sabor',
    endereco: 'Rua das Palmeiras, 500',
    categoria: 'Restaurante',
    tiposAcessibilidade: ['Rampa'],
    descricao: 'Restaurante com entrada acessível.',
    notaAcessibilidade: 4,
  },
  {
    id: 6,
    nome: 'Centro Cultural',
    endereco: 'Rua Central, 600',
    categoria: 'Cultura',
    tiposAcessibilidade: ['Rampa', 'Piso tátil'],
    descricao: 'Centro cultural acessível.',
    notaAcessibilidade: 5,
  },
  {
    id: 7,
    nome: 'Cinema Central',
    endereco: 'Av. Brasil, 700',
    categoria: 'Cinema',
    tiposAcessibilidade: ['Assentos acessíveis', 'Elevador'],
    descricao: 'Cinema com estrutura adaptada.',
    notaAcessibilidade: 4,
  },
  {
    id: 8,
    nome: 'Hospital Municipal',
    endereco: 'Rua da Saúde, 800',
    categoria: 'Saúde',
    tiposAcessibilidade: ['Rampa', 'Elevador'],
    descricao: 'Hospital com acessibilidade.',
    notaAcessibilidade: 5,
  },
  {
    id: 9,
    nome: 'Escola Estadual',
    endereco: 'Rua Educação, 900',
    categoria: 'Educação',
    tiposAcessibilidade: ['Rampa', 'Banheiro acessível'],
    descricao: 'Escola com adaptações de acessibilidade.',
    notaAcessibilidade: 4,
  },
  {
    id: 10,
    nome: 'Praça Central',
    endereco: 'Praça Central, 100',
    categoria: 'Lazer',
    tiposAcessibilidade: ['Piso tátil'],
    descricao: 'Praça com melhorias de acessibilidade.',
    notaAcessibilidade: 3,
  },
]

export default function Locais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    setIsLoading(true)
    setErrorMessage('')

    const inicio = (pagina - 1) * LIMITE_POR_PAGINA
    const fim = inicio + LIMITE_POR_PAGINA

    const locaisDaPagina = locaisMock.slice(inicio, fim)

    setLocais(locaisDaPagina)
    setIsLoading(false)
  }, [pagina])

  const temProximaPagina =
    pagina * LIMITE_POR_PAGINA < locaisMock.length

  const paginaAnterior = () => {
    setPagina((paginaAtual) => Math.max(1, paginaAtual - 1))
  }

  const proximaPagina = () => {
    if (temProximaPagina) {
      setPagina((paginaAtual) => paginaAtual + 1)
    }
  }

  const tentarNovamente = () => {
    setPagina(1)
  }

  return (
    <div className="mx-auto px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Locais acessíveis
      </h1>

      <section aria-labelledby="lista-locais" className="mt-8">
        <h2 id="lista-locais" className="sr-only">
          Lista de locais cadastrados
        </h2>

        {isLoading && <Loading />}

        {!isLoading && errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onRetry={tentarNovamente}
          />
        )}

        {!isLoading && !errorMessage && locais.length === 0 && (
          <EmptyState message="Nenhum local cadastrado até o momento." />
        )}

        {!isLoading && !errorMessage && locais.length > 0 && (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locais.map((local) => (
                <LocalCard key={local.id} local={local} />
              ))}
            </div>

            <Pagination
              paginaAtual={pagina}
              temProximaPagina={temProximaPagina}
              onPaginaAnterior={paginaAnterior}
              onProximaPagina={proximaPagina}
            />
          </>
        )}
      </section>
    </div>
  )
}

