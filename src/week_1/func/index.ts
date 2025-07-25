import { config, IConfig } from '../config';
import { MOCK_DATA } from '../mockData';
import { pipe, TRows } from './utils';

type TAddPadding = (
  columnsPadsPositions: IConfig['columnsPadsPositions'],
) => (data: TRows) => TRows;
type TPrintTable = (data: TRows) => void;

const convertData = (data: string): TRows =>
  data.split('\n').map(line => line.trim().split(','));

const removeHeader = (data: TRows) => data.slice(1);

type TGetMaxDensity = (densityColumnIndex: number, data: TRows) => number;
const getMaxDensity: TGetMaxDensity = (densityColumnIndex, data) => {
  let maxValue = 0;
  for (const row of data) {
    const value = parseFloat(row[densityColumnIndex]);
    if (value > maxValue) {
      maxValue = value;
    }
  }
  return maxValue;
};

type TAddDensityInterest = (
  densityColumnIndex: number,
) => (data: TRows) => TRows;
const addDensityInterest: TAddDensityInterest = densityColumnIndex => data => {
  return data.map(row => {
    const density = parseFloat(row[densityColumnIndex]);
    const interest = Math.round(
      (density * 100) / getMaxDensity(densityColumnIndex, data),
    ).toString();
    return [...row, interest];
  });
};

const sortByInterest = (data: string[][]) =>
  data.toSorted(
    (a, b) =>
      Number(b[config.interestColumnIndex]) -
      Number(a[config.interestColumnIndex]),
  );

const addPadding: TAddPadding = columnsPadsPositions => data => {
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

  const result: TRows = [];
  for (const row of data) {
    const newRow: string[] = [];

    for (const [cellIndex, cell] of row.entries()) {
      const padType = columnsPadsPositions[cellIndex];
      const maxLength = longestByColumn[cellIndex];

      newRow.push(
        padType === 'end' ? cell.padEnd(maxLength) : cell.padStart(maxLength),
      );
    }

    result.push(newRow);
  }

  return result;
};

const printTable: TPrintTable = data => {
  for (const row of data) {
    console.log(row.join(' '));
  }
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

module.exports = {
  convertData,
  removeHeader,
  addDensityInterest,
  sortByInterest,
  addPadding,
  printTable,
};
