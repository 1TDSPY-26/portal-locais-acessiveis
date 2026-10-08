import { useState } from 'react'
import { criarLocal } from '../../services/locais'
import type { Local } from '../../types/Local'
import CadastroForm from './CadastroForm'

type NovoLocal = Omit<Local, 'id'>

function removerEspacosDasPontas(dados: NovoLocal): NovoLocal {
  return {
    nome: dados.nome.trim(),
    endereco: dados.endereco.trim(),
    categoria: dados.categoria.trim(),
    descricao: dados.descricao.trim(),
    tiposAcessibilidade: [...dados.tiposAcessibilidade],
    notaAcessibilidade: dados.notaAcessibilidade,
  }
}

export default function Cadastro() {
  const [enviando, setEnviando] = useState(false)
  const [, setErrorMessage] = useState('')
  const [, setLocalCriado] = useState<Local | null>(null)
  const [versaoFormulario, setVersaoFormulario] = useState(0)

  async function cadastrar(dados: NovoLocal) {
    if (enviando) return

    setEnviando(true)
    setErrorMessage('')
    setLocalCriado(null)

    try {
      const { data, error } = await criarLocal(
        removerEspacosDasPontas(dados),
      )

      if (error) {
        setErrorMessage(
          `Não foi possível cadastrar o local. ${error.message}`,
        )
      } else {
        setLocalCriado(data ?? null)
        setVersaoFormulario((versao) => versao + 1)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Cadastrar novo local
      </h1>

      <div className="mt-8">
        <CadastroForm
          key={versaoFormulario}
          onSubmit={cadastrar}
          enviando={enviando}
        />
      </div>
    </div>
  )
}