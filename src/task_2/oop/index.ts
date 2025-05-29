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

type TLogger = (basket: Basket) => Promise<void>;
const logger: TLogger = async basket => {
  const result = await basket;
  console.dir(result, { depth: null });
};

const main = async () => {
  const goods = PurchaseIterator.create(MOCK_PURCHASE);
  const basket = new Basket({ limit: 1505 });

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
