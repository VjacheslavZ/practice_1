'use strict';
// Tasks for rewriting:
//   - Watch week 1 lectures about SoC, SRP, code characteristics, V8
//   - Apply optimizations of computing resources: processor, memory
//   - Minimize cognitive complexity
//   - Respect SRP and SoC
//   - Improve readability (understanding), reliability
//   - Optimize for maintainability, reusability, flexibility
//   - Make code testable
//   - Implement simple unittests without frameworks
// Additional tasks:
//   - Try to implement in multiple paradigms: OOP, FP, procedural, mixed
//   - Prepare load testing and trace V8 deopts

import { MOCK_DATA } from '../mockData';

interface Config {
  populationColumnIndex: number;
  areaColumnIndex: number;
  densityColumnIndex: number;
  countryColumnIndex: number;
  interestColumnIndex: number;
  columnsPadsPositions: ('start' | 'end')[];
}

type TConvertData = (data: string) => string[][];
const convertData: TConvertData = data => {
  const lines = data.split('\n');
  const rows = lines.map(line => line.trim().split(','));
  return rows;
};

type TGetMaxDensity = (data: string[][], densityColumnIndex: number) => number;
const getMaxDensity: TGetMaxDensity = (data, densityColumnIndex) =>
  Math.max(...data.map(row => parseFloat(row[densityColumnIndex])));

type TAddDensityInterest = (
  data: string[][],
  maxDensity: number,
  densityColumnIndex: number,
) => string[][];
const addDensityInterest: TAddDensityInterest = (
  data,
  maxDensity,
  densityColumnIndex,
) =>
  data.map(row => {
    const density = parseFloat(row[densityColumnIndex]);
    const interest = Math.round((density * 100) / maxDensity).toString();
    return [...row, interest];
  });

type TAddPadding = (data: string[][], config: Config) => string[][];
const addPadding: TAddPadding = (data, config) => {
  const columns = data[0].length;
  const longestByColumn: number[] = [];

  for (let col = 0; col < columns; col++) {
    let longestValue = data[0][col];

    for (let row = 1; row < data.length; row++) {
      const currentValue = data[row][col];
      const isLonger = currentValue.length > longestValue.length;
      if (isLonger) {
        longestValue = currentValue;
      }
    }
    longestByColumn.push(longestValue.length);
  }

  return data.map(row =>
    row.map((cell, cellIndex) => {
      const padType = config.columnsPadsPositions[cellIndex];
      const maxLength = longestByColumn[cellIndex];

      if (padType === 'end') {
        return cell.padEnd(maxLength);
      }
      return cell.padStart(maxLength);
    }),
  );
};

type TPrintTable = (data: string[][]) => void;
const printTable: TPrintTable = data => {
  data.forEach(row => {
    console.log(row.join(' '));
  });
};

type TMain = (payload: string, config: Config) => void;
const main: TMain = (payload, config) => {
  const { densityColumnIndex, interestColumnIndex } = config;

  const data = convertData(payload);
  data.shift();

  const maxDensity = getMaxDensity(data, densityColumnIndex);
  const withDensityInterest = addDensityInterest(
    data,
    maxDensity,
    densityColumnIndex,
  );
  const sorted = withDensityInterest.sort(
    (a, b) => Number(b[interestColumnIndex]) - Number(a[interestColumnIndex]),
  );
  const withPadding = addPadding(sorted, config);
  printTable(withPadding);
};

const config: Config = {
  populationColumnIndex: 1,
  areaColumnIndex: 2,
  densityColumnIndex: 3,
  countryColumnIndex: 4,
  interestColumnIndex: 5,
  columnsPadsPositions: ['end', 'start', 'start', 'start', 'start', 'start'],
};

main(MOCK_DATA, config);

module.exports = {
  convertData,
  getMaxDensity,
  addDensityInterest,
  addPadding,
  printTable,
  config,
};
