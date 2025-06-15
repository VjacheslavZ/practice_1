'use strict';
const { describe, test } = require('node:test');
const assert = require('node:assert');

const { pipe } = require('./utils');
const { config } = require('../config');
const {
  convertData,
  removeHeader,
  addDensityInterest,
  sortByInterest,
  addPadding,
  printTable,
} = require('./index.ts');

const MOCK_DATA = `city,population,area,density,country
    Shanghai,24256800,6340,3826,China
    New York City,8537673,784,10892,United States`;

describe('Test pipe functions with mock data and functions flow', () => {
  test('Data conversion', () => {
    const main = pipe(convertData);
    assert.deepEqual(main(MOCK_DATA), [
      ['city', 'population', 'area', 'density', 'country'],
      ['Shanghai', '24256800', '6340', '3826', 'China'],
      ['New York City', '8537673', '784', '10892', 'United States'],
    ]);
  });

  test('Remove header from data', () => {
    const main = pipe(convertData, removeHeader);
    assert.deepEqual(main(MOCK_DATA), [
      ['Shanghai', '24256800', '6340', '3826', 'China'],
      ['New York City', '8537673', '784', '10892', 'United States'],
    ]);
  });

  test('Add density interest to data', () => {
    const main = pipe(
      convertData,
      removeHeader,
      addDensityInterest(config.densityColumnIndex),
    );
    assert.deepEqual(main(MOCK_DATA), [
      ['Shanghai', '24256800', '6340', '3826', 'China', '35'],
      ['New York City', '8537673', '784', '10892', 'United States', '100'],
    ]);
  });

  test('Sort data by interest', () => {
    const main = pipe(
      convertData,
      removeHeader,
      addDensityInterest(config.densityColumnIndex),
      sortByInterest,
    );
    assert.deepEqual(main(MOCK_DATA), [
      ['New York City', '8537673', '784', '10892', 'United States', '100'],
      ['Shanghai', '24256800', '6340', '3826', 'China', '35'],
    ]);
  });

  test('Add padding to data', () => {
    const main = pipe(
      convertData,
      removeHeader,
      addDensityInterest(config.densityColumnIndex),
      sortByInterest,
      addPadding(config.columnsPadsPositions),
    );
    assert.deepEqual(main(MOCK_DATA), [
      ['New York City', ' 8537673', ' 784', '10892', 'United States', '100'],
      ['Shanghai     ', '24256800', '6340', ' 3826', '        China', ' 35'],
    ]);
  });

  test('Test print table last line', () => {
    const { log } = console;
    let logOutput = '';
    console.log = msg => {
      logOutput = msg;
    };

    const main = pipe(
      convertData,
      removeHeader,
      addDensityInterest(config.densityColumnIndex),
      sortByInterest,
      addPadding(config.columnsPadsPositions),
      printTable,
    );
    main(MOCK_DATA);

    assert.equal(
      logOutput,
      'Shanghai      24256800 6340  3826         China  35',
    );

    console.log = log;
    console.log(logOutput);
  });
});
