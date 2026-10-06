# Bugs reproduzidos

Referência: [documentação da Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao), VZS-142, versão 2.3.0. Estes dois defeitos foram reproduzidos na exploração. A execução da automação está registrada em [execucao-testes.md](execucao-testes.md).

## BUG-001 — Frete cobrado no limite exato de R$ 200

- **Título:** Frete é cobrado quando o subtotal é exatamente R$ 200,00.
- **Regra:** CA06: subtotal ≥ R$ 200,00 → frete grátis.
- **Prioridade sugerida:** Alta.
- **Pré-condição:** Carrinho vazio, sem cupom.
- **Reprodução:** Adicionar duas unidades de Mochila Urbana 20L (P005), de R$ 100,00 cada, e abrir o carrinho.
- **Esperado:** Subtotal R$ 200,00; frete grátis; total R$ 200,00.
- **Obtido na exploração:** Subtotal R$ 200,00; frete R$ 19,90; total R$ 219,90. A tela também informa “Faltam R$ 0,00 para o frete grátis”.
- **Impacto:** Acréscimo indevido de R$ 19,90 ao total do pedido.
- **Automação:** `CT-03 | frete no limite de R$ 200,00 [BUG-001]`, em [frete.spec.ts](../tests/frete.spec.ts). Mantém o esperado `Grátis` e usa `test.fail()` junto desse assert.
- **Evidência exploratória:** [captura da UI](../evidencias/08-frete-limite-reproducao-independente.jpg) e [resposta da API](../evidencias/api-01-limite-sem-cupom.txt).

A API de cálculo e a confirmação de pedido também apresentaram o desvio na exploração, inclusive com cupom. A regressão automatizada selecionada reproduz a variante de UI sem cupom. Não é simplificação prevista em “Sobre este ambiente”.

## BUG-002 — API permite mais de cinco unidades por produto

- **Título:** API aceita quantidade superior ao limite de cinco unidades.
- **Regra:** CA10: máximo de cinco unidades por produto, tanto na UI quanto na API.
- **Prioridade sugerida:** Alta.
- **Pré-condição:** Produto P005 existente; requisição JSON.
- **Reprodução:** Enviar o corpo abaixo para `POST /api/carrinho/calcular`, com `Content-Type: application/json`.

```json
{
  "itens": [{ "produtoId": "P005", "quantidade": 6 }]
}
```

- **Esperado:** HTTP 422 e `erro.codigo = QUANTIDADE_MAXIMA_EXCEDIDA`.
- **Obtido na exploração:** HTTP 200, quantidade 6 aceita e subtotal/total de R$ 600,00.
- **Impacto:** Permite calcular um carrinho que viola o limite por produto. A confirmação pela API também aceitou seis unidades durante a exploração.
- **Automação:** `CT-04 | API deve rejeitar 6 unidades [BUG-002]`, em [quantidade.spec.ts](../tests/quantidade.spec.ts). Mantém `expect(resposta.status()).toBe(422)` e usa `test.fail()` junto desse assert.
- **Evidência exploratória:** [cálculo com seis unidades](../evidencias/api-02-quantidade-seis.txt) e [pedido com seis unidades](../evidencias/api-11-pedido-quantidade-seis.txt).

A UI bloqueia corretamente em cinco. Ausência de controle de estoque não elimina o limite explícito por pedido. A regressão automatizada usa o endpoint de cálculo; não há cenário adicional de pedido com seis unidades nesta suíte.

## Como interpretar as falhas conhecidas

`test.fail()` executa o teste e exige que ele falhe. Não equivale a `skip` ou `fixme`. O motivo e o assert continuam visíveis no relatório. Se o defeito for corrigido e o assert passar, o Playwright acusa **passagem inesperada**, exigindo revisão e remoção da marcação.

A preparação e as verificações anteriores à marcação continuam sujeitas a falha inesperada. No BUG-002, o teste ainda verifica a resposta antes de marcar a falha: um erro de infraestrutura ou um código de validação diferente não é tratado como o defeito conhecido. A verificação final continua exigindo HTTP 422.

Falhas conhecidas devem ser contadas separadamente dos testes que realmente passaram, mesmo quando o processo de execução termina com código zero.
