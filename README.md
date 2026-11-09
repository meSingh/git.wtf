<p align="center"><a href="https://git.wtf"><img src=".github/banner.png" alt="git.wtf: AI killed our blog. We're keeping score." width="100%"></a></p>

# git.wtf

A counter for the days since the last Git and AI fuck-up, and a short cartoon episode for every real incident that resets it. It's a parody, built on real incidents.

From 2016 to 2025 this domain was a blog about fixing Git. Those posts are still here, unchanged, at their old URLs, listed at [/archive/](https://git.wtf/archive/).

## How it works

- `incidents/YYYY-MM-DD-slug.md`: one file per incident. Front matter: `date`, `title`, `category`, `source_url`, `source_date`, `status`, a one-line `summary` and a short `facts` panel. The body is three short parts: what happened, why it happened, how it ended. The counter counts days since the latest `source_date`, in the browser, in IST, so it climbs without a deploy.
- `archive/<slug>.md`: the old posts, with the post's html as the body. Built by `scripts/wayback-to-archive.mjs` from the Internet Archive's captures, and later by `scripts/ghost-to-archive.mjs` from a Ghost export.
- `src/anime/shots/<id>.json`: each incident's episode, an SVG cutscene with cartoon sound. Stills and posters are rendered by `scripts/render-cut.mjs`; every image carries the git.wtf mark (`scripts/wordmark.mjs`).
- `src/redirects.mjs`: every old tag, category, author, page, AMP and feed URL becomes a static redirect page. `tests/old-urls.txt` lists the old URLs and `scripts/check-urls.mjs` fails CI if one stops resolving.
- Built with Astro, motion with GSAP and ScrollTrigger, served by Cloudflare Workers (`wrangler.jsonc`), which builds and deploys every push to `master`. `.github/workflows/ci.yml` builds every pull request, runs the URL check and uploads the built site as an artifact.

## Working on it

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # dist/
npm run preview        # dist/ served locally, on http://127.0.0.1:8787
npm run check-urls     # against the preview
npm run build:fixture  # a smoke build from tests/fixtures/, never from the real folders
```

`?debug` on the homepage exposes the motion runtime on `window.__gw`; `?reduce` previews the reduced-motion version.

Publish a reviewed draft:

```bash
node scripts/publish-incident.mjs drafts/2026-11-07-slug.md
```

It validates the file, moves it into `incidents/`, builds, commits the file and pushes.
