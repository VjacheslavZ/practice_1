import { config, IConfig } from '../config';
import { MOCK_DATA } from '../mockData';
import { pipe, TRows } from './utils';

type TAddPadding = (
  columnsPadsPositions: IConfig['columnsPadsPositions'],
) => (data: TRows) => TRows;
type TPrintTable = (data: TRows) => void;

const convertData = (data: string) =>
  data.split('\n').map(line => line.trim().split(','));

const removeHeader = (data: TRows) => data.slice(1);

type TGetMaxDensity = (densityColumnIndex: number) => (data: TRows) => number;
const getMaxDensity: TGetMaxDensity = densityColumnIndex => data =>
  Math.max(...data.map(row => parseFloat(row[densityColumnIndex])));

type TAddDensityInterest = (
  densityColumnIndex: number,
) => (maxDensity: number) => (data: TRows) => TRows;
const addDensityInterest: TAddDensityInterest =
  densityColumnIndex => maxDensity => data =>
    data.map(row => {
      const density = parseFloat(row[densityColumnIndex]);
      const interest = Math.round((density * 100) / maxDensity).toString();
      return [...row, interest];
    });

const sorted = (data: string[][]) =>
  data.sort(
    (a, b) =>
      Number(b[config.interestColumnIndex]) -
      Number(a[config.interestColumnIndex]),
  );

const rawData = pipe(convertData, removeHeader)(MOCK_DATA);
const maxDensity = getMaxDensity(config.densityColumnIndex)(rawData);

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

  return data.map(row =>
    row.map((cell, cellIndex) => {
      const padType = columnsPadsPositions[cellIndex];
      const maxLength = longestByColumn[cellIndex];

      if (padType === 'end') {
        return cell.padEnd(maxLength);
      }
      return cell.padStart(maxLength);
    }),
  );
};

const printTable: TPrintTable = data => {
  for (const row of data) {
    console.log(row.join(' '));
  }
};

const main = pipe(
  addDensityInterest(config.densityColumnIndex)(maxDensity),
  sorted,
  addPadding(config.columnsPadsPositions),
  printTable,
);
main(rawData);
