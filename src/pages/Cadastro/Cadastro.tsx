import { useState } from 'react'
import type { Local } from '../../types/Local'
import CadastroForm from './CadastroForm'

export default function Cadastro() {
  const [mensagem, setMensagem] = useState('')

  function confirmarFormularioValido(dados: Local) {
    setMensagem(`Formulário válido para "${dados.nome}".`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Cadastrar novo local</h1>
      {mensagem && <p role="status" className="mt-4 rounded-md border border-green-700 p-3">{mensagem}</p>}
      <div className="mt-8">
        <CadastroForm onSubmit={confirmarFormularioValido} />
      </div>
    </div>
  )
}