const readline = require('node:readline');

class Cursor {
  constructor() {
    const proto = Object.getPrototypeOf(this);
    if (proto.constructor === Cursor) {
      throw new Error('Abstract class should not be instanciated');
    }
    this.current = 0;
  }

  [Symbol.asyncIterator]() {
    throw new Error('Method is not implemented');
  }
}

class FileLineCursor extends Cursor {
  constructor(fileStorage, query) {
    super();
    this.query = query;
    this.lines = readline
      .createInterface({
        input: fileStorage.fileStream,
        crlfDelay: Infinity,
      })
      [Symbol.asyncIterator]();
  }

  [Symbol.asyncIterator]() {
    const cursor = this;
    return {
      async next() {
        do {
          const { value, done } = await cursor.lines.next();
          if (done) return { done: true };
          cursor.current++;
          const data = JSON.parse(value);
          let condition = true;
          const { query } = cursor;
          for (const field in query) {
            condition = condition && data[field] === query[field];
          }
          if (condition) return { value: data, done: false };
        } while (true);
      },
    };
  }
}

module.exports = FileLineCursor;
