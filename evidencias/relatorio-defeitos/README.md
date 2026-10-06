# Evidências do relatório de defeitos

[Relatório público no Google Docs](https://docs.google.com/document/d/1yNE4UrKaINRwG3k9Hg6c0MbgcrnqlcLTna6scdQBGEo/edit).

- **BUG-001:** o relatório utiliza o [print original do carrinho](../automacao/BUG-001-frete.png), preservado da execução de 06/10/2026 iniciada às 16h53, America/Sao_Paulo. O registro completo permanece em [execucao-testes.md](../../docs/execucao-testes.md).
- **BUG-002:** [print do relatório Playwright](BUG-002-relatorio-playwright.jpg) da execução já existente iniciada em 06/10/2026 às 18h26min52s, America/Sao_Paulo (`2026-10-06T21:26:52.231Z`). A captura mostra a falha do assert: esperado HTTP 422, recebido HTTP 200, e o anexo com seis unidades de P005.
- **JSON do BUG-002:** [requisição e resposta](BUG-002-resposta-api.json) extraídas do anexo `BUG-002 - resposta da API` dessa mesma execução, sem alteração dos valores.

Nenhum teste novo foi executado para elaborar o relatório. O resumo “Passed” do Playwright inclui falhas previstas por `test.fail()`; o erro visível no print documenta um defeito conhecido, não um comportamento correto da API. As evidências da execução anterior foram mantidas.
