'use strict';
// Fix max
{
  class Pool {
    #max;
    #queue = [];
    #instances = [];

    constructor(factory, { size, max }) {
      this.#instances = new Array(size).fill(null).map(factory);
      this.#max = max;
    }

    acquire(callback) {
      if (this.#instances.length > 0) {
        const instance = this.#instances.pop();
        return callback(instance);
      }

      this.#queue.push(callback);
    }
    release(instance) {
      if (this.#queue.length > 0) {
        const callBack = this.#queue.shift();

        callBack(instance);
        return;
      }

      if (this.#instances.length < this.#max) {
        this.#instances.push(instance);
      }
    }
  }

  const createBuffer = size => new Uint8Array(size);
  const FILE_BUFFER_SIZE = 4;
  const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);
  const pool = new Pool(createFileBuffer, { size: 2, max: 4 });

  const cb = async instance => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    pool.release(instance);
  };

  pool.acquire(cb);
  pool.acquire(cb);

  pool.acquire(cb);
  pool.acquire(cb);
  pool.acquire(cb);
  pool.acquire(cb);
  pool.acquire(cb);
  pool.acquire(cb);
}
