'use strict';

// const MOCK_DATA = `city,population,area,density,country
//     Shanghai,24256800,6340,3826,China
//     Delhi,16787941,1484,11313,India
//     Lagos,16060303,1171,13712,Nigeria
//     Istanbul,14160467,5461,2593,Turkey
//     Tokyo,13513734,2191,6168,Japan
//     Sao Paulo,12038175,1521,7914,Brazil
//     Mexico City,8874724,1486,5974,Mexico
//     London,8673713,1572,5431,United Kingdom
//     New York City,8537673,784,10892,United States
//     Bangkok,8280925,1569,5279,Thailand`;

interface Config {
    populationColumnIndex: number;
    areaColumnIndex: number;
    densityColumnIndex: number;
    countryColumnIndex: number;
    interestColumnIndex: number;
    columnsPadsPositions: ('start' | 'end')[];
  }

import { MOCK_DATA } from '../mockData';

class Table {
    maxDensity = 0;
    data: string[][];
    config: Config;

    constructor(data: string, config: Config) {
        const lines = data.split('\n').map(line => line.split(','));
        lines.shift()

        this.data = lines;
        this.config = config;
    }

    getMaxDensity() {
        const { densityColumnIndex } = this.config;
        this.maxDensity = Math.max(...this.data.map(row => parseFloat(row[densityColumnIndex])));
        return this;
    }

    addDensityInterest() {
        const { densityColumnIndex } = this.config;

        this.data = this.data.map((row) => {
            const density = parseFloat(row[densityColumnIndex]);
            const interest = Math.round((density * 100) / this.maxDensity).toString();
            return [...row, interest];
        });
        return this;
    }

    sortByInterest() {
        this.data.sort((a, b) => Number(b[this.config.interestColumnIndex]) - Number(a[this.config.interestColumnIndex]));
        return this;
    }

    print() {    
        this.data.forEach((row) => {
            console.log(row.join(' '));
        });
        return this;
    }

    addPadding() {
        const columns = this.data[0].length;
        const longestByColumn: number[] = [];
    
        for (let col = 0; col < columns; col++) {
            let longestValue = this.data[0][col];
    
            for (let row = 1; row < this.data.length; row++) {
                const currentValue = this.data[row][col];
                const isLonger = currentValue.length > longestValue.length;
                if (isLonger) {
                    longestValue = currentValue;
                }
            }
            longestByColumn.push(longestValue.length);
        }
    
        this.data = this.data.map((row) => row.map((cell, cellIndex) => {
            const padType = this.config.columnsPadsPositions[cellIndex];
            const maxLength = longestByColumn[cellIndex];
    
            if (padType === 'end') {
                return cell.padEnd(maxLength);
            }
            return cell.padStart(maxLength);
        }));

        return this;
    };
}

const config: Config = {
    populationColumnIndex: 1,
    areaColumnIndex: 2,
    densityColumnIndex: 3,
    countryColumnIndex: 4,
    interestColumnIndex: 5,
    columnsPadsPositions: ['end', 'start', 'start', 'start', 'start', 'start'],
};

new Table(MOCK_DATA, config).getMaxDensity()
    .addDensityInterest()
    .sortByInterest()
    .addPadding()
    .print();

module.exports = {
    Table,
    config,
}