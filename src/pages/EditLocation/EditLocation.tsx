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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Editar Local</h2>

      {errorMessage && (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}

      {isSuccess && (
        <p style={{ color: 'green' }}>
          Local atualizado com sucesso!
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="name"
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Nome do Local:
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  )
}
