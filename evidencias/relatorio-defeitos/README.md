# Evidências do relatório de defeitos

[Relatório público no Google Docs](https://docs.google.com/document/d/1yNE4UrKaINRwG3k9Hg6c0MbgcrnqlcLTna6scdQBGEo/edit).

- **BUG-001:** o relatório utiliza o [print original do carrinho](../automacao/BUG-001-frete.png), preservado da execução de 06/10/2026 iniciada às 16h53, America/Sao_Paulo. O registro completo permanece em [execucao-testes.md](../../docs/execucao-testes.md).
- **BUG-002:** [print do relatório Playwright](BUG-002-relatorio-playwright.jpg) da execução já existente iniciada em 06/10/2026 às 18h26min52s, America/Sao_Paulo (`2026-10-06T21:26:52.231Z`). A captura mostra a falha do assert: esperado HTTP 422, recebido HTTP 200, e o anexo com seis unidades de P005.
- **JSON do BUG-002:** [requisição e resposta](BUG-002-resposta-api.json) extraídas do anexo `BUG-002 - resposta da API` dessa mesma execução, sem alteração dos valores.

- **BUG-003 (possível defeito):** [captura original da confirmação](BUG-003-nome-numerico-confirmacao.jpg), obtida na reprodução exploratória de 08/10/2026 no navegador integrado do Codex, em Windows. Nome utilizado: `1111111111 222222`; CEP: `11111111`; pedido confirmado: `VZ-274835`. O e-mail pessoal usado foi omitido do relatório público e não aparece nessa captura. A imagem foi copiada sem alteração; SHA-256: `3DDF9C0F5D4E1BAD2034B0AE798DE51D762ACEE4394945A16A2D8F1B90FDFDA0`.

Para BUG-001 e BUG-002 foram reutilizadas evidências existentes. BUG-003 foi reproduzido pela interface após o relato do usuário; o registro foi solicitado em seguida, sem uma nova execução para esta atualização documental. Não houve validação direta da API desse achado nem alteração dos 11 testes automatizados.

O resumo “Passed” do Playwright inclui falhas previstas por `test.fail()`; o erro visível no print do BUG-002 documenta um defeito conhecido, não um comportamento correto da API. As evidências anteriores foram mantidas.
