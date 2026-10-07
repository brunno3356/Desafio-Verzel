import { test, expect } from '@playwright/test';
import { CatalogoPage } from '../pages/CatalogoPage';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ConfirmacaoPage } from '../pages/ConfirmacaoPage';

test('CT-05 | confirma pedido com cupom e mantém os valores do carrinho', async ({ page }, testInfo) => {
  const catalogo = new CatalogoPage(page);
  const carrinho = new CarrinhoPage(page);
  const checkout = new CheckoutPage(page);
  const confirmacao = new ConfirmacaoPage(page);
  await catalogo.abrir();
  await catalogo.adicionarProduto('Mochila Urbana 20L');
  await catalogo.abrirCarrinho();
  await carrinho.aplicarCupom('BEMVINDO10');

  await expect(carrinho.subtotal).toHaveText('R$ 100,00');
  await expect(carrinho.desconto).toHaveText('- R$ 10,00');
  await expect(carrinho.frete).toHaveText('R$ 19,90');
  await expect(carrinho.total).toHaveText('R$ 109,90');
  const valoresCarrinho = await carrinho.valoresResumo.allTextContents();

  await carrinho.abrirCheckout();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(checkout.valoresResumo).toHaveText(valoresCarrinho);
  await checkout.preencherDados({
    nome: 'Maria Silva',
    email: 'qa.exploratorio@example.com',
    cep: '01310-100',
  });
  await checkout.confirmarPedido();

  await expect(page).toHaveURL(/\/pedido-confirmado$/);
  await expect(confirmacao.mensagemSucesso).toBeVisible();
  await expect(confirmacao.numeroPedido).toBeVisible();
  await expect(confirmacao.itensPedido).toBeVisible();
  await expect(confirmacao.valoresResumo).toHaveText(valoresCarrinho);
  await expect(confirmacao.item(/1\s*x\s*Mochila Urbana 20L/)).toBeVisible();
  await testInfo.attach('CT-05 - pedido confirmado', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});
