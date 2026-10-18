# Viveksreal

Vivek Jaglan’s creator and collaboration portfolio. Built with Next.js App Router, React, TypeScript, and CSS. The page uses real campaign media, self-hosted fonts, native video players, and direct contact links.

## Run locally

Run from this directory, which contains `package.json`:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The implementation was verified with Node.js 22.22.0.

## Production build

```sh
npm run build
npm start
```

The homepage is statically prerendered by Next.js. A Next.js host is still needed for its built-in image optimization; this is not configured as a plain HTML export. No secrets, database, email provider, or external runtime API is required.

For deployment, select the directory containing this `package.json` as the project root, use the Next.js framework preset, `npm ci` to install, and `npm run build` to build. On a Node server, run `npm start` after building. Do not upload the whole parent ReactNative directory.

No deployment, domain change, repository push, or production release has been performed. Search indexing is deliberately disabled in `app/layout.tsx` while content is under review. This setting is not access protection.

## Edit

- `app/content.ts`: campaign sources, contacts, offers, FAQs, and contextual email links.
- `app/page.tsx`: homepage structure and editorial copy.
- `app/audience-insights.ts`: matched follower geography, age/gender, and dates shared by both pages.
- `app/components/audience-insights.tsx` / `audience-map.tsx`: real local geography, data text, and interactive map; no external map service.
- `app/media-kit/`: integrated `/media-kit` route, separate evidence records, and route styles reusing homepage tokens.
- `app/components/campaign-brief.tsx`: editable campaign context and direct email draft; no delivery backend.
- `app/globals.css`: colour, typography, spacing, responsive behavior, and reduced motion.
- `app/components/`: navigation, video dialog, reveal behavior, and arrow icon.
- `app/components/hero-title.tsx`: measured masked-line reveal with the original server-rendered heading as fallback.
- `app/components/disclosure.tsx`: reversible measured-height enhancement for native FAQ and offer disclosures.
- `app/components/reel-playback.tsx`: coordinates one muted preview at a time, visibility, manual pause, and reduced-motion/data-saving preferences. Keep `ReelPlayer` inside `ReelPlaybackProvider`.
- `public/media/`: the three original campaign covers and videos.
- `app/fonts/`: two locally served Latin WOFF2 fonts and their licences.

To add reviewed captions, put the WebVTT file in `public/media/` and add `captions: [{ src: "/media/propeers.en.vtt", language: "en", label: "English" }]` to the corresponding campaign. No placeholder caption file is shipped.

## Review and launch preparation

See [finishing implementation](docs/FINISHING-IMPLEMENTATION.md), [content handoff](docs/HANDOFF.md), [asset manifest](docs/asset-manifest.json), and [verification notes](docs/VERIFICATION.md). Caption tracks, final media approval, and commercial copy review remain before a public launch. Unverified metrics and testimonials are intentionally absent.

Media Kit evidence and remaining data/media inputs: [Media Kit handoff](docs/MEDIA-KIT-HANDOFF.md).

Audience source, refresh rules, and geographic provenance: [audience map evidence](docs/AUDIENCE-MAP-EVIDENCE.md).
