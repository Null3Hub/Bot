require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const connectDB = require('../services/mongo');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Carregar Comandos
client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

// Eventos
client.once('ready', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const msg = interaction.replied || interaction.deferred 
      ? { content: '❌ Erro ao executar comando.', ephemeral: true }
      : { content: '❌ Erro ao executar comando.', ephemeral: true };
    await interaction.reply(msg).catch(() => {});
  }
});

// Iniciar
connectDB().then(() => {
  client.login(process.env.DISCORD_TOKEN);
});

// bot/index.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { connectDB } = require('../services/mongo');
const config = require('../config/env');
const fs = require('fs');
const path = require('path');

// Mantém o processo vivo e loga erros críticos
process.on('unhandledRejection', err => console.error('❌ Unhandled Rejection:', err));
process.on('uncaughtException', err => { console.error('❌ Uncaught Exception:', err); process.exit(1); });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const cmd = require(path.join(commandsPath, file));
      client.commands.set(cmd.data?.name, cmd);
      console.log(`✅ Command loaded: ${cmd.data?.name || file}`);
    }
  });
}

client.once('clientReady', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

async function start() {
  try {
    await connectDB();
    await client.login(config.discord.token);
  } catch (err) {
    console.error('❌ Fatal start error:', err.message);
    process.exit(1);
  }
}

start();
