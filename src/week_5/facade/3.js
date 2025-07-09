'use strict';
const { memoryUsage } = require('node:process');

{
  const timeoutCollection = interval => {
    const collection = new Map();
    const timers = new Map();

    return {
      set(key, value) {
        const timer = timers.get(key);
        if (timer) clearTimeout(timer);
        const timeout = setTimeout(() => {
          collection.delete(key);
        }, interval);
        timeout.unref();
        collection.set(key, value);
        timers.set(key, timer);
      },
      get(key) {
        return collection.get(key);
      },
      delete(key) {
        const timer = timers.get(key);
        if (timer) {
          clearTimeout(timer);
          collection.delete(key);
          timers.delete(key);
        }
      },
      toArray() {
        return [...collection.entries()];
      },
    };
  };
  const hash = timeoutCollection(1000);
  /*
  for (let i = 0; i < 10000000; i++) {
    hash.set(i, i);
  }
  console.dir({ memory: memoryUsage() });
   {
    memory: { bytes
      rss: 3638378496, // 3.63 GB
      heapTotal: 3578068992, // 3.57 GB
      heapUsed: 3504284016, // 3.5 GB
      external: 1786157, // 1.78 MB
      arrayBuffers: 16795 // 16,795 KB
    }
  } */
  hash.set('uno', 1);
  console.dir({ array: hash.toArray() });

  hash.set('due', 2);
  console.dir({ array: hash.toArray() });

  setTimeout(() => {
    hash.set('tre', 3);
    console.dir({ array: hash.toArray() });

    setTimeout(() => {
      hash.set('quattro', 4);
      console.dir({ array: hash.toArray() });
    }, 500);
  }, 1500);
}
