export interface IConfig {
  populationColumnIndex: number;
  areaColumnIndex: number;
  densityColumnIndex: number;
  countryColumnIndex: number;
  interestColumnIndex: number;
  columnsPadsPositions: ('start' | 'end')[];
}

export const config: IConfig = {
  populationColumnIndex: 1,
  areaColumnIndex: 2,
  densityColumnIndex: 3,
  countryColumnIndex: 4,
  interestColumnIndex: 5,
  columnsPadsPositions: ['end', 'start', 'start', 'start', 'start', 'start'],
};
