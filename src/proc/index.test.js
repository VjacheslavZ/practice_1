'use strict';
const test = require('node:test');
const { describe } = require('node:test');
const assert = require('node:assert');

const {
    convertData,
    getMaxDensity,
    addDensityInterest,
    addPadding,
    printTable,
    config,
} = require('./index.ts');

const MOCK_DATA = `city,population,area,density,country
    Shanghai,24256800,6340,3826,China
    New York City,8537673,784,10892,United States`;


describe('proc.js', () => {
    test('convertData', () => {
        const data = convertData(MOCK_DATA);
        assert.deepEqual(data, [
            ['city', 'population', 'area', 'density', 'country'],
            ['Shanghai', '24256800', '6340', '3826', 'China'],
            ['New York City', '8537673', '784', '10892', 'United States'],
        ]);
    });

    describe('main', () => {
        const data = convertData(MOCK_DATA);
        data.shift();

        test('getMaxDensity', () => {
            const maxDensity = getMaxDensity(data, 3);
            assert.equal(maxDensity, 10892);
        });
    
        test('addDensityInterest', () => {
            const maxDensity = getMaxDensity(data, 3);
            const withDensityInterest = addDensityInterest(data, maxDensity, 3);
            assert.deepEqual(withDensityInterest, [
                ['Shanghai', '24256800', '6340', '3826', 'China', '35'],
                ['New York City', '8537673', '784', '10892', 'United States', '100'],
            ]);
        });
    
        test('addPadding', () => {
            const withPadding = addPadding(data, config);
            assert.deepEqual(withPadding, [
                ['Shanghai     ', '24256800', '6340', ' 3826', '        China'],
                ['New York City', ' 8537673', ' 784', '10892', 'United States'],
            ]);
        });
    
        test('printTable', () => {
            const withPadding = addPadding(data, config);
            printTable(withPadding);

            const { log } = console;
            let logOutput = '';
            console.log = (msg) => {
                logOutput = msg;
            };
            printTable(withPadding);
            assert.equal(logOutput, 'New York City  8537673  784 10892 United States');
    
            console.log = log;
            console.log(logOutput);
        });
    })
});
