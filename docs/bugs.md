# Relatório de defeitos

Referência: [documentação da Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao), VZS-142, versão 2.3.0. BUG-001 e BUG-002 são defeitos reproduzidos contra regras explícitas. BUG-003 tem comportamento reproduzido e está classificado como **possível defeito**, pendente de esclarecimento do requisito. A execução da automação está registrada em [execucao-testes.md](execucao-testes.md).

[Relatório público no Google Docs](https://docs.google.com/document/d/1yNE4UrKaINRwG3k9Hg6c0MbgcrnqlcLTna6scdQBGEo/edit).

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

## BUG-003 — Checkout aceita nome composto apenas por números

- **Título:** [Checkout] Pedido é confirmado com nome composto apenas por números.
- **Status:** Possível defeito; comportamento reproduzido. Classificação pendente de esclarecimento do requisito.
- **Data da reprodução:** 08/10/2026, America/Sao_Paulo.
- **Ambiente e versão:** Verzel Store (teste), Windows e navegador integrado do Codex; versão do navegador não registrada. Documentação VZS-142, versão 2.3.0. Build/commit do sistema não informado.
- **Prioridade sugerida:** Média, sujeita à triagem.
- **Pré-condição:** Nova aba, carrinho com uma Mochila Urbana 20L (P005), sem cupom.
- **Dados observados:** Nome `1111111111 222222`; CEP `11111111`; e-mail informado pelo usuário, em formato válido, omitido desta versão pública.

**Passos para reproduzir:**

1. Acessar a loja, adicionar uma unidade de P005 e abrir o carrinho.
2. Selecionar **Finalizar compra**.
3. Preencher nome `1111111111 222222`, CEP `11111111` e um e-mail em formato válido.
4. Clicar em **Confirmar pedido** e verificar a confirmação.

Para repetir sem dados pessoais, pode-se usar `qa.exploratorio@example.com`; é uma sugestão de massa, não o endereço usado nesta evidência.

- **Resultado esperado (interpretação a validar):** Impedir a confirmação com um nome inteiramente numérico e orientar o preenchimento de nome e sobrenome. A documentação exige nome e sobrenome, mas não especifica os caracteres permitidos.
- **Resultado obtido:** Pedido `VZ-274835` confirmado; a tela exibiu “Obrigado, 1111111111”. Subtotal R$ 100,00, desconto R$ 0,00, frete R$ 19,90 e total R$ 119,90.
- **Impacto:** Permite concluir o fluxo com identificação composta somente por números, prejudicando a qualidade dos dados do cliente.
- **Evidência:** [Captura original da confirmação](../evidencias/relatorio-defeitos/BUG-003-nome-numerico-confirmacao.jpg). O print não expõe o e-mail.
- **Automação:** Reprodução exploratória pela UI; não incluída nos 11 testes existentes. Não houve verificação direta da API deste achado.
- **Decisão pendente:** Esclarecer a regra de caracteres do nome antes de promover o registro a defeito confirmado. Não há simplificação explícita autorizando nomes numéricos.

**Triagem dos demais dados:** `11111111` tem oito dígitos e atende ao formato de CEP documentado; não existe exigência de consultar sua existência. A mensagem “Informe um e-mail válido.” foi relatada pelo usuário, mas não apareceu na reprodução com os dados fornecidos. Não foram registrados novos bugs de CEP ou e-mail.

## Como interpretar as falhas conhecidas da automação

`test.fail()` executa o teste e exige que ele falhe. Não equivale a `skip` ou `fixme`. O motivo e o assert continuam visíveis no relatório. Se o defeito for corrigido e o assert passar, o Playwright acusa **passagem inesperada**, exigindo revisão e remoção da marcação.

A preparação e as verificações anteriores à marcação continuam sujeitas a falha inesperada. No BUG-002, o teste ainda verifica a resposta antes de marcar a falha: um erro de infraestrutura ou um código de validação diferente não é tratado como o defeito conhecido. A verificação final continua exigindo HTTP 422.

Falhas conhecidas devem ser contadas separadamente dos testes que realmente passaram, mesmo quando o processo de execução termina com código zero.
