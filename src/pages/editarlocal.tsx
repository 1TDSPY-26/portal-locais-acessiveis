import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { atualizarLocal, obterLocalPorId } from '../services/locais'

export default function EditarLocal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

 cola isso no seu useEffect:

useEffect(() => {
  async function carregarLocal() {
    if (!id) {
      setErro('ID do local não informado.')
      setCarregando(false)
      return
    }

    try {
      setCarregando(true)
      setErro('')

      const { data, error } = await obterLocalPorId(Number(id))

      if (error) {
        setErro(error.message)
        return
      }

      if (!data) {
        setErro('Local não encontrado.')
        return
      }

      setNome(data.nome)
    } catch {
      setErro('Erro inesperado ao carregar os dados do local.')
    } finally {
      setCarregando(false)
    }
  }

  carregarLocal()
}, [id])

useEffect(() => {
  async function carregarLocal() {
    if (!id) {
      setErro('ID do local não informado.')
      setCarregando(false)
      return
    }

    try {
      setCarregando(true)
      setErro('')

      const { data, error } = await obterLocalPorId(Number(id))

      if (error) {
        setErro(error.message)
        return
      }

      if (!data) {
        setErro('Local não encontrado.')
        return
      }

      setNome(data.nome)
    } catch {
      setErro('Erro inesperado ao carregar os dados do local.')
    } finally {
      setCarregando(false)
    }
  }

  carregarLocal()
}, [id])
  }

  if (carregando) return <p>Carregando dados do local...</p>

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Editar Local</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>Local atualizado com sucesso!</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nome" style={{ display: 'block', marginBottom: '5px' }}>
            Nome do Local:
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
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