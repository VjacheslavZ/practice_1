import { IConfig } from './config';
import { Table } from './index';

class AbstractTableBuilder {
  constructor() {
    const proto = Object.getPrototypeOf(this);

    if (proto.constructor === AbstractTableBuilder) {
      throw new Error('Abstract class should not be instantiated');
    }
  }

  getInstance() {
    throw new Error('Method getInstance should be implemented');
  }

  findMaxDensity() {
    throw new Error('Method findMaxDensity should be implemented');
  }

  addDensityInterest() {
    throw new Error('Method addDensityInterest should be implemented');
  }

  sortByInterest() {
    throw new Error('Method sortByInterest should be implemented');
  }

  addPadding() {
    throw new Error('Method addPadding should be implemented');
  }

  print(_data?: string[][]) {
    throw new Error('Method print should be implemented');
  }
}

export class TableBuilder extends AbstractTableBuilder {
  instance: Table;

  constructor(data: string, config: IConfig) {
    super();
    this.instance = new Table(data, config);
  }

  getInstance() {
    return this.instance;
  }

  findMaxDensity() {
    const { densityColumnIndex } = this.instance.config;
    let maxDensity = 0;
    for (const line of this.instance.data) {
      const density = parseFloat(line[densityColumnIndex]);
      if (density > maxDensity) {
        maxDensity = density;
      }
    }
    this.instance.maxDensity = maxDensity;
  }

  addDensityInterest() {
    const { densityColumnIndex } = this.instance.config;

    const withDensityInterest = this.instance.data.map(row => {
      const density = parseFloat(row[densityColumnIndex]);
      const interest = Math.round(
        (density * 100) / this.instance.maxDensity,
      ).toString();
      return [...row, interest];
    });

    this.instance.data = withDensityInterest;
  }

  sortByInterest() {
    const sorted = this.instance.data.toSorted(
      (a, b) =>
        Number(b[this.instance.config.interestColumnIndex]) -
        Number(a[this.instance.config.interestColumnIndex]),
    );
    this.instance.data = sorted;
  }

  addPadding() {
    const columns = this.instance.data[0].length;
    const longestByColumn: number[] = [];

    for (let col = 0; col < columns; col++) {
      let longestValue = this.instance.data[0][col];

      for (let row = 1; row < this.instance.data.length; row++) {
        const currentValue = this.instance.data[row][col];
        const isLonger = currentValue.length > longestValue.length;
        if (isLonger) {
          longestValue = currentValue;
        }
      }
      longestByColumn.push(longestValue.length);
    }

    const withPadding = this.instance.data.map(row =>
      row.map((cell, cellIndex) => {
        const padType = this.instance.config.columnsPadsPositions[cellIndex];
        const maxLength = longestByColumn[cellIndex];

        if (padType === 'end') {
          return cell.padEnd(maxLength);
        }
        return cell.padStart(maxLength);
      }),
    );

    return withPadding;
  }

  print(data = this.instance.data) {
    for (const row of data) {
      console.log(row.join(' '));
    }
  }
}
