export class Table {
  maxDensity = 0;
  data: string[][];

  constructor(data: string) {
    const lines = data.split('\n').map(line => line.trim().split(','));
    lines.shift();

    this.data = lines;
  }

  getData(): string[][] {
    return this.data;
  }

  setData(data: string[][]): void {
    this.data = data;
  }

  setMaxDensity(maxDensity: number): void {
    this.maxDensity = maxDensity;
  }

  getMaxDensity(): number {
    return this.maxDensity;
  }
}
