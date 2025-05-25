import { MOCK_PURCHASE } from '../mockData';

interface IPurchase {
  name: string;
  price: number;
}

// Variant 1
{
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

    then(
      resolve: (res: {
        addedItems: IPurchase[];
        failedItems: IPurchase[];
        total: number;
      }) => void,
    ) {
      return resolve({
        addedItems: this.#addedItems,
        failedItems: this.#failedItems,
        total: this.#addedItems.reduce((acc, item) => acc + item.price, 0),
      });
    }

    catch(err: any) {
      console.log('catch', err);
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
}

// variant 2
(async () => {
  // Disposable can be used
  interface IPurchase {
    name: string;
    price: number;
  }

  class PurchaseIterator {
    #purchase: IPurchase[] = [];
    onEnd: null | (() => void);

    constructor(purchase: IPurchase[], onEnd: () => void) {
      this.#purchase = purchase;
      this.onEnd = onEnd;
    }

    static create(purchase: IPurchase[], onEnd: () => void) {
      return new PurchaseIterator(purchase, onEnd);
    }

    #onEnd(callback: () => void) {
      this.onEnd = callback;
    }

    [Symbol.asyncIterator]() {
      let index = 0;
      const self = this;
      return {
        async next(): Promise<IteratorResult<IPurchase>> {
          const done = index >= self.#purchase.length;
          const value = self.#purchase[index];
          index++;
          if (done && self.onEnd) {
            self.onEnd();
          }
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

    constructor(constrains: { limit: number }) {
      this.#limit = constrains.limit;
    }

    add(item: IPurchase) {
      this.#items.push(item);
    }

    then() {
      console.log('then res', {
        items: this.items,
        total: this.#items.reduce((acc, item) => acc + item.price, 0),
      });
    }
  }

  const main = async () => {
    const basket = new Basket({ limit: 1050 });
    const goods = PurchaseIterator.create(MOCK_PURCHASE, () => basket.then());

    for await (const item of goods) {
      basket.add(item);
    }
    basket.then();
  };
  // main();
})();
