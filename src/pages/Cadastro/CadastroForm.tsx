import { useState, type FormEvent } from 'react'
import { RECURSOS_ACESSIBILIDADE } from '../../constants/acessibilidade'
import type { Local } from '../../types/Local'
import { primeiroCampoComErro, validarLocal, type ErrosLocal } from '../../utils/validarLocal'

type CampoTextoProps = {
  id: string
  rotulo: string
  valor: string
  erro?: string
  onChange: (valor: string) => void
}

const classeCampo =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700'

function CampoTexto({ id, rotulo, valor, erro, onChange }: CampoTextoProps) {
  const idErro = `erro-${id}`

  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {rotulo} <span className="text-sm text-gray-600">(obrigatório)</span>
      </label>
      <input
        id={id}
        type="text"
        value={valor}
        onChange={(evento) => onChange(evento.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={classeCampo}
      />
      {erro && <p id={idErro} className="mt-1 text-sm text-red-800">{erro}</p>}
    </div>
  )
}

const LOCAL_VAZIO: Local = {
  id: 0,
  nome: '',
  endereco: '',
  categoria: '',
  descricao: '',
  tiposAcessibilidade: [],
  notaAcessibilidade: 0,
}

type CadastroFormProps = {
  onSubmit: (dados: Local) => void
  enviando?: boolean
}

export default function CadastroForm({ onSubmit, enviando = false }: CadastroFormProps) {
  const [dados, setDados] = useState<Local>(LOCAL_VAZIO)
  const [erros, setErros] = useState<ErrosLocal>({})

  function alterarCampo(campo: keyof Local, valor: string | number | string[]) {
    setDados({ ...dados, [campo]: valor })
    setErros({ ...erros, [campo]: undefined })
  }

  function alternarRecurso(recurso: string) {
    const selecionados = dados.tiposAcessibilidade
    const novaLista = selecionados.includes(recurso)
      ? selecionados.filter((item) => item !== recurso)
      : [...selecionados, recurso]

    alterarCampo('tiposAcessibilidade', novaLista)
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const novosErros = validarLocal(dados)
    const campoComErro = primeiroCampoComErro(novosErros)

    setErros(novosErros)

    if (campoComErro) {
      document.getElementById(campoComErro)?.focus()
      return
    }

    onSubmit(dados)
  }

  return (
    <form noValidate onSubmit={enviar} className="space-y-6">
      <CampoTexto id="nome" rotulo="Nome do local" valor={dados.nome} erro={erros.nome} onChange={(valor) => alterarCampo('nome', valor)} />
      <CampoTexto id="endereco" rotulo="Endereço" valor={dados.endereco} erro={erros.endereco} onChange={(valor) => alterarCampo('endereco', valor)} />
      <CampoTexto id="categoria" rotulo="Categoria" valor={dados.categoria} erro={erros.categoria} onChange={(valor) => alterarCampo('categoria', valor)} />

      
        <div>
          <label htmlFor="descricao" className="block font-medium">Descrição</label>
          <textarea
            id="descricao"
            value={dados.descricao}
            onChange={(e) => alterarCampo('descricao', e.target.value)}
            aria-invalid={erros.descricao ? true : undefined}
            aria-describedby={erros.descricao ? 'erro-descricao' : undefined}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-400 px-3 py-2"
          />
          {erros.descricao && (
            <p id="erro-descricao" className="mt-1 text-sm text-red-800">{erros.descricao}</p>
          )}
        </div>
      

      <fieldset aria-describedby={erros.tiposAcessibilidade ? 'erro-tiposAcessibilidade' : undefined}>
        <legend className="font-medium">
          Recursos de acessibilidade <span className="text-sm text-gray-600">(marque pelo menos um)</span>
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {RECURSOS_ACESSIBILIDADE.map((recurso, indice) => (
            <label key={recurso} className="flex min-h-11 items-center gap-2">
              <input
                id={indice === 0 ? 'tiposAcessibilidade' : undefined}
                type="checkbox"
                checked={dados.tiposAcessibilidade.includes(recurso)}
                onChange={() => alternarRecurso(recurso)}
                className="h-5 w-5"
              />
              {recurso}
            </label>
          ))}
        </div>
        {erros.tiposAcessibilidade && (
          <p id="erro-tiposAcessibilidade" className="mt-1 text-sm text-red-800">{erros.tiposAcessibilidade}</p>
        )}
      </fieldset>

      
        <div>
          <label htmlFor="notaAcessibilidade" className="block font-medium">Nota de acessibilidade</label>
          <select
            id="notaAcessibilidade"
            value={dados.notaAcessibilidade}
            onChange={(e) => alterarCampo('notaAcessibilidade', Number(e.target.value))}
            aria-invalid={erros.notaAcessibilidade ? true : undefined}
            aria-describedby={erros.notaAcessibilidade ? 'erro-notaAcessibilidade' : undefined}
            className="mt-1 block min-h-11 w-full rounded-md border border-gray-400 px-3"
          >
            <option value={0}>Selecione</option>
            {[1, 2, 3, 4, 5].map((nota) => (
              <option key={nota} value={nota}>
                {nota}
              </option>
            ))}
          </select>
            {erros.notaAcessibilidade && (
              <p id="erro-notaAcessibilidade" className="mt-1 text-sm text-red-800">{erros.notaAcessibilidade}</p>
            )}
          </div>
      

      <button
        type="submit"
        disabled={enviando}
        className="inline-flex min-h-11 items-center rounded-md bg-blue-700 px-5 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60"
      >
        {enviando ? 'Cadastrando...' : 'Cadastrar local'}
      </button>
    </form>
  )
}