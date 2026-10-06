import { test, expect } from '@playwright/test';

const cenarios = [
  {
    nome: 'abaixo do limite',
    produtos: ['Camiseta Essencial', 'Calça Jeans Slim'],
    subtotal: 'R$ 199,80',
    frete: 'R$ 19,90',
    bugConhecido: false,
  },
  {
    nome: 'no limite de R$ 200,00 [BUG-001]',
    produtos: ['Mochila Urbana 20L', 'Mochila Urbana 20L'],
    subtotal: 'R$ 200,00',
    frete: 'Grátis',
    bugConhecido: true,
  },
  {
    nome: 'acima do limite',
    produtos: ['Camiseta Essencial', 'Mochila Urbana 20L', 'Garrafa Térmica 750ml'],
    subtotal: 'R$ 209,90',
    frete: 'Grátis',
    bugConhecido: false,
  },
];

for (const cenario of cenarios) {
  test(`CT-03 | frete ${cenario.nome}`, async ({ page }, testInfo) => {
    await page.goto('/');
    for (const produto of cenario.produtos) {
      await page.getByRole('article', { name: produto, exact: true })
        .getByRole('button', { name: 'Adicionar ao carrinho' }).click();
    }
    await page.getByRole('link', { name: /^Carrinho/ }).click();

    const resumo = page.getByRole('region', { name: 'Resumo do pedido' });
    await expect(resumo.locator('[data-valor="subtotal"]')).toHaveText(cenario.subtotal);
    await expect(resumo.locator('[data-valor="desconto"]')).toHaveText('R$ 0,00');
    const frete = resumo.locator('[data-valor="frete"]');
    await expect(frete).toBeVisible();

    if (cenario.bugConhecido) {
      await testInfo.attach('BUG-001 - frete no limite', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      // A preparação já passou. Somente o assert do frete abaixo é falha conhecida.
      test.fail(true, 'BUG-001 — Frete cobrado no limite exato de R$ 200,00.');
    }
    await expect(frete).toHaveText(cenario.frete);
  });
}
