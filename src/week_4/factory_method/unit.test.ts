import FileLineCursor from './FileLineCursor';
import FileStorage from './FileStorage';
import assert from 'node:assert';
import { describe, it } from 'node:test';

const storagePath = './storage.test.dat';

// Avoid use reading
// replace new FileStorage(storagePath) use interface

describe('FileLineCursor', () => {
  describe('Query functionality', () => {
    it('should filter records by single field query', async () => {
      const fileStorage = new FileStorage(storagePath);
      const cursor = new FileLineCursor(fileStorage, { city: 'Roma' });

      const records = [];
      for await (const record of cursor) {
        records.push(record);
      }

      assert.deepEqual(records, [
        { city: 'Roma', name: 'Marcus Aurelius' },
        { city: 'Roma', name: 'Lucius Verus' },
      ]);
    });

    it('should filter records by multiple field query', async () => {
      const fileStorage = new FileStorage(storagePath);
      const cursor = new FileLineCursor(fileStorage, {
        city: 'Roma',
        name: 'Marcus Aurelius',
      });

      const records = [];
      for await (const record of cursor) {
        records.push(record);
      }

      assert.deepEqual(records, [{ city: 'Roma', name: 'Marcus Aurelius' }]);
    });

    it('should return empty array for non-matching query', async () => {
      const fileStorage = new FileStorage(storagePath);
      const cursor = new FileLineCursor(fileStorage, { city: 'NonExistent' });

      const records = [];
      for await (const record of cursor) {
        records.push(record);
      }

      assert.deepEqual(records, []);
    });

    it('should return all records for empty query', async () => {
      const fileStorage = new FileStorage(storagePath);
      const cursor = new FileLineCursor(fileStorage, {});

      const records = [];
      for await (const record of cursor) {
        records.push(record);
      }

      assert.deepEqual(records, [
        {
          city: 'Kiev',
          name: 'Glushkov',
        },
        {
          city: 'Roma',
          name: 'Marcus Aurelius',
        },
        {
          city: 'Shaoshan',
          name: 'Mao Zedong',
        },
        {
          city: 'Roma',
          name: 'Lucius Verus',
        },
      ]);
    });
  });

  describe('Iterator functionality', () => {
    it('Should use async iterator correctly', async () => {
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
