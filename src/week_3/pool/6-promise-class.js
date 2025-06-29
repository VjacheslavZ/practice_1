'use strict';

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

  async acquire() {
    return new Promise(resolve => {
      if (this.#instances.length > 0) {
        return resolve(this.#instances.pop());
      }

      if (this.#producedCount < this.#max) {
        this.#producedCount++;
        return resolve(this.#factory(this.#options));
      }

      this.#queue.push(resolve);
    });
  }

  release(instance) {
    if (this.#queue.length > 0) {
      const resolve = this.#queue.shift();
      return resolve(instance);
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
  { size: 2, max: 2 },
);

const timeout = ms => new Promise(res => setTimeout(res, ms));

pool.acquire().then(async instance => {
  await timeout(3000);
  pool.release(instance);
});
pool.acquire().then(async instance => {
  await timeout(6000);
  pool.release(instance);
});
pool.acquire().then(async instance => {
  pool.release(instance);
});
pool.acquire().then(async instance => {
  pool.release(instance);
});
