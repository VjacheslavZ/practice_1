'use strict';

import { IConfig, config } from '../config';
import { MOCK_DATA } from '../mockData';
import { TableBuilder } from './TableBuilder';
import {
  TableBuilderDirector,
  TablePrinterDirector,
} from './TableBuilderDirector';

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

// Usage
const builder = new TableBuilder(MOCK_DATA, config);
const director = new TableBuilderDirector(builder);
director.createInstance();

const printer = new TablePrinterDirector(builder);
printer.printWithPadding();
console.log('----');
printer.printWithoutPadding();

module.exports = { Table, config };
