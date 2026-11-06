# git.wtf

One real Git fuck-up a day, retold deadpan, under a sign that counts the days since the last one.

From 2016 to 2025 this domain was a blog about fixing Git. Those posts are still here, unchanged, at their old URLs, listed at [/archive/](https://git.wtf/archive/).

## How it works

- `incidents/YYYY-MM-DD-slug.md`: one file per incident. Front matter: `date`, `title`, `category`, `source_url`, `source_date`, `status`. The body is the retelling, three or four sentences. The counter on the homepage is computed in the browser from the latest incident's date, so it climbs without a deploy.
- `archive/<slug>.md`: the old posts, written by `scripts/ghost-to-archive.mjs` from a Ghost export. The body is the post's html.
- `public/_redirects`: every old tag, category, author, AMP and feed URL. `tests/old-urls.txt` lists the old URLs and `scripts/check-urls.mjs` fails CI if one stops resolving.
- Built with Astro, served from Cloudflare Workers as static files, deployed by GitHub Actions on every push to `master`.

## Working on it

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # dist/
npm run preview        # dist/ served the way Cloudflare serves it, with the redirects
npm run check-urls     # against the preview
```

Publish a reviewed draft:

```bash
node scripts/publish-incident.mjs drafts/2026-11-07-slug.md
```

It validates the file, moves it into `incidents/`, builds, commits the file and pushes.

Convert a Ghost export:

```bash
node scripts/ghost-to-archive.mjs ~/path/to/ghost-export.json --images ~/path/to/ghost/content/images
```

The Laravel version that ran here from 2016 to 2021 is tagged `laravel-2021`.
