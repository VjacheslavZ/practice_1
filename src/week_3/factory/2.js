'use strict';

class Person {
  constructor(name) {
    this.name = name;
  }
}

const personFactory = name => {
  return new Person(name);
};

module.exports = { Person, personFactory };
