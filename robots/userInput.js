const readline = require('readline-sync');
const RssParser = require('rss-parser');
const imdbScrapper = require('imdb-scrapper');

const trendsURL =
  'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR';

async function userInput() {
  const searchTerm = await askAndReturnSearchTerm();
  const prefix = askAndReturnPrefix(searchTerm);

  return { prefix, searchTerm };
}

async function askAndReturnSearchTerm() {
  const options = ['Manual input', 'Google Trends', 'Popular movies'];
  const response = readline.keyInSelect(
    options,
    'Select an option to choose the search term'
  );
  switch (response) {
    case 0:
      return askAndReturnManualInput();
    case 1:
      return await askAndReturnTrend();
    case 2:
      return await askAndReturnImdbMovie();
  }
}

function askAndReturnManualInput() {
  return readline.question('Type a search term: ');
}

async function askAndReturnTrend(howMany = 9) {
  console.log('Please wait...');
  const trends = await getGoogleTrends();
  const choice = readline.keyInSelect(
    trends.slice(0, howMany),
    'Choose a trend'
  );
  return trends[choice];
}

async function askAndReturnImdbMovie(howMany = 9) {
  console.log('Please wait...');
  const movies = await getImdbMovies(howMany);
  const choice = readline.keyInSelect(movies, 'Choose a movie');
  return movies[choice];
}

async function getImdbMovies(howMany = 9) {
  const movies = await imdbScrapper.getTrending(howMany);
  return movies.trending.map(movie => movie.name);
}

async function getGoogleTrends() {
  const parser = new RssParser();
  const trends = await parser.parseURL(trendsURL);
  return trends.items.map(item => item.title);
}

function askAndReturnPrefix(searchTerm) {
  const prefixes = ['Who is', 'What is', 'The history of'];
  const selectedPrefixIndex = readline.keyInSelect(
    prefixes,
    `Choose one prefix for '${searchTerm}'`
  );
  return prefixes[selectedPrefixIndex];
}

module.exports = userInput;
