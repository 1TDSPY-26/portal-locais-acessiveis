import { useState, type FormEvent } from 'react'
import { criarLocal } from '../../services/locais'

type CampoTexto = 'nome' | 'endereco' | 'categoria' | 'descricao'
type Campo = CampoTexto | 'tiposAcessibilidade'
type Dados = Record<CampoTexto, string> & { tiposAcessibilidade: string[] }
type Erros = Partial<Record<Campo, string>>

const inicial: Dados = {
  nome: '', endereco: '', categoria: '', descricao: '', tiposAcessibilidade: [],
}
const recursos = [
  { value: 'Cadeira de rodas', label: 'Acesso para cadeira de rodas' },
  { value: 'Deficiência visual', label: 'Acessibilidade para deficiência visual' },
  { value: 'Deficiência auditiva', label: 'Acessibilidade para deficiência auditiva' },
]
const campos: { id: CampoTexto; label: string }[] = [
  { id: 'nome', label: 'Nome do local' },
  { id: 'endereco', label: 'Endereço' },
  { id: 'categoria', label: 'Categoria' },
  { id: 'descricao', label: 'Descrição' },
]

function validar(dados: Dados): Erros {
  const erros: Erros = {}
  for (const { id, label } of campos) {
    if (!dados[id].trim()) erros[id] = `${label} é obrigatório.`
  }
  if (dados.tiposAcessibilidade.length === 0) {
    erros.tiposAcessibilidade = 'Selecione pelo menos um tipo de acessibilidade.'
  }
  return erros
}

export default function Cadastro() {
  const [dados, setDados] = useState<Dados>(inicial)
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [falha, setFalha] = useState(false)

  function alterarTexto(campo: CampoTexto, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
    setErros((atual) => ({ ...atual, [campo]: undefined }))
  }

  function alternarRecurso(recurso: string, marcado: boolean) {
    setDados((atual) => ({
      ...atual,
      tiposAcessibilidade: marcado
        ? [...atual.tiposAcessibilidade, recurso]
        : atual.tiposAcessibilidade.filter((item) => item !== recurso),
    }))
    setErros((atual) => ({ ...atual, tiposAcessibilidade: undefined }))
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (enviando) return
    const novosErros = validar(dados)
    setErros(novosErros)
    setMensagem('')
    const primeiroErro = (Object.keys(novosErros) as Campo[])[0]
    if (primeiroErro) {
      document.getElementById(primeiroErro)?.focus()
      return
    }

    setEnviando(true)
    try {
      const resultado = await criarLocal({
        ...dados,
        nome: dados.nome.trim(),
        endereco: dados.endereco.trim(),
        categoria: dados.categoria.trim(),
        descricao: dados.descricao.trim(),
      })
      if (resultado.error) {
        setFalha(true)
        setMensagem(resultado.error.message)
        return
      }
      setDados(inicial)
      setFalha(false)
      setMensagem('Local cadastrado com sucesso!')
    } catch {
      setFalha(true)
      setMensagem('Não foi possível cadastrar o local. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Cadastrar novo local</h1>
      <p>Todos os campos são obrigatórios.</p>
      {mensagem && <p role={falha ? 'alert' : 'status'}>{mensagem}</p>}
      <form noValidate onSubmit={enviar} className="space-y-5">
        {campos.map(({ id, label }) => (
          <div key={id}>
            <label htmlFor={id} className="block font-medium">{label} (obrigatório)</label>
            {id === 'descricao' ? (
              <textarea
                id={id} value={dados[id]}
                onChange={(event) => alterarTexto(id, event.target.value)}
                aria-required="true" aria-invalid={Boolean(erros[id])}
                aria-describedby={erros[id] ? `erro-${id}` : undefined}
                className="mt-1 block w-full rounded border p-2 focus-visible:outline focus-visible:outline-2"
              />
            ) : (
              <input
                id={id} type="text" value={dados[id]}
                onChange={(event) => alterarTexto(id, event.target.value)}
                aria-required="true" aria-invalid={Boolean(erros[id])}
                aria-describedby={erros[id] ? `erro-${id}` : undefined}
                className="mt-1 block w-full rounded border p-2 focus-visible:outline focus-visible:outline-2"
              />
            )}
            {erros[id] && <p id={`erro-${id}`} className="mt-1 text-sm">{erros[id]}</p>}
          </div>
        ))}

        <fieldset>
          <legend className="font-medium">Tipos de acessibilidade (selecione pelo menos um)</legend>
          {recursos.map(({ value, label }, index) => (
            <label key={value} className="mt-2 flex items-center gap-2">
              <input
                id={index === 0 ? 'tiposAcessibilidade' : undefined}
                type="checkbox" value={value}
                checked={dados.tiposAcessibilidade.includes(value)}
                onChange={(event) => alternarRecurso(value, event.target.checked)}
                aria-describedby={erros.tiposAcessibilidade ? 'erro-tiposAcessibilidade' : undefined}
                className="h-5 w-5 focus-visible:outline focus-visible:outline-2"
              />
              {label}
            </label>
          ))}
          {erros.tiposAcessibilidade && (
            <p id="erro-tiposAcessibilidade" className="mt-1 text-sm">{erros.tiposAcessibilidade}</p>
          )}
        </fieldset>
        <button type="submit" disabled={enviando} className="min-h-11 rounded bg-blue-700 px-5 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">
          {enviando ? 'Cadastrando...' : 'Cadastrar local'}
        </button>
      </form>
    </div>
  )
}
