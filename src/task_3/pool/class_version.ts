'use strict';

import { resolve } from 'node:path';

// Implement async instance acquisition in classes version with queue and callbacks
//Rewrite acquisition to promises in classes version
{
  class Pool<T, O> {
    #instances: T[] = [];
    #max: number;

    #free: boolean[] = [];
    #queue = [];
    #current = 0;
    #available = 0;
    #size: number;

    constructor(
      factory: (...args: O[]) => T,
      options: O[],
      size: number,
      max: number,
    ) {
      this.#max = max;
      this.#size = size;

      this.#free = new Array(size).fill(true);
      this.#current = 0;
      this.#available = size;

      this.#instances = new Array(size)
        .fill(null)
        .map(() => factory(...options));
    }

    async next() {
      if (this.#available === 0) {
        return new Promise<T>(resolve => {
          this.#queue.push(resolve);
        });
      }
      let instance = null;
      let free = false;
      do {
        instance = this.#instances[this.#current];
        free = this.#free[this.#current];
        this.#current++;
        // this.#available--;
        if (this.#current === this.#size) {
          this.#current = 0;
        }
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
    // @ts-ignore
    const instancesToReturn = [];

    const createBufferFactory = (size: number) => new Uint8Array(size);
    const pool = new Pool(createBufferFactory, [6], 10, 15);

    setTimeout(() => {
      // @ts-ignore
      pool.putInstance(instancesToReturn[0]);
    }, 2000);

    setTimeout(() => {
      // @ts-ignore
      pool.putInstance(instancesToReturn[1]);
    }, 3000);

    setTimeout(() => {
      // @ts-ignore
      pool.putInstance(instancesToReturn[2]);
    }, 4000);

    for (let i = 0; i < 13; i++) {
      const instance = await pool.getInstance();
      console.log(`instance #${i}`);

      if (i < 3) {
        instancesToReturn.push(instance);
      }
    }
  };

  main();
}
