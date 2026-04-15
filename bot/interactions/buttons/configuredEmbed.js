const { getConfigModal } = require('../../modules/panelSystem');
const sendPanelBtn = require('./sendPanel');

module.exports = {
  customId: 'panel:configure',
  async execute(interaction) {
    await interaction.showModal(getConfigModal());
  }
};
