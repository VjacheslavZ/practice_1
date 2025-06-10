import { config } from '../config';
import { Table } from './Table';

type TFindMaxDensity = (data: string[][], densityColumnIndex: number) => number;
const findMaxDensity: TFindMaxDensity = (data, densityColumnIndex) => {
  let maxDensity = 0;
  for (const row of data) {
    const density = parseFloat(row[densityColumnIndex]);
    if (density > maxDensity) {
      maxDensity = density;
    }
  }
  return maxDensity;
};

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

type TSortByInterest = (
  data: string[][],
  interestColumnIndex: number,
) => string[][];
const sortByInterest: TSortByInterest = (data, interestColumnIndex) =>
  data.toSorted(
    (a, b) => Number(b[interestColumnIndex]) - Number(a[interestColumnIndex]),
  );

type TAddPadding = (
  data: string[][],
  columnsPadsPositions: ('start' | 'end')[],
) => string[][];
const addPadding: TAddPadding = (data, columnsPadsPositions) => {
  const columns = data[0].length;
  const longestByColumn: number[] = [];

  for (let col = 0; col < columns; col++) {
    let longestValue = data[0][col];
    for (let row = 1; row < data.length; row++) {
      const currentValue = data[row][col];
      if (currentValue.length > longestValue.length) {
        longestValue = currentValue;
      }
    }
    longestByColumn.push(longestValue.length);
  }

  return data.map(row =>
    row.map((cell, cellIndex) => {
      const padType = columnsPadsPositions[cellIndex];
      const maxLength = longestByColumn[cellIndex];
      return padType === 'end'
        ? cell.padEnd(maxLength)
        : cell.padStart(maxLength);
    }),
  );
};

type TPrintTable = (data: string[][]) => void;
const printTable: TPrintTable = data => {
  data.forEach(row => console.log(row.join(' ')));
};

const printTableWithPadding = (table: Table): void => {
  const withPadding = addPadding(table.getData(), config.columnsPadsPositions);
  printTable(withPadding);
};

const printTableWithoutPadding = (table: Table): void =>
  printTable(table.getData());

export {
  findMaxDensity,
  addDensityInterest,
  sortByInterest,
  addPadding,
  printTable,
  printTableWithPadding,
  printTableWithoutPadding,
};
