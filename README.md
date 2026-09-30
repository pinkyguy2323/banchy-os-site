# Banchy OS — Landing Site

Static homepage for **Banchy OS**, an independent, Arch Linux based rolling-release desktop distribution.

Plain HTML, CSS and JavaScript. No frameworks, no CDN dependencies, no build step.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and content (EN + RU via `data-en` / `data-ru`) |
| `styles.css` | Design tokens, layout, components, responsive rules |
| `script.js` | Language toggle, scroll reveals, sticky header, release API lookup |
| `favicon.svg` | Geometric "B" brand mark |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages

### Option A — push to a `gh-pages` branch

1. Create the site repository (or use an existing one):

```bash
git init
git add .
git commit -m "Add Banchy OS landing site"
git branch -M gh-pages
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin gh-pages
```

2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch `gh-pages` and folder `/ (root)`, then **Save**.
5. The site appears at `https://<your-username>.github.io/<repo>/` within a minute or two.

### Option B — deploy from `main` via GitHub Actions

1. Push the files to the `main` branch of your repository.
2. Open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Add a workflow file `.github/workflows/pages.yml`:

```yaml
name: Deploy pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

5. Push the workflow file, then check **Settings → Pages** for the published URL.

### Option C — publish from the main Banchy OS repo

If this site lives beside the distribution repository, copy the four files into a `docs/`
folder (or `site/` with Pages pointed at it) and enable Pages on the `main` branch,
`/docs` root. All links in the page already point at
`https://github.com/pinkyguy2323/banchy-os`, so nothing else needs editing.

## Notes

- **Language:** defaults to English. The `RU / EN` toggle in the header swaps every
  element carrying `data-en` and `data-ru`, and remembers the choice in `localStorage`.
- **Release info:** `script.js` fetches
  `https://api.github.com/repos/pinkyguy2323/banchy-os/releases/latest` to display the
  current version tag and link the `.sha256` asset. If the GitHub API is rate-limited or
  unreachable, it fails silently and the placeholder text stays in place.
- **Offline:** only the release lookup needs the network. Everything else is local.
- **Accessibility:** semantic landmarks, visible focus states, `prefers-reduced-motion`
  respected for all animations, and AA-level contrast on the dark palette.

## License

MIT.
