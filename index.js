const userInputRobot = require('./robots/userInput');
const textRobot = require('./robots/text');

const start = async () => {
  let content = { maximumSentences: 7 };

  await userInputRobot(content);
  await textRobot(content);

  console.log(content.sentences);
};

start();
