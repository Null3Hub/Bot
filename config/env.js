require('dotenv').config();

const required = [
  'DISCORD_TOKEN',
  'DISCORD_CLIENT_ID=ID_do_app_discord',
  'DISCORD_GUILD_ID=ID_do_seu_servidor',
  'DISCORD_CHANNEL_ID',
  'MONGODB_URI',
  'GITHUB_TOKEN',
  'GITHUB_SCRIPTS_OWNER',
  'GITHUB_SCRIPTS_REPO'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`❌ Variável de ambiente ausente: ${key}`);
  }
}

module.exports = process.env;
