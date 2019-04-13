const readline = require('readline-sync');
const RssParser = require('rss-parser');
const imdbScrapper = require('imdb-scrapper');

const trendsURL =
  'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR';

async function userInput(content) {
  content.searchTerm = await askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix(content.searchTerm);
}

async function askAndReturnSearchTerm() {
  const options = ['Entrada manual', 'Google Trends', 'Filmes populares'];
  const response = readline.keyInSelect(
    options,
    'Selecione uma opção para escolher um tema'
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
  return readline.question('Digite um tema: ');
}

async function askAndReturnTrend(howMany = 9) {
  console.log('Por favor aguarde...');
  const trends = await getGoogleTrends();
  const choice = readline.keyInSelect(
    trends.slice(0, howMany),
    'Escolha um tema'
  );
  return trends[choice];
}

async function askAndReturnImdbMovie(howMany = 9) {
  console.log('Por favor aguarde...');
  const movies = await getImdbMovies(howMany);
  const choice = readline.keyInSelect(movies, 'Escolha um filme');
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
  const prefixes = ['Quem é', 'O que é', 'A história de'];
  const selectedPrefixIndex = readline.keyInSelect(
    prefixes.map(prefix => `${prefix} ${searchTerm}`),
    `Escolha um prefixo para '${searchTerm}'`
  );
  return prefixes[selectedPrefixIndex];
}

module.exports = userInput;
