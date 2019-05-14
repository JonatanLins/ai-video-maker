const state = require('../robots/state');
const textRobot = require('../robots/text');
const imageRobot = require('../robots/image');
const videoRobot = require('../robots/video');

module.exports = {
  name: 'ai-video-maker',
  run: async toolbox => {
    const { print, parameters } = toolbox;

    print.success('Iniciando...');

    state.save({
      maximumSentences: 7,
      dimensions: [1920, 1080],
      prefix: parameters.options.prefix || 'A história de',
      searchTerm: parameters.first,
    });

    await textRobot();
    await imageRobot();
    await videoRobot();

    print.success('Finalizado com sucesso!');
  },
};
