import LineCursor from './LineCursor';
import fs from 'node:fs';
import path from 'node:path';

class Database {
  constructor() {
    const proto = Object.getPrototypeOf(this) as Database;
    if (proto.constructor === Database) {
      throw new Error('Abstract class should not be instanciated');
    }
  }

  select(_query: Record<string, string>): LineCursor {
    throw new Error('Method is not implemented');
  }
}

class FileStorage extends Database {
  fileName: string;
  stream: fs.ReadStream;

  constructor(fileName: string) {
    super();
    this.fileName = fileName;
    this.stream = fs.createReadStream(path.join(__dirname, fileName));
  }

  select(query: Record<string, string>): LineCursor {
    return new LineCursor(this, query);
  }
}

export default FileStorage;
