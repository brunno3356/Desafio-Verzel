import { test, expect } from '@playwright/test';

test('CT-05 | confirma pedido com cupom e mantém os valores do carrinho', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Mochila Urbana 20L', exact: true })
    .getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.getByRole('link', { name: /^Carrinho/ }).click();
  await page.getByLabel('Cupom de desconto', { exact: true }).fill('BEMVINDO10');
  await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();

  const resumo = page.getByRole('region', { name: 'Resumo do pedido' });
  await expect(resumo.locator('[data-valor="subtotal"]')).toHaveText('R$ 100,00');
  await expect(resumo.locator('[data-valor="desconto"]')).toHaveText('- R$ 10,00');
  await expect(resumo.locator('[data-valor="frete"]')).toHaveText('R$ 19,90');
  await expect(resumo.locator('[data-valor="total"]')).toHaveText('R$ 109,90');
  const valoresCarrinho = await resumo.getByRole('definition').allTextContents();

  await page.getByRole('link', { name: 'Finalizar compra', exact: true }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(resumo.getByRole('definition')).toHaveText(valoresCarrinho);
  await page.getByLabel('Nome completo', { exact: true }).fill('Maria Silva');
  await page.getByLabel('E-mail', { exact: true }).fill('qa.exploratorio@example.com');
  await page.getByLabel('CEP', { exact: true }).fill('01310-100');
  await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();

  await expect(page).toHaveURL(/\/pedido-confirmado$/);
  await expect(page.getByText('Pedido confirmado', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Pedido VZ-\d{6}$/ })).toBeVisible();
  const confirmacao = page.getByRole('region', { name: 'Itens do pedido', exact: true });
  await expect(confirmacao).toBeVisible();
  await expect(confirmacao.getByRole('definition')).toHaveText(valoresCarrinho);
  await expect(confirmacao.getByText(/1\s*x\s*Mochila Urbana 20L/)).toBeVisible();
  await testInfo.attach('CT-05 - pedido confirmado', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
});
