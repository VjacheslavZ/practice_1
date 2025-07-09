'use strict';
const path = require('node:path');
// Task: implement a cancelable promise by passing `timeout: number` as an option to the promisified function (last argument, replacing the callback).
{
  const promisify =
    fn =>
    (...args) => {
      const promise = new Promise((resolve, reject) => {
        const timeout = args.pop();
        const state = { isRejected: false, timeoutId: null };
        state.timeoutId = setTimeout(() => {
          state.isRejected = true;
          reject(new Error('Time out'));
        }, timeout);

        const callback = (err, data) => {
          if (!state.isRejected) {
            clearTimeout(state.timeoutId);
            if (err) reject(err);
            else resolve(data);
          }
        };
        fn(...args, callback);
      });
      return promise;
    };

  // Usage
  const fs = require('node:fs');
  const read = promisify(fs.readFile);

  const main = async () => {
    const fileName = './1.js';
    const data = await read(path.join(__dirname, fileName), 'utf8', 2000);
    console.log(`File "${fileName}" size: ${data.length}`);
  };

  main();
}
