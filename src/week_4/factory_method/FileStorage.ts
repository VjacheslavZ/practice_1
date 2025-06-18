import FileLineCursor from './FileLineCursor';
import fs from 'node:fs';
import path from 'node:path';

class Database {
  constructor() {
    const proto = Object.getPrototypeOf(this) as Database;
    if (proto.constructor === Database) {
      throw new Error('Abstract class should not be instanciated');
    }
  }

  select(_query: Record<string, string>): FileLineCursor {
    throw new Error('Method is not implemented');
  }
}

class FileStorage extends Database {
  fileName: string;
  fileStream: fs.ReadStream;

  constructor(fileName: string) {
    super();
    this.fileName = fileName;
    this.fileStream = fs.createReadStream(path.join(__dirname, fileName));
  }

  select(query: Record<string, string>): FileLineCursor {
    return new FileLineCursor(this, query);
  }
}

// module.exports = FileStorage;
export default FileStorage;
