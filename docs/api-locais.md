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
| `notaAcessibilidade` | `number` | `4` | Nota numérica, sem faixa documentada no contrato atual |

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

`apiRequest` devolve `{ data }` após sucesso ou `{ error: { message, status? } }`
em falhas. Uma resposta HTTP não bem-sucedida gera `"Erro na requisição"`
com o status; falha de rede gera `"Erro de conexão com a API"`; tempo esgotado
gera `"Tempo limite da requisição excedido"`. A resposta HTTP 204 é tratada
como sucesso sem dados. A mensagem detalhada enviada pelo servidor não é lida.

Antes de integrar cadastro e realizar QA completo, confirmar com a equipe do
backend a URL-base, os métodos, a obrigatoriedade e faixa dos campos, os
parâmetros aceitos, a política de CORS e os formatos reais de sucesso e erro.
