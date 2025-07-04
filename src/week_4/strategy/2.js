// Rewrite example from 3-function.js to decouple strategy implementation and console
// Resurn string from all strategy implementations
// Here is an example: console.log(png(persons))
const { Console } = require('node:console');
const { Writable } = require('node:stream');

const RENDERERS = {
  abstract: () => {
    return 'Not implemented';
  },

  console: data => {
    let stringOutput = '';

    const stdout = new Writable({
      write(chunk) {
        stringOutput += chunk.toString();
      },
    });
    const logger = new Console({ stdout });
    logger.log(data);

    return stringOutput;
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
    return output.join('');
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
    return output.join('');
  },
};

const context = rendererName => {
  const renderer = RENDERERS[rendererName] || RENDERERS.abstract;
  return data => renderer(data);
};

// Usage

const png = context('png');
const con = context('console');
const web = context('web');
const mkd = context('markdown');

const persons = [
  { name: 'Marcus Aurelius', city: 'Rome', born: 121 },
  { name: 'Victor Glushkov', city: 'Rostov on Don', born: 1923 },
  { name: 'Ibn Arabi', city: 'Murcia', born: 1165 },
  { name: 'Mao Zedong', city: 'Shaoshan', born: 1893 },
  { name: 'Rene Descartes', city: 'La Haye en Touraine', born: 1596 },
];

console.group('Unknown Strategy:');
console.log(png(persons));
console.groupEnd();

console.group('\nConsoleRenderer:');
console.log(con(persons));
console.groupEnd();

console.group('\nWebRenderer:');
console.log(web(persons));
console.groupEnd();

console.group('\nMarkdownRenderer:');
console.log(mkd(persons));
console.groupEnd();
