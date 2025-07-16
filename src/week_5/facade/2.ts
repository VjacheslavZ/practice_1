'use strict';
// Make implementation from 2-class.js compatible with Map interface and prepare .d.ts
class TimeoutCollection<T> {
  timeout: number;
  collection: Map<string, T>;
  timers: Map<string, NodeJS.Timeout>;

  constructor(timeout: number) {
    this.timeout = timeout;
    this.collection = new Map();
    this.timers = new Map();
  }

  set(key: string, value: T): void {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);
    const timeout = setTimeout(() => {
      this.delete(key);
    }, this.timeout);
    timeout.unref();
    this.collection.set(key, value);
    this.timers.set(key, timeout);
  }

  get(key: string): T | undefined {
    return this.collection.get(key);
  }

  delete(key: string): boolean {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);
    this.timers.delete(key);
    const isDeleted = this.collection.delete(key);
    return isDeleted;
  }

  has(key: string): boolean {
    return this.collection.has(key);
  }

  clear(): void {
    for (const [key, timer] of this.timers) {
      clearTimeout(timer);
      this.collection.delete(key);
      this.timers.delete(key);
    }
  }

  forEach(
    callback: (value: T, key: string, collection: Map<string, T>) => void,
  ): void {
    this.collection.forEach(callback);
  }

  keys(): MapIterator<string> {
    return this.collection.keys();
  }

  values(): MapIterator<T> {
    return this.collection.values();
  }

  entries(): MapIterator<[string, T]> {
    return this.collection.entries();
  }

  toArray(): [string, T][] {
    return [...this.collection.entries()];
  }

  [Symbol.iterator](): Iterator<[string, T]> {
    return this.collection[Symbol.iterator]();
  }
}

// Usage
const hash = new TimeoutCollection(1000);
hash.set('uno', 1);
console.dir({ array: hash.entries() });

hash.set('due', 2);
console.dir({ array: hash.entries() });

console.log('has', hash.has('uno'));

console.log('get', hash.get('uno'));

console.log('entries', hash.entries());

console.log('keys', hash.keys().next());

console.log('values', hash.values().next());

console.log('entries', hash.entries());

console.log('delete', hash.delete('uno'));

const iterator = hash[Symbol.iterator]();
console.log('Iterator', iterator.next());

hash.forEach(
  (value: unknown, key: string, collection: Map<string, unknown>) => {
    console.log('forEach');
    console.log(value, key);
    console.log('collection', collection);
  },
);

setTimeout(() => {
  hash.set('tre', 3);
  console.dir({ array: hash.entries() });

  setTimeout(() => {
    hash.set('quattro', 4);
    console.dir({ array: hash.entries() });
  }, 500);
}, 1500);
