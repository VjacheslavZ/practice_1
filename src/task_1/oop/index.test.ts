'use strict';

const { describe, test } = require('node:test');
const assert = require('node:assert');
const { config } = require('./config');
const { TableBuilder } = require('./TableBuilder');
const {
  TableBuilderDirector,
  TablePrinterDirector,
} = require('./TableBuilderDirector');

const MOCK_DATA = `city,population,area,density,country
    Shanghai,24256800,6340,3826,China
    New York City,8537673,784,10892,United States`;

describe('OOP variant', () => {
  describe('Test methods of TableBuilder', () => {
    const table = new TableBuilder(MOCK_DATA, config);
    test('Inti table', () => {
      assert.deepEqual(table.instance.data, [
        ['    Shanghai', '24256800', '6340', '3826', 'China'],
        ['    New York City', '8537673', '784', '10892', 'United States'],
      ]);
    });
    test('Get instance', () => {
      assert.equal(table.getInstance(), table.instance);
    });
    test('Find max density', () => {
      table.findMaxDensity();
      assert.equal(table.instance.maxDensity, 10892);
    });
    test('addDensityInterest', () => {
      table.addDensityInterest();
      assert.deepEqual(table.instance.data, [
        ['    Shanghai', '24256800', '6340', '3826', 'China', '35'],
        [
          '    New York City',
          '8537673',
          '784',
          '10892',
          'United States',
          '100',
        ],
      ]);
    });
    test('sortByInterest', () => {
      table.sortByInterest();
      assert.deepEqual(table.instance.data, [
        [
          '    New York City',
          '8537673',
          '784',
          '10892',
          'United States',
          '100',
        ],
        ['    Shanghai', '24256800', '6340', '3826', 'China', '35'],
      ]);
    });
    test('addPadding', () => {
      table.addPadding();
      assert.deepEqual(table.instance.data, [
        [
          '    New York City',
          '8537673',
          '784',
          '10892',
          'United States',
          '100',
        ],
        ['    Shanghai', '24256800', '6340', '3826', 'China', '35'],
      ]);
    });
    test('print', () => {
      const { log } = console;
      let logOutput = '';
      console.log = msg => {
        logOutput = msg;
      };

      table.print();
      assert.equal(logOutput, '    Shanghai 24256800 6340 3826 China 35');

      console.log = log;
      console.log(logOutput);
    });
  });
  describe('Test methods of TablePrinterDirector', () => {
    const table = new TableBuilder(MOCK_DATA, config);
    new TableBuilderDirector(table).createInstance();
    const tablePrinter = new TablePrinterDirector(table);

    test('Print with padding', () => {
      const { log } = console;
      let logOutput = '';
      console.log = msg => {
        logOutput += msg;
      };

      tablePrinter.printWithPadding();

      assert.equal(
        logOutput,
        '    New York City  8537673  784 10892 United States 100' +
          '    Shanghai      24256800 6340  3826         China  35',
      );

      console.log = log;
      console.log(logOutput);
    });
    test('Print without padding', () => {
      const { log } = console;
      let logOutput = '';
      console.log = msg => {
        logOutput += msg;
      };

      tablePrinter.printWithoutPadding();

      assert.equal(
        logOutput,
        '    New York City 8537673 784 10892 United States 100' +
          '    Shanghai 24256800 6340 3826 China 35',
      );

      console.log = log;
      console.log(logOutput);
    });
  });
});
