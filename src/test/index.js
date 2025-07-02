class Actor {
  #queue = [];
  #processing = false;
  #behavior = null;
  #state = null;

  constructor(behavior, state) {
    this.#behavior = behavior;
    this.#state = state;
  }

  async send(message) {
    this.#queue.push(message);
    await this.#process();
  }

  async #process() {
    if (this.#processing) return;
    this.#processing = true;

    while (this.#queue.length) {
      const message = this.#queue.shift();
      await this.#behavior(message, this.#state);
    }

    this.#processing = false;
  }
}

// Usage
const checkAvailability = async (items, state) => {
  console.log({ checkStart: items });
  console.log({ state: state });
  for (const item of items) {
    const { id, quantity } = item;
    let count = state[id];
    if (quantity > count) {
      console.log({ checkEnd: false });
      return false;
    }
  }
  console.log({ checkEnd: true });
  return true;
};
const processPayment = async payment => {
  console.log({ payment });
};
const shipGoods = async (items, state) => {
  for (const { id, quantity } of items) {
    state[id] -= quantity;
  }
  console.log({ ship: items });
};
const sendOrderConfirmation = async email => {
  console.log({ email });
};

const buy = async (order, state) => {
  const available = await checkAvailability(order.items, state);
  if (available) {
    await processPayment(order.paymentDetails);
    await shipGoods(order.items, state);
    await sendOrderConfirmation(order.userEmail);
  }
  console.log({ state });
};

const main = async () => {
  // buy - реализация паттерна открытый конструктор
  const orderActor = new Actor(buy, { 1722: 5 });
  const name = 'A4 Paper; 500 sheets; 75 Gsm';

  const order1 = {
    paymentDetails: { card: '**** **** **** 1234' },
    items: [{ id: 1722, name, price: 52, quantity: 3 }],
    userEmail: 'customer@example.com',
  };

  await orderActor.send(order1);

  const order2 = {
    paymentDetails: { card: '**** **** **** 1234' },
    items: [{ id: 1722, name, price: 52, quantity: 1 }],
    userEmail: 'customer@example.com',
  };
  await orderActor.send(order2);

  const order3 = {
    paymentDetails: { card: '**** **** **** 1234' },
    items: [{ id: 1722, name, price: 52, quantity: 2 }],
    userEmail: 'customer@example.com',
  };
  await orderActor.send(order3);
};

main();
