# Trinity Engine website

A buildless, static HTML/CSS/JavaScript website for the current Trinity / Yggdrasil product. It explains the Cortex, Raven Agent and System Status groups. The website is not connected to the cognitive runtime.

## Files
- `index.html`: product overview, illustrative topology, subsystem architecture, workspace diagrams, Raven, reasoning and waitlist.
- `architecture.js/.css`: architecture views, sample Cockpit, rune modes and local evidence-staging preview.
- `topology.js`: keyboard-accessible illustrative graph and synthetic bathymetry.
- `refresh.css`, `landscape.css`: responsive corporate visual system and architecture diagrams.
- `navigation.js`: collapsed navigation below 1100px.
- `assets/ui-showcase.*`: diagram gallery and keyboard-accessible lightbox.
- `roadmap.html`, `privacy.html`, `terms.html`: supporting pages.

## Local preview
From the project root, run `python -m http.server 8877 --bind 127.0.0.1`. Open the local address printed by Python. This static server does not run the waitlist API.

## Boundaries
All graph positions, sample Cockpit tasks and gauges are illustrative. Rune selections and evidence notes affect page-session state only. No model execution, service control or system-of-record writes occur. Governed promotion is disabled. App capture placeholders are explicitly marked and must be replaced only with fresh, sanitized captures at least 1600px wide. Do not expose private paths, telemetry, keys or gateway addresses in public assets.

The old desktop gallery and pricing were removed at the owner's request. The Code Stack authorship copy remains unchanged. The original conceptual infographic is available as a reference, distinct from product screenshots.

## Waitlist and deployment
The existing form uses `window.WAITLIST_API_URL` when configured, otherwise `/api/waitlist`. Python sources and deployment configuration are preserved. The repository contains a GitHub Pages workflow and Vercel configuration, plus optional Google Cloud waitlist code; these are separate deployment paths. A static server alone cannot validate email persistence or notification delivery.

## Release gate
Do not deploy production before owner approval. Deploy a Vercel preview, test waitlist submission there, capture sanitized current-app screenshots, verify 1440/1024/768/390 layouts, and run mobile/desktop Lighthouse (performance >=85, accessibility >=95, SEO >=95). Record actual scores; static checks do not establish those scores. No production release or public hosting changes are part of the prepared source update.

## Approved visual rebuild
The owner requested publication of the visual rebuild in this session. The existing GitHub Pages deployment configuration is preserved. Local waitlist data and credentials remain ignored by Git. The static Pages host does not provide the Python waitlist endpoint; a configured external API is required for submissions.
