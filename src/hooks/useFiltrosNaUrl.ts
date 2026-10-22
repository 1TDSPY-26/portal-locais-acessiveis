import { useSearchParams } from 'react-router-dom'

export function useFiltrosNaUrl() {
  const [params, setParams] = useSearchParams()

  const busca = params.get('busca') ?? ''
  const categoria = params.get('categoria') ?? ''
  const recursos = params.getAll('recurso')

  function gravar(alteracao: (novosParams: URLSearchParams) => void) {
    setParams(
      (atuais) => {
        const novosParams = new URLSearchParams(atuais)
        alteracao(novosParams)
        return novosParams
      },
      { replace: true },
    )
  }

  function definirParametro(nome: string, valor: string) {
    gravar((novosParams) => {
      if (valor) novosParams.set(nome, valor)
      else novosParams.delete(nome)
    })
  }

  function setBusca(valor: string) {
    definirParametro('busca', valor)
  }

  function setCategoria(valor: string) {
    definirParametro('categoria', valor)
  }

  function setRecursos(lista: string[]) {
    gravar((novosParams) => {
      novosParams.delete('recurso')
      lista.forEach((recurso) => novosParams.append('recurso', recurso))
    })
  }

  function limpar() {
    gravar((novosParams) => {
      novosParams.delete('busca')
      novosParams.delete('categoria')
      novosParams.delete('recurso')
    })
  }

  return { busca, categoria, recursos, setBusca, setCategoria, setRecursos, limpar }
}
