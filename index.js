const readline = require('readline-sync')

function start () {
  const askAndReturnPrefix = () => {
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option')
    return prefixes[selectedPrefixIndex]
  }
  
  const askAndReturnSearchTerm = () => 
    readline.question('Type a search term: ')

  const content = {}

  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()

  console.log(content)
}

start()