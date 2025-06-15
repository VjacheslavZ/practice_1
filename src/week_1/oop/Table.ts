import { IConfig } from '../config';

export class Table {
  maxDensity = 0;
  data: string[][];
  config: IConfig;

  constructor(data: string, config: IConfig) {
    const lines = data.split('\n').map(line => line.split(','));
    lines.shift();

    this.data = lines;
    this.config = config;
  }
}
