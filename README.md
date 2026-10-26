# EKKE Slidev presentation template

[English](README.md) · [Magyar](README.hu.md)

An unofficial Slidev template for students and instructors at Eszterházy Károly Catholic University (EKKE). Use it for a course presentation, an assignment, a lecture, or a thesis defence. The EKKE logo is included by default. This is a community project, not an official university publication.

## Create a presentation from the command line

The easiest option is the npm package. You do not need to install the generator first:

```sh
npm create ekke-slides@latest
```

You can pass a folder name as well:

```sh
npm create ekke-slides@latest -- database-talk
```

The CLI asks for the presentation title, presenter, course or event, department, and date. Course and department are optional. The new project is created in a separate folder and existing files are never overwritten. Then start it:

```sh
cd database-talk
pnpm install --frozen-lockfile
pnpm dev
```

The CLI prompts in Hungarian by default. Choose English at the language prompt, or set it directly:

```sh
npm create ekke-slides@latest -- --lang en --dir my-presentation
```

To use the current template files from GitHub instead of the published npm version:

```sh
npx --yes --package=github:ekke-edu/slidev-template create-ekke-slides --dir database-talk
```

## GitHub Packages

The public npm package is the recommended option for students because it installs without GitHub credentials. The same generator is also published to GitHub Packages as `@ekke-edu/create-ekke-slides`. GitHub Packages requires authentication even for public packages.

Create a GitHub classic personal access token with `read:packages`, then sign in and install:

```sh
npm login --scope=@ekke-edu --auth-type=legacy --registry=https://npm.pkg.github.com
npm install -g @ekke-edu/create-ekke-slides
```

Use your GitHub username and enter the token as the password. A package is private when first published; to make it available to everyone, open the package settings on GitHub and choose **Change visibility → Public**.

## Make your own presentation

### 1. Create a repository from the template

Open the GitHub repository, select **Use this template → Create a new repository**, and clone your new repository.

### 2. Install and run

Install [Node.js 22.12 or later](https://nodejs.org/) and pnpm 11, then run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed in the terminal. Slidev reloads the presentation when you save changes. If you use npm instead, run `npm install` and `npm run dev`.

### 3. Edit the slides

Edit the presentation in `slides.md`. Replace the cover details, then update the example slides. Start a new slide with `---`. The `::header::` marker sets the slide heading; content after `::default::` is the slide body.

The cover layout and styling live in `layouts/ekke-cover.vue`. Remove an optional cover field by deleting its whole blockquote line, including the leading `>`.

For a quick Slidev introduction, see the [Slidev guide](https://sli.dev/guide/).

### 4. Export or publish

Export a PDF with:

```sh
pnpm export
```

To publish with GitHub Pages, open **Settings → Pages** in your repository and select **GitHub Actions** as the source. Pushes to `main` will then build and publish the presentation.

## What to edit

- Slides and cover text: `slides.md`
- Cover layout and style: `layouts/ekke-cover.vue`
- Shared header and watermark: `layouts/default.vue`
- EKKE logo files: `public/assets/`
- GitHub Pages workflow: `.github/workflows/deploy.yml`

The EKKE logos come from the university's [official logo page](https://uni-eszterhazy.hu/kommunikacio/logok). If you use the template for another institution or a non-EKKE project, replace the logos with artwork you are allowed to use.

## Releases and contributing

Use Conventional Commit messages (`feat:`, `fix:`, `docs:`, and so on). After merging changes, prepare the next version with one of these commands:

```sh
pnpm release:patch
pnpm release:minor
pnpm release:major
```

These commands update `package.json`, create a release commit, and add a version tag. Push the commit and tag; the release workflow will create GitHub release notes from the Conventional Commit messages and publish the GitHub Packages copy. Publish the npmjs.org package separately with your npm account.

Before opening a pull request, run `pnpm test` and `pnpm build`. Suggestions and fixes are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).

## Common commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Preview and edit the slides |
| `pnpm build` | Build the presentation into `dist/` |
| `pnpm export` | Export a PDF |
| `pnpm test` | Check the project generator |
