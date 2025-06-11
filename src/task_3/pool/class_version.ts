'use strict';

type TResolve<T> = (value: T | PromiseLike<T>) => void;
{
  class Pool<T, O> {
    #instances: T[] = [];
    #max: number;

    #free: boolean[] = [];
    #queue: TResolve<T>[] = [];
    #current = 0;
    #available = 0;

    constructor(
      factory: (...args: O[]) => T,
      options: O[],
      size: number,
      max: number,
    ) {
      this.#max = max;

      this.#free = new Array(size).fill(true);
      this.#current = 0;
      this.#available = size;

      this.#instances = new Array(size)
        .fill(null)
        .map(() => factory(...options));
    }

    async next() {
      if (!this.#available) {
        return new Promise<T>((resolve: TResolve<T>) => {
          this.#queue.push(resolve);
        });
      }
      let instance = null;
      let free = false;
      do {
        instance = this.#instances[this.#current];
        free = this.#free[this.#current];
        // this.#available--;
        this.#current++;
      } while (!free || !instance);
      return instance;
    }

    async getInstance() {
      const instance = await this.next();
      if (!instance) return null;

      const currentIndex = this.#instances.indexOf(instance as T);
      this.#free[currentIndex] = false;
      this.#available--;
      return instance;
    }

    putInstance(instance: T) {
      if (this.#instances.length >= this.#max) {
        throw new Error('Pool is full');
      }
      const currentIndex = this.#instances.indexOf(instance);
      this.#free[currentIndex] = true;
      this.#available++;

      if (this.#instances.length > 0) {
        const next = this.#queue.shift();
        if (next) {
          setTimeout(next, 0, instance);
        }
      }
    }
  }

  // Usage
  const main = async () => {
    const instancesToReturn: Uint8Array<ArrayBuffer>[] = [];

    const createBufferFactory = (size: number) => new Uint8Array(size);
    const pool = new Pool(createBufferFactory, [4], 10, 15);

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
