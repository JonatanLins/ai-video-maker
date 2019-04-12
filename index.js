const userInputRobot = require('./robots/userInput');
const textRobot = require('./robots/text');

const start = async () => {
  let content = await userInputRobot();

  await textRobot(content);

  console.log(content);
};

start();
