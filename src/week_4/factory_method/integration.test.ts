import FileLineCursor from './FileLineCursor';
import FileStorage from './FileStorage';
import assert from 'node:assert';
// import fs from 'node:fs';
// import path from 'node:path';
import { describe, it } from 'node:test';

const storagePath = './storage.test.dat';

describe('FileStorage', () => {
  const db = new FileStorage(storagePath);

  // it('should have a fileName', async () => {
  //   assert.equal(db.fileName, storagePath);
  // });

  // it('should have a fileStream', async () => {
  //   assert.equal(db.fileStream instanceof fs.ReadStream, true);
  // });

  it('should return a FileLineCursor instance', async () => {
    const cursor = db.select({ city: 'Roma' });
    assert.equal(cursor instanceof FileLineCursor, true);
  });
});
