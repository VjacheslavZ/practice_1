'use strict';
const { memoryUsage } = require('node:process');

{
  const timeoutCollection = (
    interval,
    deleteExpiredInterval = interval * 10,
  ) => {
    const collection = new Map();

    const deleteExpired = () => {
      const now = Date.now();
      for (const [key, { expireDate }] of collection.entries()) {
        if (expireDate < now) collection.delete(key);
      }
    };

    setInterval(deleteExpired, deleteExpiredInterval);

    return {
      set(key, value) {
        const expireDate = Date.now() + interval;
        collection.set(key, { value, expireDate });
      },
      get(key) {
        const data = collection.get(key);
        if (data && data.expireDate < Date.now()) {
          collection.delete(key); // Do we need to delete the key here? single responsibility principle
          return undefined;
        }
        return data.value;
      },
      delete(key) {
        collection.delete(key);
      },
      toArray() {
        const now = Date.now();
        const result = [];
        for (const [key, { expireDate, value }] of collection.entries()) {
          if (expireDate < now)
            collection.delete(key); // Do we need to delete the key here? single responsibility principle
          else result.push([key, value]);
        }
        return result;
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
    memory: {
      rss: 1399750656, // 1.39 GB
      heapTotal: 1300299776, // 1,30 GB
      heapUsed: 1271082408, // 1,27 GB
      external: 1786157, // 1,78 MB
      arrayBuffers: 16795 // 16.795 KB
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
      const q = hash.get('quattro');
      console.dir({ q });
      console.dir({ array: hash.toArray() });
    }, 500);
  }, 1500);

  setTimeout(() => {
    console.dir({ array: hash.toArray() });
  }, 1000 * 15);
}
