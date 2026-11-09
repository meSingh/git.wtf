# git.wtf

One real Git fuck-up a day, retold deadpan, under a split-flap sign that counts the days since the last one.

From 2016 to 2025 this domain was a blog about fixing Git. Those posts are still here, unchanged, at their old URLs, listed at [/archive/](https://git.wtf/archive/).

## How it works

- `incidents/YYYY-MM-DD-slug.md`: one file per incident. Front matter: `date`, `title`, `category`, `source_url`, `source_date`, `status`. The body is the retelling, three or four sentences. The counter counts days since the latest `source_date`, in the browser, in IST, so it climbs without a deploy.
- `archive/<slug>.md`: the old posts, with the post's html as the body. Built by `scripts/wayback-to-archive.mjs` from the Internet Archive's captures, and later by `scripts/ghost-to-archive.mjs` from a Ghost export.
- `src/redirects.mjs`: every old tag, category, author, page, AMP and feed URL becomes a static redirect page (GitHub Pages has no server-side redirects). `tests/old-urls.txt` lists the old URLs and `scripts/check-urls.mjs` fails CI if one stops resolving.
- Built with Astro, motion with GSAP and ScrollTrigger, served by GitHub Pages. Every push to `master` builds and deploys through `.github/workflows/pages.yml`; pull requests build, run the URL check and upload the built site as an artifact.

## Working on it

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # dist/
npm run preview        # dist/ served the way GitHub Pages serves it, on http://127.0.0.1:8787
npm run check-urls     # against the preview
npm run build:fixture  # a smoke build from tests/fixtures/, never from the real folders
```

`?debug` on the homepage exposes the motion runtime on `window.__gw`; `?reduce` previews the reduced-motion version.

Publish a reviewed draft:

```bash
node scripts/publish-incident.mjs drafts/2026-11-07-slug.md
```

It validates the file, moves it into `incidents/`, builds, commits the file and pushes.

Build the archive from a Ghost export:

```bash
node scripts/ghost-to-archive.mjs ~/path/to/ghost-export.json --images ~/path/to/ghost/content/images
```

The Laravel version that ran here from 2016 to 2021 is tagged `laravel-2021`.
