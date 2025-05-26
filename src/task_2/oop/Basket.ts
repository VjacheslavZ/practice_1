import { IPurchase, TThen } from './index';

export class Basket {
  #limit: number;
  #addedItems: IPurchase[] = [];
  #failedItems: IPurchase[] = [];

  constructor(constrains: { limit: number }) {
    this.#limit = constrains.limit;
  }

  add(item: IPurchase) {
    const isEnoughMoney = this.#limit >= item.price;
    const isFirstItem = this.#addedItems.length === 0;

    // add a first item if it's not enough money
    if ((!isEnoughMoney && isFirstItem) || isEnoughMoney) {
      this.#addedItems.push(item);
      this.#limit -= item.price;
    }

    if (!isEnoughMoney) {
      this.#failedItems.push(item);
    }
  }

  then(resolve: TThen) {
    return resolve({
      addedItems: this.#addedItems,
      failedItems: this.#failedItems,
      total: this.#addedItems.reduce((acc, item) => acc + item.price, 0),
    });
  }
}
