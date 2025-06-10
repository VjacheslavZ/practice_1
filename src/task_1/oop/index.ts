'use strict';

import { MOCK_DATA } from '../mockData';
import { config } from './../config';
import { TableBuilder } from './TableBuilder';
import {
  TableBuilderDirector,
  TablePrinterDirector,
} from './TableBuilderDirector';

{
  const table = new TableBuilder(MOCK_DATA, config);
  new TableBuilderDirector(table).createInstance();

  const tablePrinter = new TablePrinterDirector(table);
  console.log('Print with padding');
  tablePrinter.printWithPadding();
  console.log('Print without padding');
  tablePrinter.printWithoutPadding();
}
