const readline = require('readline-sync')

function start () {
  function askAndReturnPrefix (searchTerm) {
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readline
      .keyInSelect(prefixes, `Choose one prefix for '${searchTerm}'`)
    return prefixes[selectedPrefixIndex]
  }
  
  const askAndReturnSearchTerm = () => 
    readline.question('Type a search term: ')

  const content = {}

  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix(content.searchTerm)

  console.log(content)
}

start()