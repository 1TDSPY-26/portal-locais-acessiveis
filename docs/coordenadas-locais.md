# Coordenadas verificadas dos locais

Este documento registra de onde vêm as coordenadas do catálogo
[`src/data/coordenadasLocais.ts`](../src/data/coordenadasLocais.ts) e como
conferir cada uma. Quem lê o catálogo é a função `obterCoordenadasDoLocal`, em
[`src/services/coordenadasLocais.ts`](../src/services/coordenadasLocais.ts).

## Por que existe um catálogo

O tipo `Local` e a API não trazem latitude nem longitude. Para calcular a
distância até um local, o portal precisa desses dois números. O catálogo é uma
lista fixa no código, com as coordenadas de cada local real e o link da fonte
pública de onde elas vieram.

O portal não consulta o mapa pela internet: ele só lê o catálogo.

Cada registro é ligado ao `id` **e** ao endereço do local. Se a API devolver o
mesmo `id` com outro endereço, a função devolve `null` e a tela fica sem a
distância. Isso evita mostrar a distância de um lugar errado.

## Locais conferidos

Conferência feita em 17/10/2026 (`dataVerificacao: '2026-10-17'`), no
OpenStreetMap. O endereço é exatamente o que a API devolve em `GET /locais`.

| id | Nome | Endereço (igual ao da API) | Latitude | Longitude | Fonte |
|---|---|---|---|---|---|
| 1 | Biblioteca Mário de Andrade | Rua da Consolação, 94 - São Paulo | -23.5473897 | -46.6421048 | [way/48661210](https://www.openstreetmap.org/way/48661210) |
| 2 | Parque Ibirapuera | Av. Pedro Álvares Cabral - São Paulo | -23.5877126 | -46.6585214 | [way/125450993](https://www.openstreetmap.org/way/125450993) |
| 3 | Museu da Língua Portuguesa | Praça da Luz - São Paulo | -23.5349655 | -46.6350987 | [way/191591082](https://www.openstreetmap.org/way/191591082) |
| 4 | Centro Cultural São Paulo | Rua Vergueiro, 1000 - São Paulo | -23.5715436 | -46.6400111 | [node/4599903700](https://www.openstreetmap.org/node/4599903700) |
| 5 | Praça da Liberdade | Praça da Liberdade - São Paulo | -23.554974 | -46.6354952 | [way/237212801](https://www.openstreetmap.org/way/237212801) |

Os 5 locais foram conferidos. Nenhum ficou de fora.

Observações:

- **ids 1 e 4**: o próprio OpenStreetMap mostra o mesmo número do endereço
  ("94, Rua da Consolação" e "1000, Rua Vergueiro").
- **ids 2, 3 e 5**: o endereço da API não tem número. Por isso, a coordenada é
  o ponto do próprio lugar no mapa (o parque, o museu e a praça), e não um ponto
  da rua.
- **id 3**: o museu fica no prédio da Estação da Luz. O OpenStreetMap mostra o
  museu na Praça da Luz.
- **id 5**: no OpenStreetMap, a praça aparece com o nome "Praça da
  Liberdade-Japão". O mesmo registro guarda "Praça da Liberdade" como nome
  antigo (`old_name`) e aponta para o artigo "Praça da Liberdade (São Paulo)" da
  Wikipédia, então é o mesmo lugar.
- Quando a fonte é um `way` (uma área desenhada no mapa, como um parque), a
  coordenada é o ponto central que o OpenStreetMap calcula para a área. Quando é
  um `node`, é o próprio ponto marcado no mapa.

Os dados do mapa são © colaboradores do OpenStreetMap, com a licença
[ODbL](https://www.openstreetmap.org/copyright).

## Passo a passo da conferência

1. Liste os locais da API com `GET /locais` (a URL-base é o `VITE_API_URL` que
   os Tech Leads passam). Anote o `id` e o `endereco` de cada local, sem mudar
   nada no texto.
2. Abra a busca do OpenStreetMap em
   <https://nominatim.openstreetmap.org/ui/search.html> e procure pelo nome do
   local seguido de "São Paulo" (exemplo: `Parque Ibirapuera, São Paulo`).
3. Confira se o resultado é o lugar certo: o nome, o tipo (biblioteca, parque,
   museu, centro cultural, praça) e, quando o endereço tem número, o mesmo
   número da API.
4. Anote a latitude e a longitude do resultado, sem arredondar.
5. Abra o link do lugar no OpenStreetMap
   (`https://www.openstreetmap.org/<tipo>/<número>`, por exemplo
   `https://www.openstreetmap.org/way/125450993`) e confira se o mapa mostra o
   lugar certo. Esse link vai no campo `fonte`.
6. Cadastre o registro em `src/data/coordenadasLocais.ts` com `idLocal`,
   `enderecoVerificado` (igual ao da API), `latitude`, `longitude`, `fonte` e
   `dataVerificacao` no formato `AAAA-MM-DD`.
7. Atualize a tabela "Locais conferidos" deste documento com os mesmos valores.

Se um local não for encontrado, ou se o resultado não bater com o endereço da
API, **não invente coordenadas**: deixe o local fora do catálogo e explique
aqui qual é e por quê.

## Quando conferir de novo

- A API mudou o endereço de um local: a função passa a devolver `null` para
  ele. Confira o novo endereço e atualize o registro e a data.
- A API ganhou um local novo: ele fica sem distância até ser conferido e
  cadastrado.
```

O que cada parte faz:

- "Locais conferidos" é a tabela que o critério de aceite pede: `id`, endereço, coordenadas, link e data de cada local.
- As observações explicam os casos que podem gerar dúvida no QA: endereço sem número (ids 2, 3 e 5) e o nome atual da praça no mapa (id 5).
- O passo a passo permite refazer a conferência só com o navegador, sem programa nenhum.