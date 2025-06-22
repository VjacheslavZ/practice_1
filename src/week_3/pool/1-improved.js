'use strict';

{
  const poolify = (factory, options, size, max) => {
    let produced = size;
    const instances = new Array(size).fill(null).map(() => factory(options));

    const acquire = () => {
      const instance = instances.pop();
      if (instance) {
        return instance;
      }
      if (produced < max) {
        produced++;
        return factory(options);
      }

      throw new Error('No instances available');
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
  const pool = poolify(createBuffer, { bufferSize: 4 }, 2, 4);
}
