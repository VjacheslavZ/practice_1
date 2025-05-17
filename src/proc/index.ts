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

interface Config {
    populationColumnIndex: number;
    areaColumnIndex: number;
    densityColumnIndex: number;
    countryColumnIndex: number;
    interestColumnIndex: number;
    columnsPadsPositions: ('start' | 'end')[];
  }

const MOCK_DATA = `city,population,area,density,country
    Shanghai,24256800,6340,3826,China
    Delhi,16787941,1484,11313,India
    Lagos,16060303,1171,13712,Nigeria
    Istanbul,14160467,5461,2593,Turkey
    Tokyo,13513734,2191,6168,Japan
    Sao Paulo,12038175,1521,7914,Brazil
    Mexico City,8874724,1486,5974,Mexico
    London,8673713,1572,5431,United Kingdom
    New York City,8537673,784,10892,United States
    Bangkok,8280925,1569,5279,Thailand`;

const MOCK_DATA_2 = `
    Shanghai,24256800,6340,3826,China
    Delhi,16787941,1484,11313,India
    Lagos,16060303,1171,13712,Nigeria
    Istanbul,14160467,5461,2593,Turkey
    Tokyo,13513734,2191,6168,Japan
    Sao Paulo,12038175,1521,7914,Brazil
    Mexico City,8874724,1486,5974,Mexico
    London,8673713,1572,5431,United Kingdom
    New York City,8537673,784,10892,United States
    Bangkok,8280925,1569,5279,Thailand`.repeat(10000);

type TConvertData = (data: string) => string[][];
const convertData: TConvertData = (data) => {
    const lines = data.split('\n');
    const rows = lines.map((line) => line.trim().split(','));
    return rows;
};

type TGetMaxDensity = (data: string[][], densityColumnIndex: number) => number;
const getMaxDensity: TGetMaxDensity = (data, densityColumnIndex) =>
    Math.max(...data.map((row) => parseFloat(row[densityColumnIndex])));

type TAddDensityInterest = (
    data: string[][],
    maxDensity: number,
    densityColumnIndex: number
  ) => string[][];
const addDensityInterest: TAddDensityInterest = (data, maxDensity, densityColumnIndex) =>
    data.map((row) => {
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

    return data.map((row) => row.map((cell, cellIndex) => {
        const padType = config.columnsPadsPositions[cellIndex];
        const maxLength = longestByColumn[cellIndex];

        if (padType === 'end') {
            return cell.padEnd(maxLength);
        }
        return cell.padStart(maxLength);
    }));
};

type TPrintTable = (data: string[][]) => void;
const printTable: TPrintTable = (data) => {
    data.forEach((row) => {
        console.log(row.join(' '));
    });
};

type TMain = (payload: string, config: Config) => void;
const main: TMain = (payload, config) => {
    const { densityColumnIndex, interestColumnIndex } = config;

    const data = convertData(payload);
    data.shift();

    const maxDensity = getMaxDensity(data, densityColumnIndex);
    const withDensityInterest = addDensityInterest(data, maxDensity, densityColumnIndex);
    const sorted = withDensityInterest
        .sort((a, b) => Number(b[interestColumnIndex]) - Number(a[interestColumnIndex]));
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
