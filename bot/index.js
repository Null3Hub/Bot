require('dotenv').config();
const { Client, GatewayIntentBits, MessageFlags } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const connectDB = require('../services/mongo');
const { checkWhitelist } = require('../utils/whitelist');
const emojiEvents = require('./events/emojiEvents');
const elist = require('./commands/elist');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildEmojisAndStickers,
  ]
});

// =====================
// HANDLERS
// =====================

const buttonHandlers = {
  'btn:create_ticket': require('./interactions/buttons/createTicket'),
  'btn:close_ticket': require('./interactions/buttons/closeTicket'),
  'btn:info': require('./interactions/buttons/infoButton'),
  'panel:configure': require('./interactions/buttons/configureEmbed'),
  'panel:info_modal': require('./interactions/buttons/infoModalBtn'),
  'panel:send': require('./interactions/buttons/sendPanel'),

  'btn_embed_edit': require('./interactions/buttons/embedEdit'), // ✅ adicionar
  'btn_embed_json': require('./interactions/buttons/embedJson'),
  'btn_embed_preview': require('./interactions/buttons/embedPreview'),
  'btn_embed_cancel': require('./interactions/buttons/embedCancel'), // ✅ NOVO
  'setembed:set_json': require('./interactions/buttons/setEmbedJson'),
  'setembed:send': require('./interactions/buttons/setEmbedSend'),
};

const selectHandlers = {
  'select:lang': require('./interactions/selects/languageSelect'),
  'select:payment': require('./interactions/selects/paymentSelect')
};

const modalHandlers = {
  'modal:embed_config': require('./interactions/modals/embedModal'),
  'modal:info_json': require('./interactions/modals/infoJsonModal'),
  'setembed:modal_json': require('./interactions/modals/setEmbedModal'), // ✅ NOVO
  'modal_embed_input': require('./interactions/modals/embedInputModal'), // ✅ NOVO (se necessário)
};

// =====================
// COMMANDS
// =====================

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

// =====================
// EVENTS
// =====================

client.once('clientReady', () => {
  console.log(`✅ Bot online: ${client.user.username}`); // ✅ user.tag → user.username
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (!checkWhitelist(interaction)) return;
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      return await command.execute(interaction);
    }

    if (interaction.isButton()) {
      const handler = buttonHandlers[interaction.customId];
      if (handler?.execute) return handler.execute(interaction);
      console.warn(`[WARN] Botão não encontrado: ${interaction.customId}`);
    }

    if (interaction.isStringSelectMenu()) {
      const handler = selectHandlers[interaction.customId];
      if (handler?.execute) return handler.execute(interaction);
    }

    if (interaction.isModalSubmit()) {
      const handler = modalHandlers[interaction.customId];
      if (handler?.execute) return handler.execute(interaction);
      console.warn(`[WARN] Modal não encontrado: ${interaction.customId}`);
    }

  } catch (error) {
    console.error('Erro em interactionCreate:', error);
    const replyData = {
      content: '❌ Ocorreu um erro inesperado.',
      flags: MessageFlags.Ephemeral // ✅ Correto
    };
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(replyData).catch(() => {});
    } else {
      await interaction.reply(replyData).catch(() => {});
    }
  }
});

// =====================
// START
// =====================

async function startBot() {
  try {
    await connectDB();
    console.log('✅ Banco de dados conectado com sucesso.');
    await client.login(process.env.DISCORD_TOKEN);
    console.log('🤖 Bot conectado ao Discord.');
    emojiEvents(client, elist.emojiCache);
  } catch (err) {
    console.error('❌ Falha ao iniciar:', err);
    process.exit(1);
  }
}

startBot();