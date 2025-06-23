import FileLineCursor from './FileLineCursor';
import FileStorage from './FileStorage';
import assert from 'node:assert';
import { describe, it } from 'node:test';

const storagePath = './storage.test.dat';

// Avoid use reading
// replace new FileStorage(storagePath) use interface

const testData = `{ "city": "Kiev", "name": "Glushkov" }
{ "city": "Roma", "name": "Marcus Aurelius" }
{ "city": "Shaoshan", "name": "Mao Zedong" }
{ "city": "Roma", "name": "Lucius Verus" }
{ "city": "London", "name": "Charles Dickens" }`;

describe('FileLineCursor', () => {
  const fileCursor = new FileLineCursor(new FileStorage(storagePath), {
    city: 'Roma',
  });

  it('should have a query', async () => {
    assert.deepEqual(fileCursor.query, { city: 'Roma' });
  });

  it('should filter records by single field query', async () => {
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
