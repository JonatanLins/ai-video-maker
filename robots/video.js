const gm = require('gm').subClass({ imageMagick: true });
const state = require('./state');

const robot = async () => {
  const content = state.load();

  await convertAllImages(content);
  await createAllSentenceImages(content);
  await createThumbnail(content);

  state.save(content);
};

const convertAllImages = async content => {
  for (let number = 0; number < content.sentences.length; number++) {
    await convertImage(number, content.dimensions);
  }
};

const convertImage = async (number, dimensions) => {
  return new Promise((resolve, reject) => {
    const inputFile = `./cache/${number}-original.png[0]`;
    const outputFile = `./cache/${number}-converted.png`;
    const [width, height] = dimensions;

    gm()
      .in(inputFilePath)
      .out('(')
      .out('-clone')
      .out('0')
      .out('-background', 'white')
      .out('-blur', '0x9')
      .out('-resize', `${width}x${height}^`)
      .out(')')
      .out('(')
      .out('-clone')
      .out('0')
      .out('-background', 'white')
      .out('-resize', `${width}x${height}`)
      .out(')')
      .out('-delete', '0')
      .out('-gravity', 'center')
      .out('-compose', 'over')
      .out('-composite')
      .out('-extent', `${width}x${height}`)
      .write(outputFile, error => {
        if (error) return reject(error);

        console.log(`> Imagem convertida: '${inputFile}'`);
        resolve();
      });
  });
};

const createAllSentenceImages = async content => {
  for (let number = 0; number < content.sentences.length; number++) {
    await createSentenceImage(number, content.sentences[number].text);
  }
};

const createSentenceImage = (number, text) => {
  return new Promise((resolve, reject) => {
    const outputFile = `./cache/${number}-sentence.png`;

    const templateSettings = [
      { size: '1920x400', gravity: 'center' },
      { size: '1920x1080', gravity: 'center' },
      { size: '800x1080', gravity: 'west' },
      { size: '1920x400', gravity: 'center' },
      { size: '1920x1080', gravity: 'center' },
      { size: '800x1080', gravity: 'west' },
      { size: '1920x400', gravity: 'center' },
    ];

    gm()
      .out('-size', templateSettings[number % 7].size)
      .out('-gravity', templateSettings[number % 7].gravity)
      .out('-background', 'transparent')
      .out('-fill', 'white')
      .out('-kerning', '-1')
      .out(`caption:${text}`)
      .write(outputFile, error => {
        if (error) return reject(error);

        console.log(`> Sentença criada: ${outputFile}`);
        resolve();
      });
  });
};

const createThumbnail = () => {
  return new Promise((resolve, reject) => {
    gm()
      .in('./cache/0-converted.png')
      .write('./cache/thumbnail.jpg', error => {
        if (error) return reject(error);

        console.log(`> Thumbnail criada`);
        resolve();
      });
  });
};

module.exports = robot;
