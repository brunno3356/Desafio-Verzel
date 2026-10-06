import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Mochila Urbana 20L', exact: true })
    .getByRole('button', { name: 'Adicionar ao carrinho' }).click();
  await page.getByRole('link', { name: /^Carrinho/ }).click();
  await expect(page.getByRole('region', { name: 'Resumo do pedido' })
    .locator('[data-valor="subtotal"]')).toHaveText('R$ 100,00');
});

for (const cupom of ['BEMVINDO10', ' bemvindo10 ']) {
  test(`CT-01 | cupom válido ${JSON.stringify(cupom)}`, async ({ page }) => {
    await page.getByLabel('Cupom de desconto', { exact: true }).fill(cupom);
    await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();

    await expect(page.getByRole('button', { name: 'Remover cupom' })).toBeVisible();
    const resumo = page.getByRole('region', { name: 'Resumo do pedido' });
    await expect(resumo.locator('[data-valor="subtotal"]')).toHaveText('R$ 100,00');
    await expect(resumo.locator('[data-valor="desconto"]')).toHaveText('- R$ 10,00');
    await expect(resumo.locator('[data-valor="frete"]')).toHaveText('R$ 19,90');
    await expect(resumo.locator('[data-valor="total"]')).toHaveText('R$ 109,90');
  });
}

const cuponsRecusados = [
  { codigo: 'INVALIDO', mensagem: 'Cupom inválido.' },
  { codigo: 'VERAO2026', mensagem: 'Cupom expirado.' },
];

for (const cupom of cuponsRecusados) {
  test(`CT-02 | cupom recusado ${cupom.codigo}`, async ({ page }) => {
    await page.getByLabel('Cupom de desconto', { exact: true }).fill(cupom.codigo);
    await page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();

    await expect(page.getByText(cupom.mensagem, { exact: true })).toBeVisible();
    const resumo = page.getByRole('region', { name: 'Resumo do pedido' });
    await expect(resumo.locator('[data-valor="desconto"]')).toHaveText('R$ 0,00');
    await expect(resumo.locator('[data-valor="subtotal"]')).toHaveText('R$ 100,00');
    await expect(resumo.locator('[data-valor="frete"]')).toHaveText('R$ 19,90');
    await expect(resumo.locator('[data-valor="total"]')).toHaveText('R$ 119,90');
  });
}
