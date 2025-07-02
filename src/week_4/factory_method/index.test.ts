import LineCursor from './LineCursor';
import assert from 'node:assert';
import { Readable } from 'node:stream';
import { describe, it } from 'node:test';

const data = [
  JSON.stringify({ city: 'Kiev', name: 'Glushkov' }),
  JSON.stringify({ city: 'Roma', name: 'Marcus Aurelius' }),
  JSON.stringify({ city: 'Shaoshan', name: 'Mao Zedong' }),
  JSON.stringify({ city: 'Roma', name: 'Lucius Verus' }),
].join('\n');

describe('LineCursor', () => {
  describe('Query functionality', () => {
    it('Should filter records by single field query', async () => {
      const stream = Readable.from(data);
      const storage = { stream };
      const cursor = new LineCursor(storage, { city: 'Roma' });

      const records = [];
      for await (const record of cursor) {
        records.push(record);
      }

      assert.deepEqual(records, [
        { city: 'Roma', name: 'Marcus Aurelius' },
        { city: 'Roma', name: 'Lucius Verus' },
      ]);
    });

    it('Should filter records by multiple field query', async () => {
      const stream = Readable.from(data);
      const storage = { stream };

      const cursor = new LineCursor(storage, {
        city: 'Roma',
        name: 'Marcus Aurelius',
      });

      const records = [];
      for await (const record of cursor) {
        records.push(record);
      }

      assert.deepEqual(records, [{ city: 'Roma', name: 'Marcus Aurelius' }]);
    });

    it('Should return empty array for non-matching query', async () => {
      const stream = Readable.from(data);
      const storage = { stream };
      const cursor = new LineCursor(storage, { city: 'Not existent' });

      const records = [];
      for await (const record of cursor) {
        records.push(record);
      }

      assert.deepEqual(records, []);
    });

    it('Should return all records for empty query', async () => {
      const stream = Readable.from(data);
      const storage = { stream };
      const cursor = new LineCursor(storage, {});

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
});
