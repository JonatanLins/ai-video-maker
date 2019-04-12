const algorithmia = require('algorithmia');
const sentenceBoundaryDetection = require('sbd');
const { algorithmiaApiKey } = require('../credentials/algorithmia');

const robot = async content => {
  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
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

  const sentenceObjects = sentences.map(sentence => ({
    text: sentence,
    keywords: [],
    images: [],
  }));

  content.sentences = sentenceObjects;
};

const removeBlankLines = lines => lines.filter(line => line.length);

const removeMarkdown = lines => lines.filter(line => !line.startsWith('='));

const removeDatesInParentheses = text =>
  text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');

module.exports = robot;
