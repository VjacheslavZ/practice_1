'use strict';
{
  const poolify = (factory, options, { size, max }) => {
    const queue = [];
    let producedCount = size;
    const instances = new Array(size).fill(null).map(() => factory(options));

    const acquire = cb => {
      if (instances.length > 0) {
        const instance = instances.pop();
        return process.nextTick(() => cb(instance));
      }
      if (producedCount < max) {
        producedCount++;
        return process.nextTick(() => cb(factory(options)));
      }

      queue.push(cb);
    };

    const release = instance => {
      if (queue.length > 0) {
        const cb = queue.shift();
        return process.nextTick(() => cb(instance));
      }

      instances.push(instance);
    };

    return { acquire, release };
  };

  const createBuffer = size => new Uint8Array(size);
  const FILE_BUFFER_SIZE = 4;
  const createFileBuffer = ({ bufferSize }) => createBuffer(bufferSize);
  const pool = poolify(
    createFileBuffer,
    { bufferSize: FILE_BUFFER_SIZE },
    { size: 2, max: 4 },
  );

  const cb = timeout => instance => {
    setTimeout(() => {
      pool.release(instance);
    }, timeout * 1000);
  };

  pool.acquire(cb(1));
  pool.acquire(cb(2));

  pool.acquire(cb(3));
  pool.acquire(cb(4));
  pool.acquire(cb(4));
  pool.acquire(cb(5));
}
