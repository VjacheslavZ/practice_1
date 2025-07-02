'use strict';
const path = require('node:path');
// Task: implement a cancelable promise by passing `timeout: number` as an option to the promisified function (last argument, replacing the callback).
{
  const promisify =
    fn =>
    (...args) => {
      const promise = new Promise((resolve, reject) => {
        const options = args.pop();
        if ('timeout' in options) {
          setTimeout(() => {
            reject(new Error('Time out !!!'));
          }, options.timeout);
        }

        const callback = (err, data) => {
          resolve(data);
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
    const data = await read(path.join(__dirname, fileName), 'utf8', {
      timeout: 5000,
    });
    console.log(`File "${fileName}" size: ${data.length}`);
  };

  main();
}
