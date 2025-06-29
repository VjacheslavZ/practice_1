'use strict';

class Product {
  constructor(value) {
    this.field = value;
  }
}

class Creator {
  #args;
  constructor(Entity, ...args) {
    this.Entity = Entity;
    this.#args = args;
  }
  factoryMethod() {
    return new this.Entity(...this.#args);
  }
}

// Usage
const productFactory = new Creator(Product, 'value');
const product = productFactory.factoryMethod();
