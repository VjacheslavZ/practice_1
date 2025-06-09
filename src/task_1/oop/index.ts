'use strict';

import { config } from '../config';
import { MOCK_DATA } from '../mockData';
import { TableBuilder } from './TableBuilder';
import {
  TableBuilderDirector,
  TablePrinterDirector,
} from './TableBuilderDirector';

{
  const table = new TableBuilder(MOCK_DATA, config);
  new TableBuilderDirector(table).createInstance();

  const tablePrinter = new TablePrinterDirector(table);
  console.log('--printWithPadding--');
  tablePrinter.printWithPadding();
  console.log('--printWithoutPadding--');
  tablePrinter.printWithoutPadding();
}
