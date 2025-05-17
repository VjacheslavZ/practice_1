type Row = [string, number, number, number, string];
type RowWithDensityInterest = [string, number, number, number, string, number];

interface Config {
  populationColumnIndex: number;
  areaColumnIndex: number;
  densityColumnIndex: number;
  countryColumnIndex: number;
  interestColumnIndex: number;
  columnsDataTypes: string[];
  columnsPadsPositions: ('start' | 'end')[];
}

export declare const MOCK_DATA: string;

export declare function convertData(data: string): string[][];

export declare function getMaxDensity(data: string[][], densityColumnIndex: number): number;

export declare function addDensityInterest(
  data: string[][],
  maxDensity: number,
  densityColumnIndex: number
): string[][];

export declare function addPadding(data: string[][], config: Config): string[][];

export declare function printTable(data: string[][]): void;

export declare function main(payload: string, config: Config): void;