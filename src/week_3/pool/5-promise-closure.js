'use strict';
// Fix max
{
  const poolify = (factory, { size, max }) => {
    const queue = [];
    const instances = new Array(size).fill(null).map(factory);

    const acquire = async () => {
      // console.log('acquire', {
      //   instances: instances.length,
      //   queue: queue.length,
      // });
      return new Promise(resolve => {
        if (instances.length > 0) {
          return resolve(instances.pop());
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

      if (instances.length < max) {
        instances.push(instance);
      }
    };

    return { acquire, release };
  };

  const createBuffer = size => new Uint8Array(size);
  const FILE_BUFFER_SIZE = 4;
  const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);
  const pool = poolify(createFileBuffer, { size: 2, max: 4 });

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
