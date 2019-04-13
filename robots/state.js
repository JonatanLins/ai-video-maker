const fs = require('fs');

const contentFilePath = './content.json';

const save = content => {
  const contentString = JSON.stringify(content);
  return fs.writeFileSync(contentFilePath, contentString);
};

const load = () => {
  const contentString = fs.readFileSync(contentFilePath, 'utf-8');
  return JSON.parse(contentString);
};

module.exports = { save, load };
