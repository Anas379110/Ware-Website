# Ware Gulf editorial interface demo

Arabic RTL static interface built with Astro and self-hosted Noto Arabic fonts

This is a synthetic design demo and not a financial news service
The three example articles are original synthetic content clearly labeled on cards and article pages
No real financial figures market feeds ads accounts forms or analytics are enabled
Search indexing is disabled

## Local development

Node 22.23.4 or later is required

```sh
cd websites
npm ci
npm test
npm run lint
npx astro check
npm run build
npm run dev
```

## Free manual static hosting

Render static site with public Git source
Root directory websites
Build command npm ci && npm run build
Publish directory dist
Manual deployment only
No database or paid domain is required
Do not enable paid capacity or add billing details

## Content

Example articles are in websites/src/content/articles
Synthetic examples use syntheticDemo true
Each sample explains its artificial nature and contains no real event or financial recommendation
Original project planning documents remain as historical context and do not describe an operating newsroom

## Fonts

Self hosted Noto Arabic subsets are included under the SIL Open Font License
See websites/public/fonts/OFL.txt
