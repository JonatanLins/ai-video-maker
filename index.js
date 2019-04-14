const state = require('./robots/state');
const userInputRobot = require('./robots/userInput');
const textRobot = require('./robots/text');
const imageRobot = require('./robots/image');

const start = async () => {
  state.save({ maximumSentences: 7 });

  await userInputRobot();
  await textRobot();
  await imageRobot();

  const content = state.load();
  console.dir(content, { depth: null });
};

start();
