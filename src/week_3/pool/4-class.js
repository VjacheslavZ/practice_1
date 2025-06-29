'use strict';
// Fix max
{
  class Pool {
    #max;
    #queue = [];
    #instances = [];
    #producedCount = 0;
    #factory;
    #options;

    constructor(factory, options, { size, max }) {
      this.#instances = new Array(size).fill(null).map(() => factory(options));
      this.#max = max;
      this.#factory = factory;
      this.#options = options;
      this.#producedCount = size;
    }

    acquire(callback) {
      if (this.#instances.length > 0) {
        const instance = this.#instances.pop();
        process.nextTick(() => callback(instance));
        return;
      }

      if (this.#producedCount < this.#max) {
        this.#producedCount++;
        process.nextTick(() => callback(this.#factory(this.#options)));
        return;
      }

      this.#queue.push(callback);
    }

    release(instance) {
      if (this.#queue.length > 0) {
        const callBack = this.#queue.shift();
        process.nextTick(() => callBack(instance));
        return;
      }

      this.#instances.push(instance);
    }
  }

  const FILE_BUFFER_SIZE = 4;
  const createBuffer = size => new Uint8Array(size);
  const createFileBuffer = ({ bufferSize }) => createBuffer(bufferSize);
  const pool = new Pool(
    createFileBuffer,
    { bufferSize: FILE_BUFFER_SIZE },
    { size: 2, max: 4 },
  );

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
