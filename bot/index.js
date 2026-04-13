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

// Inicia API também (opcional, se quiser tudo num processo só)
// require('../api/server'); 
