'use strict';

{
  const poolify = (factory, { size, max }) => {
    const queue = [];
    const instances = new Array(size).fill(null).map(factory);

    const acquire = cb => {
      if (instances.length > 0) {
        return cb(instances.pop());
      }
      queue.push(cb);
    };

    const release = instance => {
      if (queue.length > 0) {
        const cb = queue.shift();
        console.log('release from queue');
        cb(instance);
        return;
      }

      if (instances.length < max) {
        instances.push(instance);
      }
    };

    return { acquire, release };
  };

  const createBuffer = size => new Uint8Array(size);
  const FILE_BUFFER_SIZE = 4;
  const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);
  const pool = poolify(createFileBuffer, { size: 2, max: 3 });

  const cb = async instance => {
    console.log({ instance });
    await new Promise(res => setTimeout(res, 2000));
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
