// const {} = require('Promise')
import { MOCK_PURCHASE } from '../mockData';

interface IPurchase {
  name: string;
  price: number;
}
// TODO split into files
interface IThen {
  addedItems: IPurchase[];
  failedItems: IPurchase[];
  total: number;
}
type TThen = (res: IThen) => IThen;

class PurchaseIterator {
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

class Basket {
  #limit: number;
  #addedItems: IPurchase[] = [];
  #failedItems: IPurchase[] = [];

  constructor(constrains: { limit: number }) {
    this.#limit = constrains.limit;
  }

  add(item: IPurchase) {
    const isEnoughMoney = this.#limit >= item.price;
    const isFirstItem = this.#addedItems.length === 0;

    // add first item if it's not enough money
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

const main = async () => {
  const goods = PurchaseIterator.create(MOCK_PURCHASE);
  const basket = new Basket({ limit: 1530 });

  for await (const item of goods) {
    basket.add(item);
  }

  const result = basket.then(res => res);
  console.dir(result, { depth: null });
};

main();

module.exports = {
  Basket,
  PurchaseIterator,
};
