'use strict';

{
  class Pool {
    #instances = [];
    #max;
    #factory;
    constructor(factory, { size, max }) {
      this.#instances = new Array(size).fill(null).map(factory);
      this.#max = max;
      this.#factory = factory;
    }

    acquire() {
      return this.#instances.pop() || this.#factory();
    }
    release(instance) {
      if (this.#instances.length < this.#max) {
        this.#instances.push(instance);
      }
    }
  }

  const createBuffer = size => new Uint8Array(size);
  const FILE_BUFFER_SIZE = 4096;
  const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);
  const pool = new Pool(createFileBuffer, { size: 5, max: 10 });

  const instance = pool.acquire();
  pool.release(instance);
}
