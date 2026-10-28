import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../../components/Error/ErrorMessage'
import { Loading } from '../../components/Loading/Loading'
import { RECURSOS_ACESSIBILIDADE } from '../../constants/acessibilidade'
import type { Local } from '../../types/Local'
import { useTituloDocumento } from '../../hooks/useTituloDocumento'
import {
  atualizarLocal as updateLocation,
  obterLocalPorId as getLocationById,
} from '../../services/locais'
import {
  primeiroCampoComErro,
  validarLocal,
  type ErrosLocal,
} from '../../utils/validarLocal'

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

// Mesmo container do cadastro: as duas telas de formulário ficam iguais em qualquer largura.
const classeContainer = 'mx-auto max-w-2xl px-4 py-10 sm:px-6'

const classeCampo =
  'mt-1 block min-h-11 w-full rounded-md border border-gray-300 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700'

const MENSAGEM_CARREGANDO = 'Carregando dados do local...'

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
  useTituloDocumento('Editar local')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dados, setDados] = useState<NovoLocal>(LOCAL_VAZIO)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [carregado, setCarregado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  // NOVO: estado dos erros de validação
  const [erros, setErros] = useState<ErrosLocal>({})

  // NOVO: quantidade de campos com erro
  const quantidadeDeErros = Object.values(erros).filter(
    (mensagem) => Boolean(mensagem),
  ).length

  useEffect(() => {
    let ativo = true

    async function loadLocation() {
      // Inicia a sincronização assíncrona e ignora cargas de rotas anteriores.
      await Promise.resolve()
      if (!ativo) return

      setIsLoading(true)
      setNaoEncontrado(false)
      setCarregado(false)
      setIsSuccess(false)
      setErrorMessage('')
      setErros({})

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
        if (ativo) {
          setErrorMessage('Erro inesperado ao carregar os dados do local.')
        }
      } finally {
        if (ativo) setIsLoading(false)
      }
    }

    void loadLocation()

    return () => {
      ativo = false
    }
  }, [id])

  useEffect(() => {
    if (!isSuccess) return

    const temporizador = setTimeout(() => navigate('/locais'), 1500)
    return () => clearTimeout(temporizador)
  }, [isSuccess, navigate])

  // ALTERADO: limpa o erro do campo quando ele é modificado
  function alterarCampo(
    campo: keyof NovoLocal,
    valor: string | number | string[],
  ) {
    setDados((anteriores) => ({ ...anteriores, [campo]: valor }))

    setErros((anteriores) => ({
      ...anteriores,
      [campo]: undefined,
    }))
  }

  // NOVO: valida um campo quando o usuário sai dele
  function validarCampo(campo: keyof ErrosLocal) {
    const novosErros = validarLocal({
      id: Number(id),
      ...dados,
    })

    setErros((anteriores) => ({
      ...anteriores,
      [campo]: novosErros[campo],
    }))
  }

  const opcoesDeRecurso = [...new Set([
    ...RECURSOS_ACESSIBILIDADE,
    ...dados.tiposAcessibilidade,
  ])]

  function alternarRecurso(recurso: string) {
    const selecionados = dados.tiposAcessibilidade

    const novaLista = selecionados.includes(recurso)
      ? selecionados.filter((item) => item !== recurso)
      : [...selecionados, recurso]

    alterarCampo('tiposAcessibilidade', novaLista)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!id || !carregado || naoEncontrado || enviando || isSuccess) return

    // NOVO: valida todos os campos antes de chamar a API
    const novosErros = validarLocal({
      id: Number(id),
      ...dados,
    })

    setErros(novosErros)

    const campoComErro = primeiroCampoComErro(novosErros)

    if (campoComErro) {
      document.getElementById(campoComErro)?.focus()
      return
    }

    // Mantido: tratamento original da atualização pela API
    setErrorMessage('')
    setEnviando(true)

    try {
      const { error } = await updateLocation(
        Number(id),
        removerEspacosDasPontas(dados),
      )

      if (error?.status === 404) {
        setNaoEncontrado(true)
        return
      }

      if (error) {
        setErrorMessage(error.message)
        return
      }

      setIsSuccess(true)
    } catch {
      setErrorMessage('Erro inesperado ao atualizar o local.')
    } finally {
      setEnviando(false)
    }
  }

  if (isLoading) {
    return (
      <div className={classeContainer}>
        <Loading message={MENSAGEM_CARREGANDO} />
      </div>
    )
  }

  return (
    <div className={classeContainer}>
      <h1 className="text-3xl font-bold tracking-tight">Editar local</h1>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {isSuccess && (
        <p role="status" className="mt-4 text-green-800">
          Local atualizado com sucesso!
        </p>
      )}

      {naoEncontrado ? (
        <ErrorMessage message="Local não encontrado." />
      ) : carregado && (
        // ALTERADO: noValidate permite usar a validação personalizada
        <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* NOVO: resumo dos erros */}
          {quantidadeDeErros > 0 && (
            <p role="alert" className="font-semibold text-red-800">
              Atenção: corrija{' '}
              {quantidadeDeErros === 1
                ? 'o campo destacado (1 erro).'
                : `os ${quantidadeDeErros} campos destacados (${quantidadeDeErros} erros).`}
            </p>
          )}

          {(['nome', 'endereco', 'categoria'] as const).map((campo) => {
            const rotulos = {
              nome: 'Nome do local',
              endereco: 'Endereço',
              categoria: 'Categoria',
            }

            const erro = erros[campo]
            const idErro = `erro-${campo}`

            return (
              <div key={campo}>
                <label htmlFor={campo} className="block font-medium">
                  {rotulos[campo]}
                </label>

                <input
                  id={campo}
                  type="text"
                  value={dados[campo]}
                  onChange={(evento) =>
                    alterarCampo(campo, evento.target.value)
                  }
                  onBlur={() => validarCampo(campo)}
                  aria-invalid={erro ? true : undefined}
                  aria-describedby={erro ? idErro : undefined}
                  className={`${classeCampo} ${erro ? 'border-red-700' : ''}`}
                />

                {erro && (
                  <p id={idErro} className="mt-1 text-sm text-red-800">
                    {erro}
                  </p>
                )}
              </div>
            )
          })}

          <div>
            <label htmlFor="descricao" className="block font-medium">
              Descrição
            </label>

            <textarea
              id="descricao"
              rows={4}
              value={dados.descricao}
              onChange={(evento) =>
                alterarCampo('descricao', evento.target.value)
              }
              onBlur={() => validarCampo('descricao')}
              aria-invalid={erros.descricao ? true : undefined}
              aria-describedby={
                erros.descricao ? 'erro-descricao' : undefined
              }
              className={`${classeCampo} ${erros.descricao ? 'border-red-700' : ''}`}
            />

            {erros.descricao && (
              <p id="erro-descricao" className="mt-1 text-sm text-red-800">
                {erros.descricao}
              </p>
            )}
          </div>

          <fieldset
            aria-describedby={
              erros.tiposAcessibilidade
                ? 'erro-tiposAcessibilidade'
                : undefined
            }
          >
            <legend className="font-medium">
              Recursos de acessibilidade
            </legend>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {opcoesDeRecurso.map((recurso, indice) => (
                <label
                  key={recurso}
                  className="flex min-h-11 items-center gap-2"
                >
                  <input
                    id={indice === 0 ? 'tiposAcessibilidade' : undefined}
                    type="checkbox"
                    checked={dados.tiposAcessibilidade.includes(recurso)}
                    onChange={() => alternarRecurso(recurso)}
                    onBlur={() => validarCampo('tiposAcessibilidade')}
                    aria-invalid={
                      erros.tiposAcessibilidade ? true : undefined
                    }
                    aria-describedby={
                      erros.tiposAcessibilidade
                        ? 'erro-tiposAcessibilidade'
                        : undefined
                    }
                    className="h-5 w-5 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
                  />
                  {recurso}
                </label>
              ))}
            </div>

            {erros.tiposAcessibilidade && (
              <p
                id="erro-tiposAcessibilidade"
                className="mt-1 text-sm text-red-800"
              >
                {erros.tiposAcessibilidade}
              </p>
            )}
          </fieldset>

          <div>
            <label htmlFor="notaAcessibilidade" className="block font-medium">
              Nota de acessibilidade
            </label>

            <select
              id="notaAcessibilidade"
              value={dados.notaAcessibilidade ?? 0}
              onChange={(evento) =>
                alterarCampo(
                  'notaAcessibilidade',
                  Number(evento.target.value),
                )
              }
              onBlur={() => validarCampo('notaAcessibilidade')}
              aria-invalid={erros.notaAcessibilidade ? true : undefined}
              aria-describedby={
                erros.notaAcessibilidade
                  ? 'erro-notaAcessibilidade'
                  : undefined
              }
              className={`${classeCampo} ${erros.notaAcessibilidade ? 'border-red-700' : ''}`}
            >
              <option value={0}>Selecione</option>
              {[1, 2, 3, 4, 5].map((nota) => (
                <option key={nota} value={nota}>
                  {nota}
                </option>
              ))}
            </select>

            {erros.notaAcessibilidade && (
              <p
                id="erro-notaAcessibilidade"
                className="mt-1 text-sm text-red-800"
              >
                {erros.notaAcessibilidade}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={enviando || isSuccess}
            className="inline-flex min-h-11 items-center rounded-md bg-blue-700 px-5 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60"
          >
            {enviando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      )}
    </div>
  )
}