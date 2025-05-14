'use strict';

// Tasks for rewriting:
//   - Apply optimizations of computing resources: processor, memory
//   - Minimize cognitive complexity
//   - Respect SRP and SoC
//   - Improve readability (understanding), reliability
//   - Optimize for maintainability, reusability, flexibility
//   - Make code testable
//   - Implement simple unittests without frameworks
//   - Try to implement in multiple paradigms: OOP, FP, procedural, mixed
type Row = [string, number, number, number, string];
type RowWithDensityInterest = [string, number, number, number, string, number];

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

const convertStringToArray = (data: string): string[][] => {
    const lines = data.split('\n'); 
    return lines.map((line) => line.trim().split(','));
}
const convertStringToNumber = (data: string[][]): Row[] => {
    return data.map((row) => {
        return [row[0], parseInt(row[1]), parseInt(row[2]), parseInt(row[3]), row[4]]
    })
}
const getMaxDensity = (data: Row[]): number => Math.max(...data.map((row) => row[3]));

const addDensityInterest = (data: Row[], maxDensity: number): RowWithDensityInterest[] => {
    return data.map((row) => {
        const density = row[3];
        const interest = Math.round((density * 100) / maxDensity);
        return [...row, interest] ;
    })
}

const main = (payload: string) => {
    const data = convertStringToArray(payload);
    const TABLE_HEADER = data.shift();
    const countriesData = convertStringToNumber(data);
    const maxDensity = getMaxDensity(countriesData);
    const countriesWithDensityInterest = addDensityInterest(countriesData, maxDensity).sort((a, b) => b[5] - a[5]);

    console.log({TABLE_HEADER});
    console.log({countriesData});
    console.log({maxDensity});
    console.log({countriesWithDensityInterest});

    for (const row of countriesWithDensityInterest) {
        const city = row[0];
        const population = row[1];
        const area = row[2];
        const density = row[3];
        const country = row[4];
        const interest = row[5];
        console.log(`${city} ${population} ${area} ${density} ${country} ${interest}`);
    }
};

const config = {
    density: {
        pad: 'padStart',
        index: 3,
        type: 'number'
    }
}
main(MOCK_DATA);
