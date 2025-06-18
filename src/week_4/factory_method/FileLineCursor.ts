import FileStorage from './FileStorage';
import readline from 'node:readline';

class Cursor {
  current: number;

  constructor() {
    const proto = Object.getPrototypeOf(this) as Cursor;
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
  query: Record<string, string>;
  // interface AsyncIterator<T, TReturn = any, TNext = any>
  lines: AsyncIterator<string, JSON, Record<string, string>>;

  constructor(fileStorage: FileStorage, query: Record<string, string>) {
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
          const data = JSON.parse(value) as Record<string, string>;
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

export default FileLineCursor;
