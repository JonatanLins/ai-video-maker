const state = require('./robots/state');
const userInputRobot = require('./robots/userInput');
const textRobot = require('./robots/text');
const imageRobot = require('./robots/image');
const videoRobot = require('./robots/video');

const start = async () => {
  state.save({ maximumSentences: 7, dimensions: [1920, 1080] });

  await userInputRobot();
  await textRobot();
  await imageRobot();
  await videoRobot();
};

start();
