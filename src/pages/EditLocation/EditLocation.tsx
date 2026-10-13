import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { RECURSOS_ACESSIBILIDADE } from '../../constants/acessibilidade'
import type { Local } from '../../types/Local'
import {
  atualizarLocal as updateLocation,
  obterLocalPorId as getLocationById,
} from '../../services/locais'

// Temporário até a #120 exportar NovoLocal: importar o tipo de ../../types/Local.
type NovoLocal = Omit<Local, 'id'>

const LOCAL_VAZIO: NovoLocal = {
  nome: '',
  endereco: '',
  categoria: '',
  descricao: '',
  tiposAcessibilidade: [],
  notaAcessibilidade: 1,
}

const classeCampo =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700'

function separarDadosEditaveis(local: Local): NovoLocal {
  return {
    nome: local.nome,
    endereco: local.endereco,
    categoria: local.categoria,
    descricao: local.descricao,
    tiposAcessibilidade: [...local.tiposAcessibilidade],
    notaAcessibilidade: local.notaAcessibilidade,
  }
}

function removerEspacosDasPontas(dados: NovoLocal): NovoLocal {
  return {
    ...dados,
    nome: dados.nome.trim(),
    endereco: dados.endereco.trim(),
    categoria: dados.categoria.trim(),
    descricao: dados.descricao.trim(),
  }
}

export default function EditLocation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dados, setDados] = useState<NovoLocal>(LOCAL_VAZIO)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [carregado, setCarregado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const erroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ativo = true
    async function loadLocation() {
      // Inicia a sincronização assíncrona e ignora cargas de rotas anteriores.
      await Promise.resolve()
      if (!ativo) return
      setIsLoading(true)
      setNaoEncontrado(false)
      setCarregado(false)
      setErrorMessage('')
      try {
        if (!id) {
          setErrorMessage('ID do local não informado.')
          return
        }
        const { data, error } = await getLocationById(Number(id))
        if (!ativo) return
        if (error?.status === 404) {
          setNaoEncontrado(true)
          return
        }
        if (error) {
          setErrorMessage(error.message)
          return
        }
        if (!data) {
          setNaoEncontrado(true)
          return
        }
        setDados(separarDadosEditaveis(data))
        setCarregado(true)
      } catch {
        if (ativo) setErrorMessage('Erro inesperado ao carregar os dados do local.')
      } finally {
        if (ativo) setIsLoading(false)
      }
    }
    void loadLocation()
    return () => { ativo = false }
  }, [id])

  // Leva o foco para a mensagem de erro assim que ela aparece (carga ou envio).
  useEffect(() => {
    if (errorMessage && !isLoading) erroRef.current?.focus()
  }, [errorMessage, isLoading])

  function alterarCampo(campo: keyof NovoLocal, valor: string | number | string[]) {
    setDados((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  const opcoesDeRecurso = [...new Set([
    ...RECURSOS_ACESSIBILIDADE,
    ...dados.tiposAcessibilidade,
  ])]

  function alternarRecurso(recurso: string) {
    setDados((anteriores) => ({
      ...anteriores,
      tiposAcessibilidade: anteriores.tiposAcessibilidade.includes(recurso)
        ? anteriores.tiposAcessibilidade.filter((item) => item !== recurso)
        : [...anteriores.tiposAcessibilidade, recurso],
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!id || !carregado || naoEncontrado || enviando) return
    setErrorMessage('')
    setEnviando(true)
    try {
      const { error } = await updateLocation(Number(id), removerEspacosDasPontas(dados))
      if (error?.status === 404) {
        setNaoEncontrado(true)
        return
      }
      if (error) {
        setErrorMessage(error.message)
        return
      }
      // A confirmação é mostrada (e focada) na página de detalhe.
      navigate(`/locais/${id}`, {
        state: { mensagem: 'Alterações salvas com sucesso.' },
      })
    } catch {
      setErrorMessage('Erro inesperado ao atualizar o local.')
    } finally {
      setEnviando(false)
    }
  }

  if (isLoading) return <p>Carregando dados do local...</p>

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Editar Local</h2>
      {errorMessage && (
        <div
          ref={erroRef}
          tabIndex={-1}
          className="focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-700"
        >
          <ErrorMessage message={errorMessage} />
        </div>
      )}
      {naoEncontrado ? (
        <ErrorMessage message="Local não encontrado." />
      ) : carregado && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {(['nome', 'endereco', 'categoria'] as const).map((campo) => (
            <div key={campo}>
              <label htmlFor={campo} className="block font-medium">
                {{ nome: 'Nome do local', endereco: 'Endereço', categoria: 'Categoria' }[campo]}
              </label>
              <input id={campo} type="text" value={dados[campo]}
                onChange={(evento) => alterarCampo(campo, evento.target.value)}
                className={classeCampo} required />
            </div>
          ))}
          <div>
            <label htmlFor="descricao" className="block font-medium">Descrição</label>
            <textarea id="descricao" rows={4} value={dados.descricao}
              onChange={(evento) => alterarCampo('descricao', evento.target.value)}
              className={classeCampo} />
          </div>
          <fieldset>
            <legend className="font-medium">Recursos de acessibilidade</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {opcoesDeRecurso.map((recurso, indice) => (
                <label key={recurso} className="flex min-h-11 items-center gap-2">
                  <input id={indice === 0 ? 'tiposAcessibilidade' : undefined}
                    type="checkbox" checked={dados.tiposAcessibilidade.includes(recurso)}
                    onChange={() => alternarRecurso(recurso)}
                    className="h-5 w-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700" />
                  {recurso}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="notaAcessibilidade" className="block font-medium">Nota de acessibilidade</label>
            <select id="notaAcessibilidade" value={dados.notaAcessibilidade}
              onChange={(evento) => alterarCampo('notaAcessibilidade', Number(evento.target.value))}
              className={classeCampo}>
              {[1, 2, 3, 4, 5].map((nota) => <option key={nota} value={nota}>{nota}</option>)}
            </select>
          </div>
          <button type="submit" disabled={enviando}
            className="inline-flex min-h-11 items-center rounded-md bg-blue-700 px-5 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60">
            {enviando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      )}
    </div>
  )
}
