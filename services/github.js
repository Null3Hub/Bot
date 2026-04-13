const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = process.env.GITHUB_SCRIPTS_OWNER;
const REPO = process.env.GITHUB_SCRIPTS_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';

// Limpa o nome para usar como nome de pasta
function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // remove caracteres especiais
    .replace(/\s+/g, '-')          // espaços viram hífen
    .substring(0, 40)              // máximo 40 chars
    .trim();
}

async function commitScript({ placeId, content, gameName }) {
  const cleanName = sanitizeName(gameName || 'script');

  // Caminho: Scripts/nomedojogo(placeid)/placeid.lua
  const folderPath = `Scripts/${cleanName}(${placeId})`;
  const filePath = `${folderPath}/${placeId}.lua`;
  const contentBase64 = Buffer.from(content).toString('base64');
  const commitMessage = `feat: update script for ${gameName || placeId}`;

  // Verifica se arquivo já existe para obter o SHA (necessário para update)
  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      ref: BRANCH,
    });
    sha = data.sha;
  } catch (err) {
    sha = undefined; // Arquivo novo
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: filePath,
    message: commitMessage,
    content: contentBase64,
    branch: BRANCH,
    ...(sha && { sha }),
  });

  // URL raw para o loader executar
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${filePath}`;
  return { fileName: `${placeId}.lua`, folderPath, filePath, rawUrl };
}

module.exports = { commitScript };
