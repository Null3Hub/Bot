const { EmbedBuilder } = require('discord.js');

const STATUS_COLOR = {
  active: 0x57f287,
  maintenance: 0xfee75c,
  discontinued: 0xed4245,
};

const STATUS_LABEL = {
  active: '🟢 Active',
  maintenance: '🟡 Maintenance',
  discontinued: '🔴 Discontinued',
};

const PANEL_COLOR = 0x000000;

// =====================
// ADD SCRIPT (DASHBOARD)
// =====================
function buildAddScriptEmbed({ name, scriptId, placeId, image, features, version, rawUrl, user }) {
  const embed = new EmbedBuilder()
    .setTitle(`${name} <a:a_rengokufire:1489753600522453063>`)
    .setColor(PANEL_COLOR)
    .setDescription(
      `> <a:furinadance:1489753603928490035> **System Advertise**\n` +
      `> New script registered successfully.`
    )
    .addFields(
      {
        name: '<a:Verde:1489752360405434368> Core',
        value:
          `<a:Svideogame:1490143738121552055> **Place ID**\n\`${placeId}\`` +
          `<a:developer_bot:1491655337458270268> **Version**\n\`v${version}\``,
        inline: true,
      },
      {
        name: '<a:Verde:1489752360405434368> Status',
        value: `${STATUS_LABEL.active}\n`,
        inline: true,
      },
      {
        name: '<a:Blue_Stars:1489800733229322280> Features',
        value: Array.isArray(features) && features.length > 0
          ? `\`\`\`\n${features.map(f => `• ${f}`).join('\n')}\n\`\`\``
          : '```• No features listed```',
        inline: false,
      },
      {
        name: '<a:1276588157927952486:1489752367074246836> Script Loader',
        value: '`•` Link Coming soon',
        inline: false,
      }
    )
    .setFooter({
      text: `Null Hub • Script Added`,
      iconURL: user?.displayAvatarURL?.(),
    })
    .setTimestamp();

  if (image) embed.setThumbnail(image);
  return embed;
}

// =====================
// STATUS UPDATE (DASHBOARD)
// =====================
function buildStatusEmbed({ script, oldStatus, newStatus, user }) {
  const embed = new EmbedBuilder()
    .setTitle(`<a:Z_Wwwarning:1489752851675611306> Status Changed — ${script.name}`)
    .setColor(STATUS_COLOR[newStatus] || PANEL_COLOR)
    .setDescription(
      `> <a:HuTao_HyperYay:1489753410956693815> **System**\n` +
      `> Script status has been modified.`
    )
    .addFields(
      {
        name: '<a:Verde:1489752360405434368> Core',
        value:
          `<a:developer_bot:1491655337458270268> **ID**\n\`${script.id}\`\n` +
          `<a:Svideogame:1490143738121552055> **PLACE**\n\`${script.placeId}\``,
        inline: true,
      },
      {
        name: '<a:setaesquerda_TDN:1489801138768449556> Before',
        value: `${STATUS_LABEL[oldStatus] || oldStatus}`,
        inline: true,
      },
      {
        name: '<a:p_setapreta_MS:1489801136293544046> After',
        value: `${STATUS_LABEL[newStatus] || newStatus}`,
        inline: true,
      }
    )
    .setFooter({
      text: `Null Hub • Script Status Changed`,
      iconURL: user?.displayAvatarURL?.(),
    })
    .setTimestamp();

  if (script.image) embed.setThumbnail(script.image);
  return embed;
}

// =====================
// SCRIPT UPDATE (DASHBOARD) — ✅ ATUALIZADO
// =====================
function buildUpdateEmbed({ script, description, user }) {
  const formatDescription = (desc) => {
    if (!desc) return '```• No description```';
    return `\`\`\`\n${desc
      .split(',')
      .map(item => `• ${item.trim()}`)
      .join('\n')}\n\`\`\``;
  };

  const embed = new EmbedBuilder()
    .setTitle(`<a:Z_Wwwarning:1489752851675611306> Update Log — ${script.name}`)
    .setColor(PANEL_COLOR)
    .setDescription(
      `> <a:regras:1489752855295426852> **Patch Notes**\n` +
      `${formatDescription(description)}`
    )
    .addFields(
      {
        name: '<a:Verde:1489752360405434368> Core',
        value:
          `<a:Svideogame:1490143738121552055> **Place ID**\n\`${script.placeId}\`\n` +
          `<a:developer_bot:1491655337458270268> **Version**\n\`v${script.version}\``,
        inline: true,
      },
      {
        name: '<a:Verde:1489752360405434368> Status',
        value: `${STATUS_LABEL[script.status] || script.status}`,
        inline: true,
      },
      {
        name: '<a:1276588157927952486:1489752367074246836> Script Loader',
        value: '`•` Link Coming soon',
        inline: false,
      }
    )
    .setFooter({
      text: `Null Hub • Patch Notes -> Script Updated`,
      iconURL: user?.displayAvatarURL?.(),
    })
    .setTimestamp();

  if (script.image) embed.setThumbnail(script.image);
  return embed;
}

module.exports = {
  buildAddScriptEmbed,
  buildStatusEmbed,
  buildUpdateEmbed,
};
