'use strict';

{
  class Pool {
    #instances = [];
    #max;
    #factory;
    #produced = 0;
    #size = 0;

    constructor(factory, { size, max }) {
      this.#instances = new Array(size).fill(null).map(factory);
      this.#max = max;
      this.#factory = factory;
      this.#size = size;
      this.#produced = size;
    }

    acquire() {
      const instance = this.#instances.pop();
      if (instance) {
        return instance;
      }

      if (this.#produced < this.#max) {
        this.#produced++;
        return this.#factory();
      }

      throw new Error('No instances available');
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
  const pool = new Pool(createFileBuffer, { size: 2, max: 4 });
}
