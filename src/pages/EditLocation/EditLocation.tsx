import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  atualizarLocal as updateLocation,
  obterLocalPorId as getLocationById,
} from '../../services/locais'
import CadastroForm from '../Cadastro/CadastroForm'
import type { Local } from '../../types/Local'

export default function EditLocation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [local, setLocal] = useState<Local | null>(null)
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

        setLocal(data)
      } catch {
        setErrorMessage('Erro inesperado ao carregar os dados do local.')
      } finally {
        setIsLoading(false)
      }
    }

    loadLocation()
  }, [id])

  async function handleSubmit(dados: Local) {
    if (!id) {
      setErrorMessage('ID do local não informado.')
      return
    }

    setErrorMessage('')
    setIsSuccess(false)

    try {
      const { error } = await updateLocation(Number(id), dados)

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

      {local && <CadastroForm valoresIniciais={local} onSubmit={handleSubmit} />}
    </div>
  )
}