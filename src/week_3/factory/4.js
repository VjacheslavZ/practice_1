'use strict';

class Product {
  constructor(value) {
    this.field = value;
  }
}

class Creator {
  constructor(Entity) {
    this.Entity = Entity;
  }
  factoryMethod(...args) {
    return new this.Entity(...args);
  }
}

// Usage
const productFactory = new Creator(Product);
console.dir(productFactory);
const product = productFactory.factoryMethod('value');
const product2 = productFactory.factoryMethod('value2');
console.dir(product);
console.dir(product2);

//w3 fix max, process next tick
