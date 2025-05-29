import { MOCK_PURCHASE } from '../mockData';
import { Basket } from './Basket';
import { PurchaseIterator } from './PurchaseIterator';

export interface IPurchase {
  name: string;
  price: number;
}
export interface IResult {
  addedItems: IPurchase[];
  failedItems: IPurchase[];
  total: number;
}
export type TResult = (res: IResult) => IResult;

type TLogger = (basket: Promise<IResult>) => Promise<void>;
const logger = async (basket: any) => {
  const result = await basket;
  console.dir(result, { depth: null });
};

const main = async () => {
  const goods = PurchaseIterator.create(MOCK_PURCHASE);
  const basket = new Basket({ limit: 1530 });

  logger(basket);

  for await (const item of goods) {
    basket.add(item);
  }

  basket.end();
};
main();

module.exports = {
  Basket,
  PurchaseIterator,
};
