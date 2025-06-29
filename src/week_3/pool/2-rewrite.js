'use strict';

{
  class Pool {
    #instances = [];
    #max;
    #factory;
    #producedCount = 0;
    #options;

    constructor(factory, options, { size, max }) {
      this.#instances = new Array(size).fill(null).map(() => factory(options));
      this.#max = max;
      this.#factory = factory;
      this.#producedCount = size;
      this.#options = options;
    }

    acquire() {
      const instance = this.#instances.pop();
      if (instance) {
        return instance;
      }

      if (this.#producedCount < this.#max) {
        this.#producedCount++;
        return this.#factory(this.#options);
      }

      throw new Error('No instances available');
    }

    release(instance) {
      this.#instances.push(instance);
    }
  }

  const FILE_BUFFER_SIZE = 4096;
  const createBuffer = size => new Uint8Array(size);
  const createFileBuffer = ({ bufferSize }) => createBuffer(bufferSize);
  const pool = new Pool(
    createFileBuffer,
    { bufferSize: FILE_BUFFER_SIZE },
    { size: 2, max: 4 },
  );
}
