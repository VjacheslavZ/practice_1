'use strict';

class Person {
  constructor(name) {
    this.name = name;
  }

  static factory(name) {
    return new Person(name);
  }
}

const personFactory = Person.factory;

module.exports = { Person, personFactory };
