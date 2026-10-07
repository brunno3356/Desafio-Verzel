import type { Locator, Page } from '@playwright/test';

export class CatalogoPage {
  constructor(private readonly page: Page) {}

  async abrir() {
    await this.page.goto('/');
  }

  botaoAdicionar(produto: string): Locator {
    return this.page.getByRole('article', { name: produto, exact: true })
      .getByRole('button', { name: 'Adicionar ao carrinho' });
  }

  async adicionarProduto(produto: string, quantidade = 1) {
    for (let unidade = 0; unidade < quantidade; unidade++) {
      await this.botaoAdicionar(produto).click();
    }
  }

  async abrirCarrinho() {
    await this.page.getByRole('link', { name: /^Carrinho/ }).click();
  }
}
