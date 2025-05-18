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
const table = new TableBuilder(MOCK_DATA, config);
new TableBuilderDirector(table).createInstance();

const tablePrinter = new TablePrinterDirector(table);
tablePrinter.printWithPadding();
console.log('----');
tablePrinter.printWithoutPadding();

module.exports = { Table, config };
