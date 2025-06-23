import { ReadStream } from 'node:fs';

export interface StorageInterface {
  fileName: string;
  fileStream: ReadStream;
  select(query: Record<string, string>): any;
}
