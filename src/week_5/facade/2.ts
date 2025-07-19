'use strict';
// Make implementation from 2-class.js compatible with Map interface and prepare .d.ts
class TimeoutCollection<K, V> {
  timeout: number;
  collection: Map<K, V>;
  timers: Map<K, NodeJS.Timeout>;

  constructor(timeout: number) {
    this.timeout = timeout;
    this.collection = new Map();
    this.timers = new Map();
  }

  set(key: K, value: V): void {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);
    const timeout = setTimeout(() => {
      this.delete(key);
    }, this.timeout);
    timeout.unref();
    this.collection.set(key, value);
    this.timers.set(key, timeout);
  }

  get(key: K): V | undefined {
    return this.collection.get(key);
  }

  delete(key: K): boolean {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);
    this.timers.delete(key);
    const isDeleted = this.collection.delete(key);
    return isDeleted;
  }

  has(key: K): boolean {
    return this.collection.has(key);
  }

  clear(): void {
    for (const [key, timer] of this.timers) {
      clearTimeout(timer);
      this.collection.delete(key);
      this.timers.delete(key);
    }
  }

  forEach(callback: (value: V, key: K, collection: Map<K, V>) => void): void {
    this.collection.forEach(callback);
  }

  keys(): MapIterator<K> {
    return this.collection.keys();
  }

  values(): MapIterator<V> {
    return this.collection.values();
  }

  entries(): MapIterator<[K, V]> {
    return this.collection.entries();
  }

  toArray(): [K, V][] {
    return [...this.collection.entries()];
  }

  [Symbol.iterator](): Iterator<[K, V]> {
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

hash.forEach((value, key, collection) => {
  console.log('forEach');
  console.log(value, key);
  console.log('collection', collection);
});

setTimeout(() => {
  hash.set('tre', 3);
  console.dir({ array: hash.entries() });

  setTimeout(() => {
    hash.set('quattro', 4);
    console.dir({ array: hash.entries() });
  }, 500);
}, 1500);
