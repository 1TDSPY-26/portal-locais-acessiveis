import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  atualizarLocal as updateLocation,
  obterLocalPorId as getLocationById,
} from '../../services/locais'

export default function EditLocation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    async function loadLocation() {
      if (!id) {
        setErrorMessage('ID do local não informado.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage('')

        const { data, error } = await getLocationById(Number(id))

        if (error) {
          setErrorMessage(error.message)
          return
        }

        if (!data) {
          setErrorMessage('Local não encontrado.')
          return
        }

        setName(data.nome)
      } catch {
        setErrorMessage('Erro inesperado ao carregar os dados do local.')
      } finally {
        setIsLoading(false)
      }
    }

    loadLocation()
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!id) {
      setErrorMessage('ID do local não informado.')
      return
    }

    setErrorMessage('')
    setIsSuccess(false)

    try {
      const { error } = await updateLocation(Number(id), {
        nome: name,
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      setIsSuccess(true)

      setTimeout(() => {
        navigate('/locais')
      }, 1500)
    } catch {
      setErrorMessage('Erro inesperado ao atualizar o local.')
    }
  }

  if (isLoading) {
    return <p>Carregando dados do local...</p>
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1>Editar Local</h1>

      {errorMessage && (
        <p className="rounded-md border border-red-300 p-3 text-red-800">
          Erro: {errorMessage}
        </p>
      )}

      {isSuccess && (
        <p className="rounded-md border border-green-300 p-3 text-green-900">
          Sucesso: Local atualizado com sucesso!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div >
          <label
            htmlFor="name"
            className='mb-1 block'
          >
            Nome do Local:
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className='w-full px-3 py-2 text-base'
   
            required
          />
        </div>

        <button
          type="submit"
          className='min-h-11 bg-blue-700 text-white rounded-md px-4 py-2 cursor-pointer focus-visible:outline-blue-700'
          >
          Salvar Alterações
        </button>
      </form>
    </div>
  )
}
