'use strict';

const POOL_SIZE = 1000;

const poolify = <F>(factory: () => F, options: { poolSize: number }) => {
  const instances = new Array(options.poolSize).fill(null).map(factory);

  const acquire: () => F = () => {
    const instance = instances.pop() || factory();
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
const factory = (): Array<number> => new Array(1000).fill(0);
const arrayPool = poolify(factory, { poolSize: POOL_SIZE });

const a1 = arrayPool.acquire();
const b1 = a1.map((_x, i) => i).reduce((x, y) => x + y);
console.log(b1);

const a2 = factory();
const b2 = a2.map((_x, i) => i).reduce((x, y) => x + y);
console.log(b2);

const a3 = factory();
const b3 = a3.map((_x, i) => i).reduce((x, y) => x + y);
console.log(b3);
