const algorithmia = require('algorithmia');
const NaturalLanguageUnderstanding = require('watson-developer-cloud/natural-language-understanding/v1');
const sentenceBoundaryDetection = require('sbd');

const { apiKey: algorithmiaApiKey } = require('../credentials/algorithmia');
const { apikey: nluApiKey, url: nluUrl } = require('../credentials/watson-nlu');
const nlu = new NaturalLanguageUnderstanding({
  iam_apikey: nluApiKey,
  version: '2018-04-05',
  url: nluUrl,
});

const robot = async content => {
  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
  limitMaximumSentences(content);
  await fetchKeywordsOfAllSentences(content);
};

const fetchContentFromWikipedia = async content => {
  const wikipediaAlgorithm = algorithmia(algorithmiaApiKey).algo(
    'web/WikipediaParser/0.1.2'
  );
  const wikipediaResponse = await wikipediaAlgorithm.pipe({
    lang: 'pt',
    articleName: content.searchTerm,
  });
  const wikipediaContent = wikipediaResponse.get();

  content.sourceContentOriginal = wikipediaContent.content;
};

const sanitizeContent = content => {
  const lines = content.sourceContentOriginal
    .split('\n')
    .map(line => line.trim());

  const withoutBlankLines = removeBlankLines(lines);
  const withoutMarkdown = removeMarkdown(withoutBlankLines);
  const plainText = withoutMarkdown.join(' ');
  const withoutDatesInParentheses = removeDatesInParentheses(plainText);

  content.sourceContentSanitized = withoutDatesInParentheses;
};

const breakContentIntoSentences = content => {
  const sentences = sentenceBoundaryDetection.sentences(
    content.sourceContentSanitized
  );

  const sentenceObjects = sentences.map(text => ({ text }));

  content.sentences = sentenceObjects;
};

const limitMaximumSentences = content => {
  content.sentences = content.sentences.slice(0, content.maximumSentences);
};

const fetchKeywordsOfAllSentences = async content => {
  for (const sentence of content.sentences) {
    sentence.keywords = await getKeywordsFromWatson(sentence.text);
  }
};

const removeBlankLines = lines => lines.filter(line => line.length);

const removeMarkdown = lines => lines.filter(line => !line.startsWith('='));

const removeDatesInParentheses = text =>
  text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');

const getKeywordsFromWatson = async sentence => {
  return new Promise((resolve, reject) => {
    nlu.analyze(
      {
        text: sentence,
        features: { keywords: {} },
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.keywords.map(keyword => keyword.text));
        }
      }
    );
  });
};

module.exports = robot;
