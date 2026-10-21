export default function Acessibilidade() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Acessibilidade do portal</h1>
      <p className="mt-4 leading-relaxed">
        Esta página descreve os recursos disponíveis na interface atual do portal.
      </p>

      <section aria-labelledby="teclado" className="mt-8">
        <h2 id="teclado" className="text-xl font-semibold">Navegação por teclado</h2>
        <p className="mt-2 leading-relaxed">
          Use Tab para avançar pelos links e botões, Shift+Tab para voltar e
          Enter para abrir um link. O contorno visível indica o elemento em foco.
        </p>
      </section>

      <section aria-labelledby="zoom" className="mt-8">
        <h2 id="zoom" className="text-xl font-semibold">Ampliação da página</h2>
        <p className="mt-2 leading-relaxed">
          Você pode ampliar a página com o controle de zoom do navegador.
          Em muitos navegadores, Ctrl e + aumenta o zoom; Ctrl e 0 restaura o tamanho.
        </p>
      </section>

      <section aria-labelledby="limites" className="mt-8">
        <h2 id="limites" className="text-xl font-semibold">Limitações conhecidas</h2>
        <p className="mt-2 leading-relaxed">
          Os recursos de acessibilidade dos locais são informados por quem os
          cadastra. Confirme os dados diretamente com o estabelecimento antes
          de uma visita. Ainda não há um canal oficial de contato sobre barreiras
          de acesso publicado no portal.
        </p>
      </section>
    </div>
  )
}
