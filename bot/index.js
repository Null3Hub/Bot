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
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
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
