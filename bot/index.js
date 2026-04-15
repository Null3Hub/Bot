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
---459123958259=
const { SlashCommandBuilder } = require('discord.js');
const { commitScript } = require('../../services/github');
const Script = require('../../models/Script');
const { buildUpdateEmbed } = require('../../services/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update')
    .setDescription('Atualiza script existente')
    .addStringOption(o => o.setName('scriptid').setDescription('ID do script').setRequired(true))
    .addStringOption(o => o.setName('description').setDescription('Descrição').setRequired(true))
    .addAttachmentOption(o => o.setName('file').setDescription('Novo arquivo (opcional)').setRequired(false)),

  async execute(interaction) {
    // ✅ Resposta ephemeral — só o usuário vê
    await interaction.deferReply({ ephemeral: true });

    const scriptId   = interaction.options.getString('scriptid');
    const description = interaction.options.getString('description');
    const file        = interaction.options.getAttachment('file');

    const script = await Script.findOne({ id: scriptId });
    if (!script) return interaction.editReply('❌ Script não encontrado. Verifique o ID.');

    let rawUrl     = script.rawUrl;
    let newVersion = script.version;

    // Se enviou arquivo novo, commita no GitHub
    if (file) {
      const content = await fetch(file.url).then(r => r.text());
      try {
        const githubResult = await commitScript({
          placeId:  script.placeId,
          content:  content,
          gameName: script.name
        });
        rawUrl = githubResult.rawUrl;
        newVersion++;
      } catch (err) {
        console.error('[UPDATE] GitHub error:', err);
        return interaction.editReply('❌ Falha ao enviar arquivo para o GitHub.');
      }
    }

    // Atualiza MongoDB
    script.rawUrl  = rawUrl;
    script.version = newVersion;
    script.logs.push({
      type:        'update',
      description,
      date:        new Date(),
      by:          interaction.user.id,
      version:     newVersion
    });
    await script.save();

    const embed = buildUpdateEmbed({ script, description, user: interaction.user });

    // ✅ Envia embed no mesmo canal que o /addscript
    const channel = interaction.client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) await channel.send({ embeds: [embed] });

    // ✅ Resposta privada para o usuário
    await interaction.editReply({
      content: `✅ Script **${script.name}** atualizado para v${newVersion}!`
    });
  }
};


require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const connectDB = require('../services/mongo');
const { checkWhitelist } = require('../utils/whitelist');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
function getAllCommandFiles(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  let commandFiles = [];
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      commandFiles = commandFiles.concat(getAllCommandFiles(fullPath));
    } else if (file.name.endsWith('.js')) {
      commandFiles.push(fullPath);
    }
  }
  return commandFiles;
}
const commandFiles = getAllCommandFiles(commandsPath);

for (const filePath of commandFiles) {
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`📌 Comando carregado: /${command.data.name}`);
  }
}

client.once('clientReady', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // ✅ WHITELIST GLOBAL — bloqueia qualquer comando para não autorizados
  if (!checkWhitelist(interaction)) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Erro ao executar comando.', ephemeral: true }).catch(() => {});
  }
});

connectDB().then(() => {
  client.login(process.env.DISCORD_TOKEN);
}).catch(err => {
  console.error('Falha ao iniciar:', err);
  process.exit(1);
});
