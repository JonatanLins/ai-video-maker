const state = require('../robots/state');
const textRobot = require('../robots/text');
const imageRobot = require('../robots/image');
const videoRobot = require('../robots/video');

module.exports = {
  name: 'ai-video-maker',
  run: async ({ print, parameters }) => {
    if (!parameters.first) {
      print.error('A search term must be specified');
      return;
    }

    print.success('Iniciando...');

    state.save({
      maximumSentences: 7,
      dimensions: [1920, 1080],
      searchTerm: parameters.array.join(' '),
      prefix: parameters.options.prefix || 'A história de',
    });

    await textRobot();
    await imageRobot();
    await videoRobot();

    print.success('Finalizado com sucesso!');
  },
};
