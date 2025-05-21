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

  get items() {
    return this.#items;
  }

  constructor(
    constrains: { limit: number },
    callback: (items: IPurchase[], total: number) => void,
  ) {
    this.#limit = constrains.limit;
  }

  add(item: IPurchase) {
    this.#items.push(item);
  }

  then(callback: (items: IPurchase[], total: number) => void) {
    return callback(
      this.#items,
      this.#items.reduce((acc, item) => acc + item.price, 0),
    );
  }

  // [Symbol.asyncIterator]() {
  //   return {
  //     async next() {
  //       return { done: true, value: null };
  //     },
  //   };
  // }
}

const main = async () => {
  const goods = PurchaseIterator.create(MOCK_PURCHASE);

  // const iterator = goods[Symbol.asyncIterator]();
  // const item1 = await iterator.next();
  // const item2 = await iterator.next();
  // const item3 = await iterator.next();
  // console.log({ item1 });
  // console.log({ item2 });
  // console.log({ item3 });

  const basket = new Basket({ limit: 1050 }, (items, total) => {
    console.log('xx', { total });
  });

  for await (const item of goods) {
    basket.add(item);
  }

  const basketResult = basket.then((items, total) => {
    return { items, total };
  });

  console.dir({ basketResult }, { depth: null });
};

main();
