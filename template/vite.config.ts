import { defineConfig } from 'vite';

// GitHub Pages deployment: the workflow sets GITHUB_PAGES=true and supplies
// GITHUB_REPOSITORY automatically, so the base path follows the repository name.
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.GITHUB_PAGES === 'true' && repositoryName
  ? `/${repositoryName}/`
  : '/';

export default defineConfig({ base });
