'use strict';
const FileStorage = require('./FileStorage');

// Usage
const main = async () => {
  const db = new FileStorage('./storage.dat');
  const cursor = db.select({ city: 'Roma' });
  console.log('cursor.query', cursor.lines);
  for await (const record of cursor) {
    console.dir(record);
  }
};
main();
