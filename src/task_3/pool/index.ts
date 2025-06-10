'use strict';
// @ts-nocheck
{
  const poolify = (factory, options, size, max) => {
    const instances = new Array(size).fill(null).map(() => factory(...options));

    const getInstance = () => {
      const instance = instances.pop() || factory(...options);
      return instance;
    };
    const putInstance = instance => {
      instances.push(instance);
    };

    return {
      getInstance,
      putInstance,
    };
  };

  // Usage
  const createBufferFactory = (size: number) => new Uint8Array(size);
  const pool = poolify(createBufferFactory, [4096], 10, 15);

  const instance = pool.getInstance();
  console.log('instance --- ', instance.length);
  pool.putInstance(instance);
}
