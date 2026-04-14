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
    .setTitle(null)
    .setColor(PANEL_COLOR)
    .setDescription(
      `# <a:Amarelo:1489753598681415700> ${name} <a:a_rengokufire:1489753600522453063>\n\n\n` +
      `> **System Advertise**\n` +
      `> New script registered successfully. <a:furinadance:1489753603928490035>`
    )
    .addFields(
      {
        name: '<a:Amarelo:1489753598681415700> Core',
        value:
          `<a:Svideogame:1490143738121552055> **Place ID**\n\`${placeId}\`\n` +
          `<a:developer_bot:1491655337458270268> **Version**\n\`v${version}\``,
        inline: true,
      },
      {
        name: '<a:Amarelo:1489753598681415700> Status',
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
        value: '```diff\n+ Link coming soon\n```',
        inline: false,
      }
    )
    .setFooter({
       text: 'Null Hub • New Script Available -> Enjoy!',
       iconURL: 'https://i.imgur.com/P91MIKn.png',
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
    .setTitle(null)
    .setColor(STATUS_COLOR[newStatus] || PANEL_COLOR)
    .setDescription(
      `# <a:Z_Wwwarning:1489752851675611306> Status Changed — ${script.name}\n\n\n` +
      `> <a:sininho:1489752365098729592> **System**\n` +
      `> Script status has been modified. <a:loading:1489752853395411074>`
    )
    .addFields(
      {
        name: '<a:Amarelo:1489753598681415700> Core',
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
      text: `Null Hub • Script Status Updated`,
      iconURL: 'https://i.imgur.com/P91MIKn.png',
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
    .setTitle(null)
    .setColor(PANEL_COLOR)
    .setDescription(
       `# <a:Z_Wwwarning:1489752851675611306> Update Log — ${script.name}\n\n\n` +
       `<a:regras:1489752855295426852> **Patch Notes**\n\n` +
       `${formatDescription(description)}`
     )
    .addFields(
      {
        name: '<a:Amarelo:1489753598681415700> Core',
        value:
          `<a:Svideogame:1490143738121552055> **Place ID**\n\`${script.placeId}\`\n` +
          `<a:developer_bot:1491655337458270268> **Version**\n\`v${script.version}\``,
        inline: true,
      },
      {
        name: '<a:Amarelo:1489753598681415700> Status',
        value: `${STATUS_LABEL[script.status] || '⚪ Unknown'}`,
        inline: true,
      },
      {
        name: '<a:1276588157927952486:1489752367074246836> Script Loader',
        value: '```diff\n+ Link coming soon\n```',
        inline: false,
      }
    )
    .setFooter({
      text: `Null Hub • Patch Notes → Re-Exec to update to the latest version`,
      iconURL: 'https://i.imgur.com/P91MIKn.png',
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
