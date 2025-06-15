import { IPurchase } from './index';

export class PurchaseIterator {
  #purchase: IPurchase[] = [];

  constructor(purchase: IPurchase[]) {
    this.#purchase = purchase;
  }

  static create(purchase: IPurchase[]) {
    return new PurchaseIterator(purchase);
  }

  [Symbol.asyncIterator]() {
    let index = 0;
    const self = this;
    return {
      async next(): Promise<IteratorResult<IPurchase>> {
        const done = index >= self.#purchase.length;
        const value = self.#purchase[index];
        index++;

        return { done, value };
      },
    };
  }
}
