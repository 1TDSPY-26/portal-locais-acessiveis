# Contrato de dados de locais

Este documento registra o contrato **implementado no frontend** em
[`src/services/locais.ts`](../src/services/locais.ts),
[`src/services/api.ts`](../src/services/api.ts) e
[`src/types/Local.ts`](../src/types/Local.ts). A equipe ainda precisa confirmar
os endpoints e os exemplos com a documentação do servidor.

## Origem e configuração

A URL-base vem de `VITE_API_URL`. O valor em [`.env.example`](../.env.example)
é apenas `https://api.exemplo.com`, portanto não identifica uma API disponível.
Sem uma URL real configurada, consultas e cadastros não podem ser validados de
ponta a ponta. A variável do Vite é pública no navegador: não incluir segredos.

Quando `VITE_API_URL` não existe ou está vazia, a função `resolverApiUrl`
(`src/services/api.ts`) usa `http://localhost:3000` e, só no `npm run dev`,
mostra um aviso no console explicando que falta criar o `.env.local`. Espaços
nas pontas e a barra final são removidos, para não gerar `//locais`.

| `VITE_API_URL` | URL usada |
| --- | --- |
| não existe | `http://localhost:3000` + aviso no console |
| `""` ou `"   "` | `http://localhost:3000` + aviso no console |
| `"https://api.site.com/"` | `https://api.site.com` |
| `"https://api.site.com"` | `https://api.site.com` |

## Operações usadas pelo frontend

| Função | Método e caminho | Entrada | Tipo de retorno no frontend |
| --- | --- | --- | --- |
| `listarLocais` | `GET /locais` | `categoria`, `acessibilidade`, `pagina`, `limite` opcionais na query | `ApiResult<Local[]>` |
| `obterLocalPorId` | `GET /locais/:id` | `id: number` | `ApiResult<Local>` |
| `criarLocal` | `POST /locais` | JSON com todos os campos de `Local`, exceto `id` | `ApiResult<Local>` |
| `atualizarLocal` | `PUT /locais/:id` | JSON com `Partial<Local>` | `ApiResult<Local>` |
| `removerLocal` | `DELETE /locais/:id` | `id: number` | `ApiResult<void>` |

Esses caminhos refletem o código atual e **não comprovam que o servidor os aceita**.
O serviço define limite de 10 segundos por requisição e envia
`Content-Type: application/json`.

## Dicionário de `Local`

Todos os campos abaixo são obrigatórios no tipo TypeScript. `id` é omitido
somente no corpo de `criarLocal`. O código ainda não valida a resposta recebida
em tempo de execução.

| Campo | Tipo | Exemplo ilustrativo | Significado |
| --- | --- | --- | --- |
| `id` | `number` | `1` | Identificador do local |
| `nome` | `string` | `"Biblioteca Exemplo"` | Nome exibido na lista e no detalhe |
| `endereco` | `string` | `"Rua Exemplo, 10"` | Endereço do local |
| `categoria` | `string` | `"Biblioteca"` | Categoria usada pelo filtro |
| `tiposAcessibilidade` | `string[]` | `["Rampa de acesso"]` | Recursos de acessibilidade declarados |
| `descricao` | `string` | `"Espaço de leitura"` | Descrição do local |
| `notaAcessibilidade` | `number \| null` | `4` | Nota de 1 a 5; `null` quando o local ainda não foi avaliado |

Exemplo **ilustrativo** de resposta JSON para `GET /locais`, compatível com
`Local[]`:

```json
[
  {
    "id": 1,
    "nome": "Biblioteca Exemplo",
    "endereco": "Rua Exemplo, 10",
    "categoria": "Biblioteca",
    "tiposAcessibilidade": ["Rampa de acesso"],
    "descricao": "Espaço de leitura",
    "notaAcessibilidade": 4
  }
]
```

## Erros e pendências de validação

`apiRequest` devolve `{ data }` após sucesso ou `{ error: { message, status? } }` em falhas. Para respostas não bem-sucedidas, os códigos 400, 401, 403, 404, 408, 409, 422, 429, 500, 502, 503 e 504 possuem mensagens específicas em português simples, que explicam o problema e orientam a pessoa sobre o que fazer. Outros códigos de erro 5xx usam a mensagem definida para o código 500; os demais códigos não mapeados usam a mensagem padrão. O código recebido continua disponível no campo `status`. Quando não há resposta do servidor, a mensagem é definida por `mensagemPorFalha`: falha de conexão usa `MENSAGEM_SEM_CONEXAO`, tempo esgotado usa `MENSAGEM_TEMPO_ESGOTADO` e resposta que não é JSON usa `MENSAGEM_RESPOSTA_INVALIDA`. A resposta 204 é tratada como sucesso sem dados. A mensagem detalhada enviada pelo servidor não é lida.

Antes de integrar cadastro e realizar QA completo, confirmar com a equipe do
backend a URL-base, os métodos, a obrigatoriedade e faixa dos campos, os
parâmetros aceitos, a política de CORS e os formatos reais de sucesso e erro.
