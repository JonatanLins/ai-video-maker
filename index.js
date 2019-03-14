const userInputRobot = require('./robots/userInput')

async function start () {
  const content = await userInputRobot()

  console.log(content)
}

start()