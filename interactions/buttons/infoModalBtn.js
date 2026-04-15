const { getInfoJsonModal } = require('../../modules/panelSystem');
const infoBtn = require('./infoButton');

module.exports = {
  customId: 'panel:info_modal',
  async execute(interaction) {
    await interaction.showModal(getInfoJsonModal());
  }
};