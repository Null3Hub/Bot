const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const langs = require('../config/languages.json');
const pays = require('../config/payments.json');
const config = require('../config/ticketConfig.json');
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
          value: key
        }))
      )
  );
}

function getPaymentMenu(lang) {
  const options = Object.entries(pays[lang] || {}).map(([key, val]) => ({
    label: val.label, value: key, description: val.desc.slice(0, 100)
  }));
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select:payment')
      .setPlaceholder(langs[lang]?.paymentPlaceholder || 'Select')
      .addOptions(options)
  );
}

function buildTicketEmbed(lang, payKey, user) {
  const langData = langs[lang] || {};
  const payData = pays[lang]?.[payKey] || pays['en-us']?.[payKey] || {};

  const langLabel = langData.label || lang;
  const payLabel = payData.label || payKey;
  const payDesc = payData.desc || 'N/A';

  const footer = config.footerText.replace('{date}', new Date().toLocaleDateString());
  const ownerRoleId = config.ownerRoleId || config.supportRoleId;

  const isPtBr = lang === 'pt-br';

  return new EmbedBuilder()
    .setColor('#000000')
    .setTitle(isPtBr ? '🎫 Novo Ticket' : '🎫 New Ticket')
    .addFields(
      {
        name: isPtBr ? '💳 Forma de Pagamento' : '💳 Payment Method',
        value: `${payLabel}\n\`\`\`${payDesc}\`\`\``,
        inline: false
      },
      {
        name: isPtBr ? '🌍 Idioma' : '🌍 Language',
        value: langLabel,
        inline: true
      },
      {
        name: isPtBr ? '👤 Comprador' : '👤 Buyer',
        value: user.toString(),
        inline: true
      },
      {
        name: isPtBr ? '⏳ Próximos Passos' : '⏳ Next Steps',
        value: isPtBr
          ? `Aguarde após o pagamento. Sua key será entregue por <@&${ownerRoleId}>.`
          : `Wait after the payment. Your key will be delivered by <@&${ownerRoleId}>.`,
        inline: false
      }
    )
    .setFooter({ text: footer })
    .setTimestamp();
}

async function handlePaymentSelection(interaction) {
  const lang = state.get(interaction.user.id)?.lang;
  const pay = interaction.values[0];
  state.set(interaction.user.id, 'payment', pay);

  const channel = await createTicketChannel(interaction.guild, interaction.user);
  state.clear(interaction.user.id);

  await interaction.followUp({ 
    content: langs[lang]?.ticketCreated
      .replace('{channel}', channel.toString())
      .replace('{user}', interaction.user.toString()),
    flags: MessageFlags.Ephemeral
  });

  const ownerRoleId = config.ownerRoleId || config.supportRoleId;

  const pingMsg = await channel.send({
    content: `<@&${ownerRoleId}>`,
    allowedMentions: { roles: [ownerRoleId] }
  });
  await pingMsg.delete();

  const embed = buildTicketEmbed(lang, pay, interaction.user);

  const closeBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('btn:close_ticket')
      .setLabel('🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({ embeds: [embed], components: [closeBtn] });
}

module.exports = { getLangMenu, getPaymentMenu, handlePaymentSelection };
