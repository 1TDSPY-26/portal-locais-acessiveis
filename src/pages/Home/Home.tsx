import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="mx-auto px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Portal de Locais e Serviços Acessíveis
      </h1>

      <section aria-labelledby="apresentacao" className="mt-8">
        <h2 id="apresentacao" className="text-xl font-semibold sm:text-2xl">
          O que é o portal
        </h2>

        <p className="mt-3 text-base leading-relaxed sm:text-lg">
          Este portal reúne, em um só lugar, locais e serviços que oferecem
          recursos de acessibilidade. A proposta é simples: sair de casa sem
          precisar ligar para cada estabelecimento para descobrir se ele tem
          rampa, banheiro adaptado ou atendimento em Libras.
        </p>

        <p className="mt-3 text-base leading-relaxed sm:text-lg">
          As informações são mantidas pela própria comunidade, quem visita
          também pode cadastrar um local e avaliar o quanto ele é acessível.
        </p>
      </section>

      <section aria-labelledby="o-que-encontrar" className="mt-8">
        <h2 id="o-que-encontrar" className="text-xl font-semibold sm:text-2xl">
          O que você encontra aqui
        </h2>

        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed sm:text-lg">
          <li>Locais organizados por categoria e por tipo de acessibilidade.</li>
          <li>Endereço, descrição e nota de acessibilidade de cada local.</li>
          <li>Cadastro e atualização de locais pela comunidade.</li>
        </ul>
      </section>

      <section aria-labelledby="comecar" className="mt-10">
        <h2 id="comecar" className="sr-only">
          Começar a explorar
        </h2>

        <Link
          to="/locais"
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-6 py-3 text-base font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Ver locais acessíveis
        </Link>
      </section>
    </div>
  )
}
