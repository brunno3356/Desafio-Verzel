import type { Locator, Page } from '@playwright/test';

export class ConfirmacaoPage {
  readonly mensagemSucesso: Locator;
  readonly numeroPedido: Locator;
  readonly itensPedido: Locator;
  readonly valoresResumo: Locator;

  constructor(page: Page) {
    this.mensagemSucesso = page.getByText('Pedido confirmado', { exact: true });
    this.numeroPedido = page.getByRole('heading', { name: /^Pedido VZ-\d{6}$/ });
    this.itensPedido = page.getByRole('region', { name: 'Itens do pedido', exact: true });
    this.valoresResumo = this.itensPedido.getByRole('definition');
  }

  item(descricao: string | RegExp): Locator {
    return this.itensPedido.getByText(descricao);
  }
}
