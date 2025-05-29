import { IPurchase, TResult } from './index';

export class Basket {
  #resolve;
  #promise;

  #addedItems: IPurchase[] = [];
  #failedItems: IPurchase[] = [];
  #limit: number;

  constructor(constrains: { limit: number }) {
    const { resolve, promise } = Promise.withResolvers();
    this.#resolve = resolve;
    this.#promise = promise;
    this.#limit = constrains.limit;
  }

  add(item: IPurchase) {
    const isEnoughMoney = this.#limit >= item.price;
    const isFirstItem = this.#addedItems.length === 0;

    if ((!isEnoughMoney && isFirstItem) || isEnoughMoney) {
      this.#addedItems.push(item);
      this.#limit -= item.price;
      return;
    }

    if (!isEnoughMoney) {
      this.#failedItems.push(item);
    }
  }

  end() {
    this.#resolve({
      addedItems: this.#addedItems,
      failedItems: this.#failedItems,
      total: this.#addedItems.reduce((acc, item) => acc + item.price, 0),
    });
  }

  then(resolve: any) {
    this.#promise.then(resolve);
  }
}
