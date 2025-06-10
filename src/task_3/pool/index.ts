'use strict';

// Closure version
{
  const poolify = <T, O>(
    factory: (...args: O[]) => T,
    options: O[],
    size: number,
    max: number,
  ) => {
    const instances = new Array(size).fill(null).map(() => factory(...options));

    const getInstance = () => {
      const instance = instances.pop() || factory(...options);
      return instance;
    };
    const putInstance = (instance: T) => {
      if (instances.length < max) {
        instances.push(instance);
      }
    };

    return {
      getInstance,
      putInstance,
    };
  };

  // Usage
  const createBufferFactory = (size: number) => new Uint8Array(size);
  const pool = poolify(createBufferFactory, [4096], 10, 15);

  const instance = pool.getInstance();
  pool.putInstance(instance);
}

// Class version
{
  class Pool<T, O> {
    #factory: (...args: O[]) => T;
    #options: O[];
    #instances: T[] = [];
    #max: number;

    constructor(
      factory: (...args: O[]) => T,
      options: O[],
      size: number,
      max: number,
    ) {
      this.#factory = factory;
      this.#options = options;
      this.#max = max;

      this.#instances = new Array(size)
        .fill(null)
        .map(() => factory(...options));
    }

    getInstance() {
      const instance = this.#instances.pop() || this.#factory(...this.#options);
      return instance;
    }

    putInstance(instance: T) {
      if (this.#instances.length < this.#max) {
        this.#instances.push(instance);
      }
    }
  }
  // Usage
  const createBufferFactory = (size: number) => new Uint8Array(size);
  const pool = new Pool(createBufferFactory, [4096], 10, 15);

  const instance = pool.getInstance();
  pool.putInstance(instance);
}
