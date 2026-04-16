require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
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

const buttonHandlers = {
  'btn:create_ticket': require('./interactions/buttons/createTicket'),
  'btn:close_ticket': require('./interactions/buttons/closeTicket'),
  'btn:info': require('./interactions/buttons/infoButton'),
  'panel:configure': require('./interactions/buttons/configureEmbed'),
  'panel:info_modal': require('./interactions/buttons/infoModalBtn'),
  'setembed:set_json': require('./interactions/buttons/setEmbedJson'),
  'setembed:send':     require('./interactions/buttons/setEmbedSend'),
  'panel:send': require('./interactions/buttons/sendPanel')
};

const selectHandlers = {
  'select:lang': require('./interactions/selects/languageSelect'),
  'select:payment': require('./interactions/selects/paymentSelect')
};

const modalHandlers = {
  'modal:embed_config': require('./interactions/modals/embedModal'),
  'setembed:modal_json': require('./interactions/modals/setEmbedModal'),
  'modal:info_json': require('./interactions/modals/infoJsonModal')
};

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
  const { customId } = interaction;

  try {
    if (interaction.isChatInputCommand()) {
      if (!checkWhitelist(interaction)) return;

      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      return await command.execute(interaction);
    }
    
    if (interaction.isButton()) {
      const handler = buttonHandlers[customId];
      if (handler) return handler.execute(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      const handler = selectHandlers[customId];
      if (handler) return handler.execute(interaction);
    }

    if (interaction.isModalSubmit()) {
      const handler = modalHandlers[customId];
      if (handler) return handler.execute(interaction);
    }

  } catch (error) {
    console.error('Erro em interactionCreate:', error);

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: '❌ Ocorreu um erro inesperado.',
        ephemeral: true
      }).catch(() => {});
    } else {
      await interaction.reply({
        content: '❌ Ocorreu um erro inesperado.',
        ephemeral: true
      }).catch(() => {});
    }
  }
});

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