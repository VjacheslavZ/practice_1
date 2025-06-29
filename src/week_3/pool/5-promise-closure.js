'use strict';
// Fix max
{
  const poolify = (factory, options, { size, max }) => {
    const queue = [];
    let producedCount = size;
    const instances = new Array(size).fill(null).map(() => factory(options));

    const acquire = async () => {
      return new Promise(resolve => {
        if (instances.length > 0) {
          resolve(instances.pop());
          return;
        }

        if (producedCount < max) {
          producedCount++;
          resolve(factory(options));
          return;
        }

        queue.push(resolve);
      });
    };

    const release = instance => {
      console.log('release', {
        instances: instances.length,
        queue: queue.length,
      });

      if (queue.length > 0) {
        const resolve = queue.shift();
        resolve(instance);
        return;
      }

      instances.push(instance);
    };

    return { acquire, release };
  };

  const FILE_BUFFER_SIZE = 4;
  const createBuffer = size => new Uint8Array(size);
  const createFileBuffer = ({ bufferSize }) => createBuffer(bufferSize);
  const pool = poolify(
    createFileBuffer,
    { bufferSize: FILE_BUFFER_SIZE },
    { size: 2, max: 4 },
  );

  const timeout = ms => new Promise(res => setTimeout(res, ms));

  const main = async () => {
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
  };

  main();
}
