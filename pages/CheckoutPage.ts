import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly valoresResumo: Locator;

  constructor(private readonly page: Page) {
    this.valoresResumo = page.getByRole('region', { name: 'Resumo do pedido' })
      .getByRole('definition');
  }

  async preencherDados(cliente: { nome: string; email: string; cep: string }) {
    await this.page.getByLabel('Nome completo', { exact: true }).fill(cliente.nome);
    await this.page.getByLabel('E-mail', { exact: true }).fill(cliente.email);
    await this.page.getByLabel('CEP', { exact: true }).fill(cliente.cep);
  }

  async confirmarPedido() {
    await this.page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();
  }
}
