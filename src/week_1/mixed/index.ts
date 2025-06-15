import { config } from '../config';
import { MOCK_DATA } from '../mockData';
import { Table } from './Table';
import {
  findMaxDensity,
  addDensityInterest,
  sortByInterest,
  printTableWithPadding,
  printTableWithoutPadding,
} from './utils';

const processTable = (table: Table): void => {
  const maxDensity = findMaxDensity(table.getData(), config.densityColumnIndex);
  table.setMaxDensity(maxDensity);

  const withInterest = addDensityInterest(
    table.getData(),
    table.getMaxDensity(),
    config.densityColumnIndex,
  );

  const sorted = sortByInterest(withInterest, config.interestColumnIndex);
  table.setData(sorted);
};

const main = (): void => {
  const table = new Table(MOCK_DATA);
  processTable(table);

  console.log('=== Table with Padding ===');
  printTableWithPadding(table);

  console.log('=== Table without Padding ===');
  printTableWithoutPadding(table);
};

main();
