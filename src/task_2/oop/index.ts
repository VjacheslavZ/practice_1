import { MOCK_PURCHASE } from '../mockData';
import { Basket } from './Basket';
import { PurchaseIterator } from './PurchaseIterator';

export interface IPurchase {
  name: string;
  price: number;
}
export interface IThen {
  addedItems: IPurchase[];
  failedItems: IPurchase[];
  total: number;
}
export type TThen = (res: IThen) => IThen;

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
