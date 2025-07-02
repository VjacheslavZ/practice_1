import FileStorage from './FileStorage';

const main = async () => {
  const db = new FileStorage('./storage.dat');
  const cursor = db.select({ city: 'Roma', name: 'Marcus Aurelius' });

  for await (const record of cursor) {
    console.dir(record);
  }
};
main();
