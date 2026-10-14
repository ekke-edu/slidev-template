# EKKE Slidev presentation template

Reusable Hungarian presentation starter for thesis defenses and academic talks, built with [Slidev](https://sli.dev/).

## Create your presentation

1. Select **Use this template** and create a repository under your account or organization.
2. Clone your new repository and install dependencies:

   ```sh
   pnpm install
   pnpm dev
   ```

3. Edit `slides.md`: replace the bracketed prompts with your title, institution, programme, name, date, and presentation content.
4. Replace the sample graphics in `public/assets/` with artwork you are allowed to use. Keep the filenames `cover.svg`, `header.svg`, and `watermark.svg`, or update the references in the slides and layout.

The template contains no project-specific title or generated metadata. Once created, your repository is independent and can be edited normally.

## Commands

- `pnpm dev` starts the presentation locally.
- `pnpm build` creates a production build in `dist/`.
- `pnpm export` exports the slides to PDF.

Use Node.js 22.12 or newer and pnpm 11. Install the dependencies with the committed lockfile:

```sh
pnpm install --frozen-lockfile
```

## GitHub Pages

The included workflow builds and deploys the presentation when changes are pushed to `main`. In the repository settings, choose **Settings → Pages → Build and deployment → Source → GitHub Actions**. The build automatically uses the repository name as its Pages base path and keeps Slidev hash navigation working from that subpath.

To run the deployment manually, use **Actions → Build and deploy Slidev to GitHub Pages → Run workflow**.

## Customize the layout

- Shared header and watermark: `layouts/default.vue`
- Colors and title slide: `slides.md`
- SVG artwork: `public/assets/`
- Pages deployment: `.github/workflows/deploy.yml`

Contributions to improve the starter are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
