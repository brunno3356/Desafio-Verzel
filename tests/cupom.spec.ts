import { test, expect } from '@playwright/test';
import { CatalogoPage } from '../pages/CatalogoPage';
import { CarrinhoPage } from '../pages/CarrinhoPage';

test.beforeEach(async ({ page }) => {
  const catalogo = new CatalogoPage(page);
  const carrinho = new CarrinhoPage(page);
  await catalogo.abrir();
  await catalogo.adicionarProduto('Mochila Urbana 20L');
  await catalogo.abrirCarrinho();
  await expect(carrinho.subtotal).toHaveText('R$ 100,00');
});

for (const cupom of ['BEMVINDO10', ' bemvindo10 ']) {
  test(`CT-01 | cupom válido ${JSON.stringify(cupom)}`, async ({ page }) => {
    const carrinho = new CarrinhoPage(page);
    await carrinho.aplicarCupom(cupom);

    await expect(carrinho.removerCupom).toBeVisible();
    await expect(carrinho.subtotal).toHaveText('R$ 100,00');
    await expect(carrinho.desconto).toHaveText('- R$ 10,00');
    await expect(carrinho.frete).toHaveText('R$ 19,90');
    await expect(carrinho.total).toHaveText('R$ 109,90');
  });
}

const cuponsRecusados = [
  { codigo: 'INVALIDO', mensagem: 'Cupom inválido.' },
  { codigo: 'VERAO2026', mensagem: 'Cupom expirado.' },
];

for (const cupom of cuponsRecusados) {
  test(`CT-02 | cupom recusado ${cupom.codigo}`, async ({ page }) => {
    const carrinho = new CarrinhoPage(page);
    await carrinho.aplicarCupom(cupom.codigo);

    await expect(carrinho.mensagemCupom(cupom.mensagem)).toBeVisible();
    await expect(carrinho.desconto).toHaveText('R$ 0,00');
    await expect(carrinho.subtotal).toHaveText('R$ 100,00');
    await expect(carrinho.frete).toHaveText('R$ 19,90');
    await expect(carrinho.total).toHaveText('R$ 119,90');
  });
}
