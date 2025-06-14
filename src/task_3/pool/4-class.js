'use strict';

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
        return callback(this.#instances.pop());
      }

      this.#queue.push(callback);
    }
    release(instance) {
      if (this.#queue.length > 0) {
        const callBack = this.#queue.shift();
        console.log('release from queue');
        callBack(instance);
      }

      if (this.#instances.length < this.#max) {
        this.#instances.push(instance);
      }
    }
  }

  const createBuffer = size => new Uint8Array(size);
  const FILE_BUFFER_SIZE = 4;
  const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);
  const pool = new Pool(createFileBuffer, { size: 2, max: 3 });

  const cb = async instance => {
    console.log({ instance });
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
