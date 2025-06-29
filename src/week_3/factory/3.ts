'use strict';

const POOL_SIZE = 1000;

const poolify = <F>(
  factory: ({ size, initValue }: { size: number; initValue: number }) => F,
  options: { poolSize: number; initValue: number; size: number },
) => {
  const makeFactory = () => factory(options);
  const instances = new Array(options.poolSize).fill(null).map(makeFactory);

  const acquire: () => F = () => {
    const instance =
      instances.pop() ||
      factory({ size: options.size, initValue: options.initValue });
    console.log('Get from pool, count =', instances.length);
    return instance;
  };

  const release: (instance: F) => void = instance => {
    instances.push(instance);
    console.log('Recycle item, count =', instances.length);
  };

  return { acquire, release };
};

// Usage
const factory =
  ({ size, initValue }: { size: number; initValue: number }) =>
  () =>
    new Array(size).fill(initValue);

const arrayPool = poolify(factory, {
  size: 1000,
  initValue: 0,
  poolSize: POOL_SIZE,
});

const a1 = arrayPool.acquire();
// const b1 = a1.map((x, i) => i).reduce((x, y) => x + y);
// console.log(b1);
