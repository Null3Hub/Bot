const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');

async function sendConfigPanel(interaction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('panel:configure').setLabel('⚙️ Configure Embed').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('panel:info_modal').setLabel('ℹ️ Set Info JSON').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('panel:send').setLabel('📤 Send to Channel').setStyle(ButtonStyle.Success)
  );

  await interaction.editReply({ content: '🛠️ **Painel de Configuração**\nConfigure o embed e envie para o canal.', components: [row] });
}

function getConfigModal() {
  const modal = new ModalBuilder().setCustomId('modal:embed_config').setTitle('Configure Panel Embed');
  modal.addComponents(
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('title').setLabel('Title').setStyle(TextInputStyle.Short).setRequired(true)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('description').setLabel('Description').setStyle(TextInputStyle.Paragraph).setRequired(true)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('color').setLabel('Color (Hex)').setStyle(TextInputStyle.Short).setRequired(false)),
    new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('thumbnail').setLabel('Thumbnail URL').setStyle(TextInputStyle.Short).setRequired(false))
  );
  return modal;
}

function getInfoJsonModal() {
  const modal = new ModalBuilder().setCustomId('modal:info_json').setTitle('Info Button JSON');
  modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('json').setLabel('Embed JSON').setStyle(TextInputStyle.Paragraph).setPlaceholder('{"title":"Info","description":"Details..."}').setRequired(true)));
  return modal;
}

module.exports = { sendConfigPanel, getConfigModal, getInfoJsonModal };
