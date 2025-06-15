'use strict';

{
  const poolify = (factory, options, size, max) => {
    const instances = new Array(size).fill(null).map(() => factory(options));

    const acquire = () => {
      return instances.pop() || factory(options);
    };
    const release = instance => {
      if (instances.length < max) {
        instances.push(instance);
      }
    };
    return { acquire, release };
  };

  // Usage
  const createBuffer = ({ bufferSize }) => new Uint8Array(bufferSize);
  const pool = poolify(createBuffer, { bufferSize: 4096 }, 5, 10);

  const instance = pool.acquire();
  console.log({ instance });
  pool.release(instance);
}
