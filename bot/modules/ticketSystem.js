const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, MessageFlags } = require('discord.js');
const langs = require('../config/languages.json');
const pays = require('../config/payments.json');
const { createTicketChannel } = require('../utils/channelManager');
const state = require('./ticketState');

function getLangMenu() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select:lang')
      .setPlaceholder('🌍 Select Language / Selecione o Idioma')
      .addOptions(
        Object.entries(langs).map(([key, l]) => ({ 
          label: l.label, 
          value: key  // "pt-br" / "en-us"
        }))
      )
  );
}

function getPaymentMenu(lang) {
  const options = Object.entries(pays[lang] || {}).map(([key, val]) => ({
    label: val.label, value: key, description: val.desc.slice(0, 100)
  }));
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder().setCustomId('select:payment').setPlaceholder(langs[lang]?.paymentPlaceholder || 'Select').addOptions(options)
  );
}

async function handlePaymentSelection(interaction) {
  const lang = state.get(interaction.user.id)?.lang;
  const pay = interaction.values[0];
  state.set(interaction.user.id, 'payment', pay);

  const channel = await createTicketChannel(interaction.guild, interaction.user);
  state.clear(interaction.user.id);

  // deferUpdate() já foi chamado antes, então usa followUp
  await interaction.followUp({ 
    content: langs[lang]?.ticketCreated
      .replace('{channel}', channel.toString())
      .replace('{user}', interaction.user.toString()),
    flags: MessageFlags.Ephemeral
  });

  const initialMsg = langs[lang]?.initialMsg || 'Welcome.';
  const closeBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('btn:close_ticket').setLabel('🔒 Close Ticket').setStyle(ButtonStyle.Danger)
  );

  await channel.send({ content: initialMsg, components: [closeBtn] });
}

module.exports = { getLangMenu, getPaymentMenu, handlePaymentSelection };
