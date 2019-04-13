const userInputRobot = require('./robots/userInput');
const textRobot = require('./robots/text');

const start = async () => {
  let content = { maximumSentences: 7 };

  content = { ...content, ...(await userInputRobot()) };

  await textRobot(content);

  console.log(content.sentences);
};

start();
