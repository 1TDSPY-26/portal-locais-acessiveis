import type { MouseEvent } from 'react'

type SkipLinkProps = {
  /** id do elemento que recebe o foco (sem o "#"). */
  targetId?: string
}

export default function SkipLink({
  targetId = 'conteudo-principal',
}: SkipLinkProps) {
  // O <a href="#..."> é um link comum (não é <Link>), então o React Router não
  // o intercepta. Movemos o foco explicitamente para o alvo porque nem todos os
  // navegadores levam o foco ao destino de um link âncora; o href continua como
  // fallback caso o alvo não exista.
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId)
    if (!target) return

    event.preventDefault()
    target.focus()
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
    >
      Ir para o conteúdo
    </a>
  )
}
