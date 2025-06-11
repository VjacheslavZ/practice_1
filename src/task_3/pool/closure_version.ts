'use strict';

{
  const poolify = <T, O>(
    factory: (...args: O[]) => T,
    options: O[],
    size: number,
    max: number,
  ) => {
    const instances = new Array(size).fill(null).map(() => factory(...options));

    const queue: TResolve<T>[] = [];
    const free = new Array(size).fill(true);
    let current = 0;
    let available = size;

    const next = async () => {
      if (!available) {
        return new Promise<T>((resolve: TResolve<T>) => {
          queue.push(resolve);
        });
      }
      let instance = null;
      let isFree = false;
      do {
        instance = instances[current];
        isFree = free[current];
        current++;
      } while (!isFree || !instance);
      return instance;
    };

    const getInstance = async () => {
      const instance = await next();
      if (!instance) return null;
      const currentIndex = instances.indexOf(instance as T);
      free[currentIndex] = false;
      available--;
      return instance;
    };
    const putInstance = (instance: T) => {
      if (instances.length >= max) {
        throw new Error('Pool is full');
      }
      const currentIndex = instances.indexOf(instance);
      free[currentIndex] = true;
      available++;

      if (instances.length > 0) {
        const next = queue.shift();
        if (next) {
          setTimeout(next, 0, instance);
        }
      }
    };

    return {
      getInstance,
      putInstance,
    };
  };

  const main = async () => {
    // Usage
    const instancesToReturn: Uint8Array<ArrayBuffer>[] = [];
    const createBufferFactory = (size: number) => new Uint8Array(size);
    const pool = poolify(createBufferFactory, [2], 10, 15);

    setTimeout(() => {
      pool.putInstance(instancesToReturn[0]);
    }, 2000);

    setTimeout(() => {
      pool.putInstance(instancesToReturn[1]);
    }, 3000);

    setTimeout(() => {
      pool.putInstance(instancesToReturn[2]);
    }, 4000);

    for (let i = 0; i < 13; i++) {
      const instance = await pool.getInstance();
      console.log(`instance #${i}`, instance);
      if (i < 3 && instance) {
        instancesToReturn.push(instance);
      }
    }
  };

  main();
}
