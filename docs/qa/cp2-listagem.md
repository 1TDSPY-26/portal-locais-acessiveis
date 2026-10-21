# QA da listagem — issue #117

## Reteste em 21/10/2026

O reteste abaixo substitui os resultados antigos para a versão atual. As observações de navegador foram realizadas nesta sessão e registradas sem atribuir uma nova assinatura ou aprovação ao QA responsável pela entrega original. A seção histórica ao final mantém os resultados e as evidências anteriores, que não comprovam o comportamento da versão atual.

### Versões e dados

| Alvo | Versão examinada | Uso |
|---|---|---|
| `develop` | `ba0660868f8905e4d2a363cf104e8588a99bbc50` | Busca, filtros, ordenação, URL e estados atuais |
| Branch de QA | merge de `develop` em `c0f9eb4`; correção de isolamento do cache em `7d19ef5` | A01 e suíte automatizada da branch #117 |
| Candidata local de integração #125 + QA | `42652f103139ae20ebd9e2069b60f55c048e137f` | P01–P04, teclado da paginação e largura de 320 px; código de paginação ainda não integrado à `develop` |

- Fixture de 25 locais: [`fixtures/mock-api-muitos.mjs`](fixtures/mock-api-muitos.mjs), modos `success`, `empty` e `error`.
- Fixture original de três locais: [`fixtures/mock-api.mjs`](fixtures/mock-api.mjs), para B03 e a recuperação de E04.
- Ambiente local, Node 24 e navegador real. Os testes automatizados usaram `invalidarCacheLocais()` no `beforeEach` para que vazio e erro não compartilhem o resultado em cache.
- Os resultados descritos como observação manual foram conferidos no navegador. Um print sustenta apenas o estado visível capturado; não substitui a verificação de toda a sequência.

### Resultados atuais

| ID | Esperado | Encontrado no reteste | Resultado e alvo | Evidência |
|---|---|---|---|---|
| B01 | Buscar "Local 01" retorna um resultado e atualiza o contador | Um card e contador de um resultado | Passou na base atual | Observação manual nesta sessão; sem print específico novo |
| B02 | Buscar "local" em minúsculas retorna todos os locais | Os 25 cards permaneceram na lista | Passou na base atual | Observação manual nesta sessão; sem print específico novo |
| B03 | Buscar "bibliotéca" com a fixture original encontra "Biblioteca Central" | Biblioteca Central encontrada entre os três dados originais | Passou na base atual | [Busca com acento](evidencias/reteste-acento-2026-10-21.png) |
| B04 | Buscar "xyz" mostra ausência de resultados, distinta da lista vazia | Mensagem de ausência de correspondência, diferente de "Nenhum local cadastrado até o momento." | Passou na base atual | Observação manual de busca; [estado vazio para comparação](evidencias/reteste-vazio-2026-10-21.png) |
| B05 | "Limpar busca" restaura a lista e devolve o foco ao campo | Busca limpa, lista restaurada e campo com foco | Passou na base atual | Observação manual de lista e foco; sem print específico novo |
| F01 | Categoria Cultura mostra apenas locais dessa categoria | Oito locais de Cultura | Passou na base atual | Observação manual nesta sessão |
| F02 | Cultura + Libras aplica as duas condições | Quatro locais: 03, 06, 15 e 18 | Passou na base atual | Observação manual nesta sessão |
| F03 | Busca + categoria + recurso respeitam todas as condições | "Local 03" + Cultura + Libras produziu um resultado | Passou na base atual | [Filtros e URL](evidencias/reteste-url-2026-10-21.png) |
| F04 | "Limpar filtros e busca" restaura os controles, a URL e a lista | Busca, categoria e recursos limpos; URL sem os filtros; 25 cards | Passou na base atual | Observação manual nesta sessão |
| F05 | Todos os controles funcionam somente com Tab, Espaço e setas | Tab percorreu busca, limpar busca, categoria e os três recursos; Enter limpou busca e filtros; setas alteraram categoria e ordenação; Espaço alternou cada recurso; Tab chegou a Atualizar lista e Enter recarregou os três locais sem alerta | Passou na base atual | Observação manual por teclado nesta sessão e [trecho capturado](evidencias/reteste-teclado-2026-10-21.png); sem vídeo novo |
| P01 | Com 25 locais, mostrar "Mostrando 1–9 de 25 locais" e páginas 1, 2 e 3 | Nove cards, contador exigido e três páginas | Passou na candidata #125; **pendente na `develop`** | [Paginação em 320 px](evidencias/reteste-paginacao-320-2026-10-21.png); observação manual |
| P02 | Próxima abre a página 2, com `aria-current="page"` no botão atual | Enter em Próxima mostrou 10–18, nove cards e foco no `h2`; o componente aplica `aria-current="page"` à página atual | Passou na candidata #125; **pendente na `develop`** | Observação manual de Enter, intervalo e foco; contrato de `aria-current` conferido no componente da candidata |
| P03 | Anterior está desabilitado na primeira página | Botão Anterior desabilitado na página 1 | Passou na candidata #125; **pendente na `develop`** | Observação manual na candidata |
| P04 | Aplicar filtro na terceira página volta à página 1 | Página 3 exibiu 19–25, sete cards. Cultura mudou para 1–8, oito cards, sem navegação de páginas | Passou na candidata #125; **pendente na `develop`** | Observação manual na candidata |
| P05 | Ordenar por nome de Z a A coloca Local 25 primeiro | Local 25 passou a ser o primeiro card | Passou na base atual | Observação manual nesta sessão; o defeito histórico de seletor ausente não se reproduziu |
| P06 | Copiar a URL filtrada para outra aba mantém os filtros | Busca Local 03, Cultura e Libras foram mantidos na outra aba, com um resultado | Passou na base atual | [Filtros e URL](evidencias/reteste-url-2026-10-21.png); observação manual da outra aba |
| P07 | Abrir um detalhe e voltar pelo navegador mantém os filtros | Detalhe do Local 03 aberto; voltar preservou busca, categoria e Libras | Passou na base atual | Observação manual de navegação e retorno; sem vídeo novo |
| E01 | `success` mostra lista e encerra carregamento | 25 cards, sem Loading após a resposta | Passou na base atual | Observação manual nesta sessão |
| E02 | `empty` mostra lista vazia sem erro | "Nenhum local cadastrado até o momento.", sem `role="alert"` | Passou na base atual | [Lista vazia](evidencias/reteste-vazio-2026-10-21.png) e A01 |
| E03 | `error` mostra erro e Tentar novamente | Resposta 503 mostrou mensagem de indisponibilidade temporária e o botão de tentar novamente | Passou na base atual | [Erro da API](evidencias/reteste-erro-2026-10-21.png) e A01 |
| E04 | Após reiniciar a API em `success`, Tentar novamente carrega a lista | API original reiniciada em `success`; tentativa trouxe os três locais, dos quais um ficou visível por filtros preexistentes | Passou na base atual | Observação manual da recuperação, preservando os filtros |
| E05 | Contador tem `role="status"`; erro tem `role="alert"` | Ambos os roles confirmados no DOM | Passou na base atual | Inspeção do DOM nesta sessão; [estado de erro](evidencias/reteste-erro-2026-10-21.png) |
| A01 | O comando específico de estados passa | Dois testes passaram tanto na branch de QA isolada quanto na candidata com #125 | Passou nos dois alvos | `npm run test -- --run src/tests/qa/locais-estados.test.tsx`, exit 0, 2 testes |

### Verificações automatizadas e responsividade

- `npm ci`, `npm run lint` e `npm run build`: exit 0 na branch de QA.
- `npm run test -- --run`: exit 0, **92 testes em 14 arquivos** na branch de QA sobre a base atual.
- Comando A01: exit 0, **dois testes**, executado com Node 24 tanto isoladamente quanto sobre a candidata `42652f1` com a paginação.
- Na candidata de paginação, viewport com `innerWidth = 320` e largura do documento de 305 px: sem overflow horizontal observado. Botões de paginação com pelo menos 44 × 44 px; Enter transferiu o foco ao título da lista. Evidência: [320 px](evidencias/reteste-paginacao-320-2026-10-21.png).

### Situação e pendências

O PR de QA deve permanecer **draft**: os cenários de paginação passaram em uma candidata local, mas ainda dependem da integração da #125 e do reteste final sobre a `develop` resultante. F05 foi concluído por teclado nesta sessão. Falta um vídeo novo da paginação por teclado; as capturas e os resultados de foco estão registrados, mas não substituem esse vídeo solicitado na issue. Nenhuma aprovação técnica ou decisão final do QA foi atribuída automaticamente.

As antigas falhas P05, P06 e P07 não se reproduziram na base atual. As capturas antigas que mostram ausência de ordenação ou de filtros na URL permanecem abaixo como histórico; não são defeitos atuais confirmados.

## Registro histórico anterior ao reteste

Resultados entregues originalmente na branch `feature/117-qa-listagem` em `28004a1`. A issue declarava a base histórica `68358dc`; não há rastreabilidade individual de commit para cada captura. A tabela a seguir descreve aquela entrega, **não** os resultados do reteste de 21/10/2026. A decisão original não foi reatribuída nem convertida em aprovação atual.

| ID | Esperado | Encontrado | Resultado | Evidência |
|---|---|---|---|---|
| B01 | Buscar "Local 01" retorna 1 resultado e atualiza o contador | 1 resultado e contador atualizado | Passou | evidencias/evidencias-b01.png |
| B02 | Buscar "local" em minúsculas retorna todos os locais | Todos os 25 locais listados | Passou | evidencias/evidencias-b02.png |
| B03 | Buscar "bibliotéca" (mock original) encontra "Biblioteca Central" | "Biblioteca Central" encontrada | Passou | evidencias/evidencias-b03.png |
| B04 | Buscar "xyz" mostra mensagem de nenhum resultado, diferente da de lista vazia | Mensagem de nenhum resultado, diferente da de lista vazia | Passou (histórico) | evidencias/evidencias-b04.png e evidencias/evidencias-e02-web.png |
| B05 | "Limpar busca" restaura a lista e leva o foco ao campo | Lista completa restaurada e foco no campo de busca | Passou | evidencias/evidencias-b05-pt1.png e evidencias/evidencias-b05-pt2.png |
| F01 | Categoria "Cultura" mostra só locais de Cultura | 8 locais, todos de Cultura | Passou | evidencias/evidencias-f01.png |
| F02 | Cultura + Libras mostra só locais com as duas condições | Apenas locais com Cultura e Libras | Passou | evidencias/evidencias-f02.png |
| F03 | Busca + categoria juntas respeitam as duas | Resultado respeita busca e categoria | Passou | evidencias/evidencias-f03.png |
| F04 | "Limpar filtros e busca" volta tudo ao inicial | Campo vazio, filtros zerados e lista completa | Passou | evidencias/evidencias-f04-pt1.png e evidencias/evidencias-f04-pt2.png |
| F05 | Todos os controles funcionam só com teclado | Todos os controles operados com Tab, Espaço e setas | Passou | evidencias/evidencias-f05.mp4 |
| P01 | 25 locais: "Mostrando 1–9 de 25 locais" e botões 1, 2 e 3 | Não executado | Bloqueado | #125 sem PR |
| P02 | "Próxima" leva à página 2 e a página atual tem aria-current="page" | Não executado | Bloqueado | #125 sem PR |
| P03 | Na página 1, "Anterior" fica desabilitado | Não executado | Bloqueado | #125 sem PR |
| P04 | Filtrar estando na página 3 volta para a página 1 | Não executado | Bloqueado | #125 sem PR |
| P05 | Ordenar de Z a A mostra "Local 25" primeiro | Não há seletor de ordenação na tela; lista fixa de Local 01 em diante | Falhou | evidencias/evidencias-p05.png |
| P06 | Filtros aplicados ao copiar a URL e abrir em outra aba | Com "Cultura" selecionada (8 locais), a URL permanece `/locais`, sem `?categoria=...`; a outra aba abre sem filtro | Falhou | evidencias/evidencias-p06.png |
| P07 | Filtros preservados ao abrir um detalhe e voltar | Ao abrir o detalhe e voltar, os filtros são excluídos | Falhou | evidencias/evidencias-p07.mp4 |
| E01 | Modo success: lista aparece e "Carregando..." some | Lista com 25 locais e "Carregando..." removido | Passou | evidencias/evidencias-e01.mp4 |
| E02 | Modo empty: mensagem de lista vazia | "Nenhum local cadastrado até o momento." | Passou | evidencias/evidencias-e02-terminal.png e evidencias/evidencias-e02-web.png |
| E03 | Modo error: mensagem de erro e botão "Tentar novamente" | Alerta "Erro na requisição" e botão "Tentar novamente" | Passou | evidencias/evidencias-e03-terminal.png e evidencias/evidencias-e03-web.png |
| E04 | Após reiniciar o mock em success, "Tentar novamente" carrega a lista | Lista carregada após o clique | Passou | evidencias/evidencias-e04-terminal.png e evidencias/evidencias-e04-web.mp4 |
| E05 | Contador com `role="status"` e erro com `role="alert"` | Contador com `role="status"` e erro com `role="alert"` | Passou | evidencias/evidencias-e05.png |
| A01 | `npm run test -- --run src/tests/qa/locais-estados.test.tsx` passa | 2 testes passando (lista vazia sem erro; falha da API com "Tentar novamente") | Passou | evidencias/evidencias-a01.png |

Correção de referência documental no arquivo: a captura antiga de lista vazia existe em `evidencias/evidencias-e02-web.png`; não existe `evidencias/evidencias-e02.png`. O vídeo antigo de F05 existe com o nome exato `evidencias/evidencias-f05.mp4` (extensão em minúsculas). Os vídeos antigos não foram usados como evidência do reteste atual.
