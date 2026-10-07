import type { Locator, Page } from '@playwright/test';

export class CarrinhoPage {
  readonly subtotal: Locator;
  readonly desconto: Locator;
  readonly frete: Locator;
  readonly total: Locator;
  readonly valoresResumo: Locator;
  readonly removerCupom: Locator;

  constructor(private readonly page: Page) {
    const resumo = page.getByRole('region', { name: 'Resumo do pedido' });
    this.subtotal = resumo.locator('[data-valor="subtotal"]');
    this.desconto = resumo.locator('[data-valor="desconto"]');
    this.frete = resumo.locator('[data-valor="frete"]');
    this.total = resumo.locator('[data-valor="total"]');
    this.valoresResumo = resumo.getByRole('definition');
    this.removerCupom = page.getByRole('button', { name: 'Remover cupom' });
  }

  async aplicarCupom(codigo: string) {
    await this.page.getByLabel('Cupom de desconto', { exact: true }).fill(codigo);
    await this.page.getByRole('button', { name: 'Aplicar cupom', exact: true }).click();
  }

  mensagemCupom(texto: string): Locator {
    return this.page.getByText(texto, { exact: true });
  }

  quantidade(produto: string): Locator {
    return this.page.getByRole('status', { name: `Quantidade de ${produto}`, exact: true });
  }

  botaoAumentarQuantidade(produto: string): Locator {
    return this.page.getByRole('button', { name: `Aumentar quantidade de ${produto}`, exact: true });
  }

  async voltarParaProdutos() {
    await this.page.getByRole('link', { name: 'Produtos', exact: true }).click();
  }

  async abrirCheckout() {
    await this.page.getByRole('link', { name: 'Finalizar compra', exact: true }).click();
  }
}
