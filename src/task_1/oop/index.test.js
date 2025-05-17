'use strict';

const { describe, test } = require('node:test');
const assert = require('node:assert');

const { Table, config } = require('./index.ts');

const MOCK_DATA = `city,population,area,density,country
    Shanghai,24256800,6340,3826,China
    New York City,8537673,784,10892,United States`;

describe('oop.js', () => {
  const table = new Table(MOCK_DATA, config);
  test('Inti table', () => {
    assert.deepEqual(table.data, [
      ['    Shanghai', '24256800', '6340', '3826', 'China'],
      ['    New York City', '8537673', '784', '10892', 'United States'],
    ]);
  });
  test('getMaxDensity', () => {
    table.getMaxDensity();
    assert.equal(table.maxDensity, 10892);
  });
  test('addDensityInterest', () => {
    table.addDensityInterest();
    assert.deepEqual(table.data, [
      ['    Shanghai', '24256800', '6340', '3826', 'China', '35'],
      ['    New York City', '8537673', '784', '10892', 'United States', '100'],
    ]);
  });
  test('sortByInterest', () => {
    table.sortByInterest();
    assert.deepEqual(table.data, [
      ['    New York City', '8537673', '784', '10892', 'United States', '100'],
      ['    Shanghai', '24256800', '6340', '3826', 'China', '35'],
    ]);
  });
  test('addPadding', () => {
    table.addPadding();
    assert.deepEqual(table.data, [
      [
        '    New York City',
        ' 8537673',
        ' 784',
        '10892',
        'United States',
        '100',
      ],
      [
        '    Shanghai     ',
        '24256800',
        '6340',
        ' 3826',
        '        China',
        ' 35',
      ],
    ]);
  });
  test('print', () => {
    const { log } = console;
    let logOutput = '';
    console.log = msg => {
      logOutput = msg;
    };

    table.print();
    assert.equal(
      logOutput,
      '    Shanghai      24256800 6340  3826         China  35',
    );

    console.log = log;
    console.log(logOutput);
  });
});
