# Execução dos testes

Execução automatizada dos **cinco cenários**, distribuídos em **11 testes independentes**, sem alterar os resultados esperados para acomodar os bugs conhecidos.

## Ambiente e comando

- **Data:** 06/10/2026, início às 16:53:41, America/Sao_Paulo.
- **Sistema:** https://verzel-store.qa-test-verzel-store.workers.dev/
- **Referência:** documentação VZS-142, versão 2.3.0.
- **Ambiente local:** Windows, Node.js 24.11.0, npm 11.6.1.
- **Ferramentas:** Playwright Test 1.63.0 e TypeScript 7.0.2.
- **Navegador:** Chromium 153.0.8010.12, headless.
- **Configuração:** um worker, zero retries, contexto independente por teste.
- **Comando:** `npm test`.
- **Duração total:** 18,7 segundos.
- **Código de saída:** 0.
- **Verificação complementar:** `npm run typecheck` concluído sem erros antes da execução.

## Resultado

| Classificação | Quantidade |
| --- | ---: |
| Aprovados, sem falha | **9** |
| Falhas esperadas por bugs conhecidos | **2** |
| Falhas inesperadas | **0** |
| Passagens inesperadas de testes marcados com `test.fail()` | **0** |
| Ignorados | **0** |
| Total executado | **11** |

O terminal informou `11 passed (18.7s)`: nesse resumo, o Playwright conta os testes com falha esperada como resultados previstos. O relatório JSON confirma **9 resultados `passed`** e **2 resultados `failed` com `expectedStatus = failed`**. O código zero não significa ausência de defeitos no sistema.

## Resultado por variante

| Caso | Variante | Resultado real | Classificação |
| --- | --- | --- | --- |
| CT-01 | `BEMVINDO10` | Desconto R$ 10,00; frete R$ 19,90; total R$ 109,90 | Aprovado |
| CT-01 | ` bemvindo10 ` | Mesmo desconto e total, com espaços e minúsculas | Aprovado |
| CT-02 | `INVALIDO` | “Cupom inválido.”; desconto zero; total R$ 119,90 | Aprovado |
| CT-02 | `VERAO2026` | “Cupom expirado.”; desconto zero; total R$ 119,90 | Aprovado |
| CT-03 | Subtotal R$ 199,80 | Frete R$ 19,90 | Aprovado |
| CT-03 | Subtotal R$ 200,00 | Frete R$ 19,90, quando deveria ser grátis | **Falha esperada — BUG-001** |
| CT-03 | Subtotal R$ 209,90 | Frete grátis | Aprovado |
| CT-04 | UI: 4 → 5; bloqueio da sexta | Quantidades permitidas; controles do carrinho e vitrine desabilitados em 5 | Aprovado |
| CT-04 | API: quantidade 5 | HTTP 200; cinco unidades; subtotal/total R$ 500,00 | Aprovado |
| CT-04 | API: quantidade 6 | HTTP 200 e seis unidades, quando deveria retornar HTTP 422 | **Falha esperada — BUG-002** |
| CT-05 | Checkout completo com cupom | Confirmação, número no padrão VZ-XXXXXX, produto e valores iguais aos do carrinho | Aprovado |

## Falhas esperadas

### BUG-001 — Frete no limite exato

- **Assert mantido:** `await expect(frete).toHaveText(cenario.frete)`, com `cenario.frete = 'Grátis'`.
- **Esperado:** `Grátis`.
- **Recebido:** `R$ 19,90`.
- **Subtotal verificado antes da marcação:** R$ 200,00; desconto zero.
- **Evidência da execução:** [BUG-001-frete.png](../evidencias/automacao/BUG-001-frete.png).

### BUG-002 — Quantidade acima do máximo

- **Assert mantido:** `expect(resposta.status()).toBe(422)`.
- **Esperado:** HTTP 422.
- **Recebido:** HTTP 200, quantidade 6 e subtotal/total de R$ 600,00.
- **Endpoint automatizado:** `POST /api/carrinho/calcular`.
- **Evidência da execução:** [BUG-002-resposta-api.json](../evidencias/automacao/BUG-002-resposta-api.json).

As duas falhas ocorreram nos asserts dos defeitos documentados, não na preparação dos cenários. Nenhum assert foi modificado após a execução para fazer a suíte passar. Se um desses asserts passar em uma execução futura, o Playwright deverá sinalizar passagem inesperada, indicando revisão da marcação `test.fail()`.

## Falhas inesperadas

**Nenhuma nesta execução.** Não houve necessidade de corrigir seletores ou repetir a suíte. Foi realizada uma execução completa com retries desativados.

## Evidências e relatório

- [JSON integral preservado desta execução](../evidencias/automacao/resultado-playwright.json), contendo resultados reais, status esperados, erros e anexos.
- [Captura da confirmação do checkout](../evidencias/automacao/CT-05-confirmacao.png).
- Captura de BUG-001 e resposta de BUG-002 nos links acima.
- Relatório HTML local em `playwright-report/`; abrir com `npm run test:report`.

A pasta `evidencias/automacao/` preserva esta execução independentemente das próximas. O runner pode substituir `evidencias/playwright/`, `evidencias/resultado-playwright.json` e `playwright-report/` quando for executado novamente. As evidências anteriores da exploração permanecem separadas.
