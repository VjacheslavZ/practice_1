import { config } from '../config';
import { Table } from './Table';
import {
  addDensityInterest,
  findMaxDensity,
  printTableWithPadding,
  sortByInterest,
  printTableWithoutPadding,
} from './utils';
import assert from 'node:assert';
import { describe, test } from 'node:test';

const MOCK_DATA = `city,population,area,density,country
    Shanghai,24256800,6340,3826,China
    New York City,8537673,784,10892,United States`;

describe('Test mixed solution', () => {
  test('Init table', () => {
    const table = new Table(MOCK_DATA);
    assert.deepEqual(table.getData(), [
      ['Shanghai', '24256800', '6340', '3826', 'China'],
      ['New York City', '8537673', '784', '10892', 'United States'],
    ]);
    assert.equal(table.getMaxDensity(), 0);
  });

  describe('Process table', () => {
    const table = new Table(MOCK_DATA);
    test('findMaxDensity and setMaxDensity', () => {
      const maxDensity = findMaxDensity(
        table.getData(),
        config.densityColumnIndex,
      );
      table.setMaxDensity(maxDensity);
      assert.equal(table.getMaxDensity(), 10892);
    });

    test('addDensityInterest', () => {
      const withDensityInterest = addDensityInterest(
        table.getData(),
        table.getMaxDensity(),
        config.densityColumnIndex,
      );

      table.setData(withDensityInterest);
      assert.deepEqual(table.getData(), [
        ['Shanghai', '24256800', '6340', '3826', 'China', '35'],
        ['New York City', '8537673', '784', '10892', 'United States', '100'],
      ]);
    });

    test('sortByInterest', () => {
      const sorted = sortByInterest(
        table.getData(),
        config.interestColumnIndex,
      );
      table.setData(sorted);
      assert.deepEqual(table.getData(), [
        ['New York City', '8537673', '784', '10892', 'United States', '100'],
        ['Shanghai', '24256800', '6340', '3826', 'China', '35'],
      ]);
    });

    describe('Print table functions', () => {
      test('printTableWithPadding', () => {
        const { log } = console;
        let logOutput = '';
        console.log = msg => {
          logOutput += msg;
        };

        printTableWithPadding(table);

        console.log = log;

        assert.equal(
          logOutput,
          'New York City  8537673  784 10892 United States 100' +
            'Shanghai      24256800 6340  3826         China  35',
        );
      });

      test('printTableWithoutPadding', () => {
        const { log } = console;
        let logOutput = '';
        console.log = msg => {
          logOutput += msg;
        };

        printTableWithoutPadding(table);

        console.log = log;
        console.log(logOutput);

        assert.equal(
          logOutput,
          'New York City 8537673 784 10892 United States 100' +
            'Shanghai 24256800 6340 3826 China 35',
        );
      });
    });
  });
});
