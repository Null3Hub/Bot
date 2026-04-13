const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = process.env.GITHUB_SCRIPTS_OWNER;
const REPO = process.env.GITHUB_SCRIPTS_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';

/**
 * Commita script no repositório externo
 * Nome do arquivo: {PlaceId}.lua
 */
async function commitScript({ placeId, content }) {
  const fileName = `${placeId}.lua`;
  const contentBase64 = Buffer.from(content).toString('base64');
  const commitMessage = `feat: update script for ${placeId}`;

  // Verifica se arquivo existe para obter o SHA (necessário para update)
  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: fileName,
      ref: BRANCH,
    });
    sha = data.sha;
  } catch (err) {
    sha = undefined; // Arquivo novo
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: fileName,
    message: commitMessage,
    content: contentBase64,
    branch: BRANCH,
    ...(sha && { sha }),
  });

  // Retorna a URL Raw para execução
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${fileName}`;
  return { fileName, rawUrl };
}

module.exports = { commitScript };
