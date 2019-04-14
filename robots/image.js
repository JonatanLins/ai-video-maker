const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
const state = require('./state');

const googleSearchCredentials = require('../credentials/google-search');

const robot = async () => {
  const content = state.load();

  await getImagesOfAllSentences(content);

  state.save(content);
};

const getImagesOfAllSentences = async content => {
  for (sentence of content.sentences) {
    sentence.searchQuery = `${content.searchTerm} ${sentence.keywords[0]}`;
    sentence.images = await getImageLinks(sentence.searchQuery);
  }
};

const getImageLinks = async query => {
  const response = await customSearch.cse.list({
    auth: googleSearchCredentials.apiKey,
    cx: googleSearchCredentials.searchEngineID,
    q: query,
    searchType: 'image',
    num: 2,
  });

  return response.data.items.map(item => item.link);
};

module.exports = robot;
