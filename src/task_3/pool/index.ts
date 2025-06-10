'use strict';

{
  const poolify = <T, O>(
    factory: (...args: O[]) => T,
    options: O[],
    size: number,
    max: number,
  ) => {
    const instances = new Array(size).fill(null).map(() => factory(...options));

    const getInstance = () => {
      const instance = instances.pop() || factory(...options);
      return instance;
    };
    const putInstance = (instance: T) => {
      if (instances.length < max) {
        instances.push(instance);
      }
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
  pool.putInstance(instance);
}
