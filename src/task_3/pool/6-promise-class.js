'use strict';

class Pool {
  #max;
  #queue = [];
  #instances = [];

  constructor(factory, { size, max }) {
    this.#instances = new Array(size).fill(null).map(factory);
    this.#max = max;
  }

  async acquire() {
    console.log('acquire', {
      instances: this.#instances.length,
      queue: this.#queue.length,
    });
    return new Promise(resolve => {
      if (this.#instances.length > 0) {
        return resolve(this.#instances.pop());
      }

      this.#queue.push(resolve);
    });
  }
  release(instance) {
    console.log('release', {
      instances: this.#instances.length,
      queue: this.#queue.length,
    });
    if (this.#queue.length > 0) {
      const resolve = this.#queue.shift();
      resolve(instance);
    }

    if (this.#instances.length < this.#max) {
      this.#instances.push(instance);
    }
  }
}

const createBuffer = size => new Uint8Array(size);
const FILE_BUFFER_SIZE = 4;
const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);
const pool = new Pool(createFileBuffer, { size: 2, max: 2 });

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
