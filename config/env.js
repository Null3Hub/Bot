require('dotenv').config();

const required = [
  'DISCORD_TOKEN',
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
