'use strict';
const fs = require('node:fs');
const path = require('node:path');

// Task: implement cancellation by passing `AbortSignal` as an option
// to the promisified function (last argument, replacing the callback).
// Hint: Create `AbortController` or `AbortSignal` in the usage section.

const promisify =
  fn =>
  (...args) => {
    const promise = new Promise((resolve, reject) => {
      const signal = args.pop();

      const onAbort = () => reject(new Error('Aborted'));
      if (signal.aborted) onAbort();
      signal.addEventListener('abort', onAbort, { once: true });

      const callback = (err, data) => {
        if (!signal.aborted) {
          signal.removeEventListener('abort', onAbort);
          if (err) reject(err);
          else resolve(data);
        }
      };

      fn(...args, callback);
    });
    return promise;
  };

// Usage
const read = promisify(fs.readFile);
const ac = new AbortController();
const main = async () => {
  const fileName = '2.js';

  setTimeout(() => {
    ac.abort();
  }, 1000);

  const data = await read(path.join(__dirname, fileName), 'utf8', ac.signal);

  console.log(`File "${fileName}" size: ${data.length}`);
};

main();
