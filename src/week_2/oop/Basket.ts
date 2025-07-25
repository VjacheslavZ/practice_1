import { IPurchase, IResult } from './index';

export class Basket implements PromiseLike<IResult> {
  #resolve: (value: IResult) => void;
  #promise: Promise<IResult>;

  #addedItems: IPurchase[] = [];
  #failedItems: IPurchase[] = [];
  #limit: number;

  constructor(constraints: { limit: number }) {
    const { resolve, promise } = Promise.withResolvers<IResult>();
    this.#resolve = resolve;
    this.#promise = promise;
    this.#limit = constraints.limit;
  }

  add(item: IPurchase) {
    const isEnoughMoney = this.#limit >= item.price;
    const isFirstItem = this.#addedItems.length === 0;

    if (!isEnoughMoney && !isFirstItem) {
      this.#failedItems.push(item);
      return;
    }

    this.#addedItems.push(item);
    this.#limit -= item.price;
  }

  end() {
    this.#resolve({
      addedItems: this.#addedItems,
      failedItems: this.#failedItems,
      total: this.#addedItems.reduce((acc, item) => acc + item.price, 0),
    });
    return this;
  }

  then<TResult = IResult>(
    onfulfilled?: (value: IResult) => PromiseLike<TResult>,
  ): PromiseLike<TResult> {
    return this.#promise.then(onfulfilled);
  }
}
