const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const langs = require('../config/languages.json');
const pays = require('../config/payments.json');
const config = require('../config/ticketConfig.json');
const { createTicketChannel } = require('../utils/channelManager');
const state = require('./ticketState');
const ownerRoleId = config.ownerRoleId || config.supportRoleId;

const PAY_ICONS = {
  pix:    '<:pix:1494128469204930580>',
  paypal: '<:paypal:1494128433075195917>',
  crypto: '<:LTC_Litecoin:1494128475739652176>'
};

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
  const options = Object.entries(pays[lang] || pays['en-us']).map(([key, val]) => ({
    label: `${PAY_ICONS[key] || '💳'} ${val.label}`,
    value: key,
    description: val.desc.slice(0, 100)
  }));

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('select:payment')
      .setPlaceholder(langs[lang]?.paymentPlaceholder || 'Choose a payment method')
      .addOptions(options)
  );
}

function buildTicketEmbed(lang, payKey, user) {
  const langData = langs[lang] || {};
  const payData  = pays[lang]?.[payKey] || pays['en-us']?.[payKey] || {};

  const langLabel = langData.label || lang;
  const payLabel  = payData.label  || payKey;
  const payDesc   = payData.desc   || 'N/A';
  const payIcon   = PAY_ICONS[payKey] || '💳';

  const footer     = config.footerText.replace('{date}', new Date().toLocaleDateString());
  const ownerRoleId = config.ownerRoleId || config.supportRoleId;
  const isPtBr      = lang === 'pt-br';

  return new EmbedBuilder()
    .setColor('#000000')
    .setTitle(isPtBr ? '<:emoji_86:1494168845118603375> Novo Ticket' : '<:emoji_86:1494168845118603375> New Ticket')
    .addFields(
      {
        name: isPtBr ? '<a:card:1494128481091457084> Forma de Pagamento' : '<a:card:1494128481091457084> Payment Method',
        value: `${payLabel}\n\`\`\`${payDesc}\`\`\``,
        inline: false
      },
      {
        name: isPtBr ? '<a:1276588157927952486:1489752367074246836> Idioma' : '<a:1276588157927952486:1489752367074246836> Language',
        value: langLabel,
        inline: true
      },
      {
        name: isPtBr ? '<a:AU_money2:1494128483020963892> Comprador' : '<a:AU_money2:1494128483020963892> Buyer',
        value: user.toString(),
        inline: true
      },
      {
        name: isPtBr
          ? '<a:5fs_clock:1494153232212168735> Próximos Passos'
          : '<a:5fs_clock:1494153232212168735> Next Steps',
        value: isPtBr
         ? `Após o pagamento, envie o comprovante e aguarde. Um helper estará disponível caso precise de ajuda, e sua key será entregue por <@&${ownerRoleId}> assim que estiver online.`
         : `After the payment, please send the proof and wait. A helper will be available if you need assistance, and your key will be delivered by <@&${ownerRoleId}> as soon as they are online.`,
       inline: false,
      }
    )
    .setFooter({ text: footer })
    .setTimestamp();
}

async function handlePaymentSelection(interaction) {
  const lang = state.get(interaction.user.id)?.lang;
  const pay  = interaction.values[0];
  state.set(interaction.user.id, 'payment', pay);

  const channel = await createTicketChannel(interaction.guild, interaction.user);
  state.clear(interaction.user.id);

  await interaction.followUp({
    content: langs[lang]?.ticketCreated
      .replace('{channel}', channel.toString())
      .replace('{user}', interaction.user.toString()),
    flags: MessageFlags.Ephemeral
  });

  const pingMsg = await channel.send({
    content: `<@&${ownerRoleId}> <@${interaction.user.id}>`,
    allowedMentions: { roles: [ownerRoleId], users: [interaction.user.id] }
  });

  await pingMsg.delete();
  const embed = buildTicketEmbed(lang, pay, interaction.user);
  const closeBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('btn:close_ticket')
      .setLabel(lang === 'pt-br' ? '🔒 Fechar Ticket' : '🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger)
  );
  await channel.send({ embeds: [embed], components: [closeBtn] });
}
module.exports = { getLangMenu, getPaymentMenu, handlePaymentSelection };
