import { TableBuilder } from './TableBuilder';

export class TableBuilderDirector {
  builder: TableBuilder;

  constructor(builder: TableBuilder) {
    this.builder = builder;
  }

  createInstance() {
    this.builder.findMaxDensity();
    this.builder.addDensityInterest();
    this.builder.sortByInterest();

    return this.builder.getInstance();
  }
}

export class TablePrinterDirector {
  builder: TableBuilder;

  constructor(builder: TableBuilder) {
    this.builder = builder;
  }

  printWithPadding() {
    const withPadding = this.builder.addPadding();
    this.builder.print(withPadding);
  }

  printWithoutPadding() {
    this.builder.print();
  }
}
