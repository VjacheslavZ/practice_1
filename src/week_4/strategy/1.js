// Extract strategy selection mashinery from 3-function.js to reuse it for any strategy of certain format:
// Implement selectStrategy(strategy, name) returning function
// Reading certain behaviour from strategy collection do not use technique like this renderers[rendererName] || renderers.abstract
// Try to get strategy collection keys and check required key; in collection contains no key use abstract instead
'use strict';

const RENDERERS = {
  abstract: () => {
    console.log('Not implemented');
  },

  console: data => {
    console.table(data);
  },

  web: data => {
    const keys = Object.keys(data[0]);
    const line = row =>
      '<tr>' + keys.map(key => `<td>${row[key]}</td>`).join('') + '</tr>';
    const output = [
      '<table><tr>',
      keys.map(key => `<th>${key}</th>`).join(''),
      '</tr>',
      data.map(line).join(''),
      '</table>',
    ];
    console.log(output.join(''));
  },

  markdown: data => {
    const keys = Object.keys(data[0]);
    const line = row => '|' + keys.map(key => `${row[key]}`).join('|') + '|\n';
    const output = [
      '|',
      keys.map(key => `${key}`).join('|'),
      '|\n',
      '|',
      keys.map(() => '---').join('|'),
      '|\n',
      data.map(line).join(''),
    ];
    console.log(output.join(''));
  },
};

const selectStrategy = (strategy, name) => {
  const strategies = new Map(Object.entries(strategy));
  const renderer = strategies.get(name);
  if (!renderer) {
    return () => strategy['abstract']();
  }
  return data => renderer(data);
};

const png = selectStrategy(RENDERERS, 'png');
const con = selectStrategy(RENDERERS, 'console');
const web = selectStrategy(RENDERERS, 'web');
const mkd = selectStrategy(RENDERERS, 'markdown');

const persons = [
  { name: 'Marcus Aurelius', city: 'Rome', born: 121 },
  { name: 'Victor Glushkov', city: 'Rostov on Don', born: 1923 },
  { name: 'Ibn Arabi', city: 'Murcia', born: 1165 },
  { name: 'Mao Zedong', city: 'Shaoshan', born: 1893 },
  { name: 'Rene Descartes', city: 'La Haye en Touraine', born: 1596 },
];

console.group('Unknown Strategy:');
png(persons);
console.groupEnd();

console.group('\nConsoleRenderer:');
con(persons);
console.groupEnd();

console.group('\nWebRenderer:');
web(persons);
console.groupEnd();

console.group('\nMarkdownRenderer:');
mkd(persons);
console.groupEnd();
