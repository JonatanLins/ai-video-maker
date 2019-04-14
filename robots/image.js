const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
const imageDownloader = require('image-downloader');
const state = require('./state');

const googleSearchCredentials = require('../credentials/google-search');

const robot = async () => {
  const content = state.load();

  await getImagesOfAllSentences(content);
  await downloadAllImages(content);

  state.save(content);
};

const getImagesOfAllSentences = async content => {
  for (const sentence of content.sentences) {
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

const downloadAllImages = async content => {
  content.downloadedImages = [];

  for (const sentenceIndex in content.sentences) {
    const sentence = content.sentences[sentenceIndex];

    for (const image of sentence.images) {
      try {
        if (content.downloadedImages.includes(image)) {
          throw new Error('Imagem já foi baixada');
        }

        await downloadAndSave(image, `${sentenceIndex}-original.png`);

        console.log(`> Baixou imagem com sucesso: ${image}`);
        content.downloadedImages.push(image);

        break;
      } catch (error) {
        console.error(`> Erro ao baixar ${image}: ${error}`);
      }
    }
  }
};

const downloadAndSave = async (url, fileName) => {
  return imageDownloader.image({
    url,
    dest: `./cache/${fileName}`,
  });
};

module.exports = robot;
