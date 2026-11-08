# HoangPC — Cybersecurity & Code

Personal portfolio for Phạm Chính Hoàng, a Cybersecurity student at PTIT.

**Website:** https://hoangpc0112.github.io/

Static HTML, CSS and JavaScript with Vietnamese/English switching, six selected GitHub projects, project filters, a simulated terminal and GSAP scroll animations. The ASCII sphere rotates automatically without pointer interaction. Fonts and animation libraries are served locally; images below the first screen load lazily.

## Preview

```powershell
uv run --no-project python -m http.server 5173 --directory dist
```

Open http://localhost:5173/. No build or dependency installation is required to serve the checked-in site.

## Check

```powershell
pnpm test
uv run --no-project python test-content.py
```

To refresh the pinned GSAP bundles:

```powershell
pnpm install --frozen-lockfile
pnpm vendor
```

## Deploy

Push to `main`. GitHub Actions checks the JavaScript and publishes `dist/` to GitHub Pages. The workflow can also be started manually from the Actions tab.

## Edit

- `dist/index.html`: biography, projects, links and page metadata.
- `dist/hacker.css`: responsive layout, typography and animation styles.
- `dist/hacker.mjs`: sphere rendering, scroll reveals, filtering and terminal interaction.
- `dist/locale.mjs`: Vietnamese/English text, accessible labels and saved language selection.
- `dist/portfolio-core.mjs`: project categories and terminal replies.
- `dist/navigation.mjs`: responsive menu, Escape and keyboard focus handling.
- `github-sources.json`: public GitHub snapshot used for the portfolio.

Names, repository identifiers and terminal command names stay unchanged when switching languages. The terminal returns fixed text; it never executes system commands. Motion stays enabled by the owner's request; offscreen rendering pauses to save resources.

Third-party fonts retain their OFL license files in `dist/fonts/`. Vendored GSAP files retain their original license headers. The profile avatar and project screenshot come from the owner's public GitHub content.
