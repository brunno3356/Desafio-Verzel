# Casos de teste

Cinco cenários baseados na [documentação da Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao), versão 2.3.0, e na exploração realizada. As variantes geram **11 testes independentes**. Os resultados ficam em [execucao-testes.md](execucao-testes.md).

## CT-01 — Cupom válido

- **ID:** CT-01.
- **Título:** Aplicar BEMVINDO10 com normalização do código.
- **Objetivo:** Validar CA01, CA02 e CA09: desconto de 10% nos produtos, sem desconto no frete, ignorando capitalização e espaços nas extremidades.
- **Pré-condição:** Carrinho novo, com uma Mochila Urbana 20L (P005), sem cupom.
- **Dados:** P005 = R$ 100,00; variantes `BEMVINDO10` e ` bemvindo10 `, esta última com espaço antes e depois.
- **Passos:** Acessar a loja, adicionar P005, abrir o carrinho, preencher o código e aplicar o cupom. Repetir em outro teste para a segunda variante.
- **Resultado esperado:** Subtotal R$ 100,00; desconto R$ 10,00; frete R$ 19,90; total R$ 109,90. Cupom aplicado nas duas variantes.
- **Técnica:** Particionamento de equivalência para representações do mesmo cupom válido.
- **Automação correspondente:** [tests/cupom.spec.ts](../tests/cupom.spec.ts), testes `CT-01` — 2 variantes.

## CT-02 — Cupom inválido ou expirado

- **ID:** CT-02.
- **Título:** Recusar cupom inexistente e cupom expirado.
- **Objetivo:** Validar CA03 e CA04: mensagem correspondente e ausência de desconto.
- **Pré-condição:** Carrinho novo com P005 × 1 e sem cupom; VERAO2026 permanece expirado conforme os dados documentados.
- **Dados:** `INVALIDO` e `VERAO2026`.
- **Passos:** Adicionar P005, abrir o carrinho e aplicar o código da variante.
- **Resultado esperado:** `INVALIDO` apresenta **“Cupom inválido.”**; `VERAO2026` apresenta **“Cupom expirado.”**. Em ambos: subtotal R$ 100,00, desconto R$ 0,00, frete R$ 19,90 e total R$ 119,90.
- **Técnica:** Particionamento de equivalência: inexistente e expirado.
- **Automação correspondente:** [tests/cupom.spec.ts](../tests/cupom.spec.ts), testes `CT-02` — 2 variantes parametrizadas.

## CT-03 — Frete grátis

- **ID:** CT-03.
- **Título:** Validar o limite inclusivo do frete grátis.
- **Objetivo:** Validar CA06 e a cobrança de CA07: frete grátis para subtotal ≥ R$ 200,00; R$ 19,90 abaixo disso.
- **Pré-condição:** Carrinho novo e sem cupom em cada variante.
- **Dados e resultado esperado:**

| Variante | Produtos | Subtotal | Frete esperado |
| --- | --- | ---: | ---: |
| Abaixo | P001 × 1 + P002 × 1 | R$ 199,80 | R$ 19,90 |
| No limite | P005 × 2 | R$ 200,00 | Grátis |
| Acima | P001 × 1 + P005 × 1 + P008 × 1 | R$ 209,90 | Grátis |

- **Passos:** Acessar a loja, adicionar os produtos da variante, abrir o carrinho e conferir subtotal, ausência de desconto e frete.
- **Técnica:** Análise de valor limite no ponto de R$ 200,00, com representantes abaixo/acima formados pelos produtos disponíveis. R$ 199,80 e R$ 209,90 não são valores imediatamente adjacentes ao limite.
- **Automação correspondente:** [tests/frete.spec.ts](../tests/frete.spec.ts), testes `CT-03` — 3 variantes. Somente a variante no limite usa `test.fail()` por **BUG-001**, mantendo o assert de frete grátis.

## CT-04 — Limite de quantidade

- **ID:** CT-04.
- **Título:** Respeitar o máximo de cinco unidades por produto na UI e na API.
- **Objetivo:** Validar CA10 nas duas camadas.
- **Pré-condição:** UI em contexto novo; requisições de API independentes, sem cupom.
- **Dados:** P005; UI com 4 e 5 unidades; API com quantidades 5 e 6.
- **Passos:** Na UI, adicionar quatro unidades, conferir quantidade e controle habilitado, aumentar para cinco e verificar bloqueio no carrinho e na vitrine. Pela fixture `request`, enviar separadamente quantidades 5 e 6 para `POST /api/carrinho/calcular`.
- **Resultado esperado:** A UI permite 4 e 5, mas bloqueia a sexta unidade desabilitando os controles; o teste não força clique em botão desabilitado. A API aceita 5 com HTTP 200 e subtotal/total de R$ 500,00. Para 6, deve retornar HTTP 422 e `QUANTIDADE_MAXIMA_EXCEDIDA`.
- **Técnica:** Análise de valor limite: 4, 5 e 6 unidades.
- **Automação correspondente:** [tests/quantidade.spec.ts](../tests/quantidade.spec.ts) — 1 teste de UI e 2 de API. Somente quantidade 6 usa `test.fail()` por **BUG-002**, mantendo o assert HTTP 422. A automação da API deste cenário usa o endpoint de cálculo.

## CT-05 — Checkout completo

- **ID:** CT-05.
- **Título:** Confirmar pedido fictício com cupom e valores consistentes.
- **Objetivo:** Validar o fluxo E2E de compra, o padrão do número e a consistência entre carrinho, checkout e confirmação.
- **Pré-condição:** Carrinho novo; ambiente fictício, sem cobrança real.
- **Dados:** P005 × 1; BEMVINDO10; Maria Silva; `qa.exploratorio@example.com`; CEP `01310-100`.
- **Passos:** Acessar a loja; adicionar P005; aplicar cupom; conferir e guardar os valores do carrinho; avançar ao checkout; preencher os três campos; confirmar; conferir a página e o resumo do pedido.
- **Resultado esperado:** Pedido confirmado; número `VZ-` seguido de seis dígitos; uma mochila no resumo; subtotal R$ 100,00, desconto R$ 10,00, frete R$ 19,90 e total R$ 109,90 em todas as etapas. Não há pagamento online nem pedido real.
- **Técnica:** Transição de estado: carrinho → checkout → confirmação.
- **Automação correspondente:** [tests/checkout.spec.ts](../tests/checkout.spec.ts), teste `CT-05` — 1 fluxo E2E.
