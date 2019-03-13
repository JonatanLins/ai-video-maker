const readline = require('readline-sync')
const RssParser = require('rss-parser')

const trendsURL = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR'

async function start () {
  function askAndReturnPrefix (searchTerm) {
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readline.keyInSelect(
      prefixes,
      `Choose one prefix for '${searchTerm}'`
    )
    return prefixes[selectedPrefixIndex]
  }
  
  async function askAndReturnSearchTerm () {
    const response = readline.question(
      'Type a search term or G to fetch Google Trends: '
    )
    return response.toUpperCase() === 'G'
      ? await askAndReturnTrends()
      : response
  }
  
  async function askAndReturnTrends (howMany = 9) {
    console.log('Please wait...')
    const trends = await getGoogleTrends()
    const choice = readline.keyInSelect(
      trends.slice(0, howMany),
      'Choose a trend'
    )
    return trends[choice]
  }

  async function getGoogleTrends () {
    const parser = new RssParser()
    const trends = await parser.parseURL(trendsURL)
    return trends.items.map(item => item.title)
  }

  const content = {}

  content.searchTerm = await askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix(content.searchTerm)

  console.log(content)
}

start()