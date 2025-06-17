const fs = require('node:fs');
const path = require('node:path');

const FileLineCursor = require('./FileLineCursor');

class Database {
  constructor() {
    const proto = Object.getPrototypeOf(this);
    if (proto.constructor === Database) {
      throw new Error('Abstract class should not be instanciated');
    }
  }

  select() {
    throw new Error('Method is not implemented');
  }
}

class FileStorage extends Database {
  constructor(fileName) {
    super();
    this.fileName = fileName;
    this.fileStream = fs.createReadStream(path.join(__dirname, fileName));
  }

  select(query) {
    return new FileLineCursor(this, query);
  }
}

module.exports = FileStorage;
