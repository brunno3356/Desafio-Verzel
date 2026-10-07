import { test, expect } from '@playwright/test';
import { CatalogoPage } from '../pages/CatalogoPage';
import { CarrinhoPage } from '../pages/CarrinhoPage';

test('CT-04 | UI permite 4 e 5 unidades e bloqueia a sexta', async ({ page }) => {
  const catalogo = new CatalogoPage(page);
  const carrinho = new CarrinhoPage(page);
  await catalogo.abrir();
  await catalogo.adicionarProduto('Mochila Urbana 20L', 4);
  await catalogo.abrirCarrinho();

  const quantidade = carrinho.quantidade('Mochila Urbana 20L');
  const aumentar = carrinho.botaoAumentarQuantidade('Mochila Urbana 20L');
  await expect(quantidade).toHaveText('4');
  await expect(aumentar).toBeEnabled();

  await aumentar.click();
  await expect(quantidade).toHaveText('5');
  await expect(aumentar).toBeDisabled();

  // A UI bloqueia a tentativa desabilitando os controles; não forçamos o clique.
  await carrinho.voltarParaProdutos();
  await expect(catalogo.botaoAdicionar('Mochila Urbana 20L')).toBeDisabled();
  await catalogo.abrirCarrinho();
  await expect(quantidade).toHaveText('5');
});

test('CT-04 | API permite 5 unidades', async ({ request }) => {
  const resposta = await request.post('/api/carrinho/calcular', {
    data: { itens: [{ produtoId: 'P005', quantidade: 5 }] },
  });

  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toMatchObject({
    itens: [{ produtoId: 'P005', quantidade: 5, total: 500 }],
    subtotal: 500,
    frete: 0,
    total: 500,
  });
});

test('CT-04 | API deve rejeitar 6 unidades [BUG-002]', async ({ request }, testInfo) => {
  const dados = { itens: [{ produtoId: 'P005', quantidade: 6 }] };
  const resposta = await request.post('/api/carrinho/calcular', { data: dados });
  const corpo = await resposta.json();
  await testInfo.attach('BUG-002 - resposta da API', {
    body: JSON.stringify({ requisicao: dados, status: resposta.status(), resposta: corpo }, null, 2),
    contentType: 'application/json',
  });

  // Uma indisponibilidade (ex.: HTTP 500) continua sendo uma falha inesperada.
  expect([200, 422]).toContain(resposta.status());
  if (resposta.status() === 200) {
    expect(corpo.itens).toEqual([
      expect.objectContaining({ produtoId: 'P005', quantidade: 6 }),
    ]);
  } else {
    expect(corpo.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  }

  test.fail(true, 'BUG-002 — API permite mais de 5 unidades por produto.');
  expect(resposta.status()).toBe(422);
});
