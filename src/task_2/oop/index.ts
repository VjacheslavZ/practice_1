import { MOCK_PURCHASE } from '../mockData';

interface IPurchase {
  name: string;
  price: number;
}

interface PurchaseIterator {
  create(purchase: IPurchase[]): void;
  purchase: () => IPurchase[];
}

class PurchaseIterator implements PurchaseIterator {
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
  #items: IPurchase[] = [];
  #callback: (items: IPurchase[], total: number) => void;

  get items() {
    return this.#items;
  }

  constructor(
    constrains: { limit: number },
    callback: (items: IPurchase[], total: number) => void,
  ) {
    this.#limit = constrains.limit;
    this.#callback = callback;
  }

  add(item: IPurchase) {
    this.#items.push(item);
  }

  then() {
    this.#callback(
      this.#items,
      this.#items.reduce((acc, item) => acc + item.price, 0),
    );
  }
}

const main = async () => {
  const goods = PurchaseIterator.create(MOCK_PURCHASE);

  const basket = new Basket({ limit: 1050 }, (items, total) => {
    console.log('basket', { total, items });
  });

  for await (const item of goods) {
    basket.add(item);
  }

  basket.then();
};

main();
