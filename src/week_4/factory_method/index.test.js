const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');
const assert = require('node:assert');
const readline = require('node:readline');

const { FileLineCursor, FileStorage } = require('./index');

const storagePath = './storage.test.dat';

describe('FileLineCursor', () => {
  describe('FileStorage', () => {
    const db = new FileStorage(storagePath);
    it('should have a fileName', async () => {
      assert.equal(db.fileName, storagePath);
    });
    it('should have a fileStream', async () => {
      assert.deepEqual(
        db.fileStream,
        fs.createReadStream(path.join(__dirname, storagePath)),
      );
    });
    it('should return a FileLineCursor instance', async () => {
      const cursor = db.select({ city: 'Roma' });
      assert.equal(cursor instanceof FileLineCursor, true);
    });
  });

  describe('FileLineCursor', () => {
    const fileCursor = new FileLineCursor(new FileStorage(storagePath), {
      city: 'Roma',
    });

    it('should have a query', async () => {
      assert.deepEqual(fileCursor.query, { city: 'Roma' });
    });

    it('should use query', async () => {
      const records = [];
      for await (const record of fileCursor) {
        records.push(record);
      }
      assert.deepEqual(records, [
        { city: 'Roma', name: 'Marcus Aurelius' },
        { city: 'Roma', name: 'Lucius Verus' },
      ]);
    });

    it('should read file by lines', async () => {
      const fileCursor = new FileLineCursor(new FileStorage(storagePath), {
        city: 'Roma',
      });

      const line1 = await fileCursor.lines.next();
      await fileCursor.lines.next();
      await fileCursor.lines.next();
      const line4 = await fileCursor.lines.next();
      const line5 = await fileCursor.lines.next();

      assert.deepEqual(line1, {
        done: false,
        value: '{ "city": "Kiev", "name": "Glushkov" }',
      });
      assert.deepEqual(line4, {
        done: false,
        value: '{ "city": "Roma", "name": "Lucius Verus" }',
      });

      assert.deepEqual(line5, {
        done: true,
        value: undefined,
      });
    });
  });
});
