import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { obterLocalPorId, atualizarLocal } from '../services/locais'
import { Local } from '../types/Local'

export default function EditarLocal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    async function carregarLocal() {
      if (!id) return
      try {
        setCarregando(true)
        const dados = await obterLocalPorId(Number(id))
        if (dados && dados.nome) {
          setNome(dados.nome)
        }
      } catch (err) {
        setErro('Erro ao carregar os dados do local.')
      } finally {
        setCarregando(false)
      }
    }
    carregarLocal()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setErro('')
    setSucesso(false)

    try {
      await atualizarLocal(Number(id), { nome })
      setSucesso(true)
      setTimeout(() => {
        navigate('/locais')
      }, 1500)
    } catch (err) {
      setErro('Erro ao atualizar o local. Verifique os dados e tente novamente.')
    }
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