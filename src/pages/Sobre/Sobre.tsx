import { Link } from 'react-router-dom'

// Mesmo padrão de botão da Home, para as chamadas de ação terem o mesmo peso
// visual em todo o portal.
const classeBotao =
  'inline-flex min-h-12 items-center justify-center rounded-md bg-blue-700 px-6 py-3 text-base font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700'

export default function Sobre() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Sobre o projeto
      </h1>

      <p className="mt-4 text-base leading-relaxed sm:text-lg">
        O Portal de Locais e Serviços Acessíveis é um projeto comunitário que
        reúne informações sobre os recursos de acessibilidade de locais e
        serviços, para que cada pessoa possa planejar melhor suas saídas.
      </p>

      <div
        role="note"
        aria-label="Aviso importante"
        className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm font-medium text-amber-900"
      >
        <p>
          <strong>Aviso importante:</strong> as informações deste portal são
          colaborativas, cadastradas e avaliadas pela comunidade. Elas não
          constituem certificação oficial de acessibilidade. Antes de visitar
          um local, recomendamos confirmar os recursos disponíveis diretamente
          com o estabelecimento.
        </p>
      </div>

      <section aria-labelledby="sobre-objetivo" className="mt-8">
        <h2 id="sobre-objetivo" className="text-xl font-semibold sm:text-2xl">
          Objetivo
        </h2>

        <p className="mt-3 text-base leading-relaxed sm:text-lg">
          Facilitar a busca por locais e serviços que oferecem recursos de
          acessibilidade, como rampa, banheiro adaptado ou atendimento em
          Libras, reunindo essas informações em um só lugar e mantendo-as
          atualizadas com a ajuda de quem visita esses locais.
        </p>
      </section>

      <section aria-labelledby="sobre-problema" className="mt-8">
        <h2 id="sobre-problema" className="text-xl font-semibold sm:text-2xl">
          O problema
        </h2>

        <p className="mt-3 text-base leading-relaxed sm:text-lg">
          Para muitas pessoas com deficiência ou mobilidade reduzida, sair de
          casa exige planejamento. Informações sobre acessibilidade costumam
          estar espalhadas, incompletas ou simplesmente não existem, e muitas
          vezes a única forma de descobrir se um local é acessível é ligar para
          cada estabelecimento ou chegar lá e conferir.
        </p>
      </section>

      <section aria-labelledby="sobre-principios" className="mt-8">
        <h2 id="sobre-principios" className="text-xl font-semibold sm:text-2xl">
          Nossos princípios
        </h2>

        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed sm:text-lg">
          <li>
            <strong>Informação clara:</strong> dados objetivos sobre cada
            local, como endereço, categoria e recursos de acessibilidade.
          </li>
          <li>
            <strong>Colaboração:</strong> o portal prevê contribuições da
            comunidade para ampliar as informações sobre os locais.
          </li>
          <li>
            <strong>Acessibilidade em primeiro lugar:</strong> o portal busca
            oferecer navegação por teclado e informações claras.
          </li>
          <li>
            <strong>Transparência sobre os limites dos dados:</strong> as
            informações refletem a experiência de quem contribuiu e podem estar
            desatualizadas ou incompletas.
          </li>
        </ul>
      </section>

      <section aria-labelledby="sobre-participar" className="mt-10">
        <h2 id="sobre-participar" className="text-xl font-semibold sm:text-2xl">
          Participe
        </h2>

        <p className="mt-3 text-base leading-relaxed sm:text-lg">
          Consulte os locais já cadastrados ou contribua com um local que você
          conhece.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/locais" className={classeBotao}>
            Ver locais acessíveis
          </Link>

          <Link to="/cadastrar" className={classeBotao}>
            Cadastrar um local
          </Link>
        </div>
      </section>
    </div>
  )
}

