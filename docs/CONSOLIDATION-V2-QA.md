# Consolidation v2: work record and acceptance QA

Date: 21 November 2026. Scope: website only.

## Confirmed decisions
- Omit heavy rig move background from the founder bio.
- Signup benefit: early access announcements.
- No deployed signup backend is available; use an explicit email-request fallback.
- Preserve all real captures and move detailed material rather than deleting it.

## Page map and character counts
- Before: index.html 191,499 characters.
- P1: split into Home (12 main sections), Architecture (15 sections including the full gallery), Research (6 sections), Origins (4 sections plus vocabulary). Home 29,970 characters.
- P2–P5: memory consolidation, unique captures, founder/cycle scaffolds, copy edits. Home 29,764 characters.
- P6: shared navigation/footer, 12-term JSON-LD, provenance attributes and fragment ownership. Home 36,028 characters.
- P7: email fallback, migration module, cache versions and roadmap. Home 36,081 characters (18.8% of original; 81.2% smaller by source character count).
- Eight homepage captures, all unique. The full 21-capture gallery is on architecture.html.

## Files and summary diff by block
- P1: index.html, architecture.html, research.html, origins.html. Move full engineering, research and identity sections into dedicated pages; keep the short product journey on Home.
- P2: index.html, architecture.html, origins.html. Merge memory; remove duplicate Home screenshots; relocate guardian identity and after-hours art.
- P3: index.html. Add seven explicit cycle placeholders and link Cycle Inspection.
- P4: index.html and shared footer. Add founder account and evidence links; About targets founder.
- P5: public HTML pages, assets/cryptographic-trust.js. Revise development-method claims, visible Convergence wording and provenance labels. Preserve historical fragment names as compatibility identifiers.
- P6: public HTML pages, llms.txt, assets/legacy-fragments.json and .js. Publish consistent 12-term vocabulary, typed provenance and moved-anchor routing.
- P7: assets/site-v2.css, assets/site-v2.js, assets/homepage-redesign.js, roadmap.html, sitemap.xml, public navigation/footer links and regression checks. Hide dormant verifier; add transparent mail fallback; organize Now/Next/Later.

## Item-by-item acceptance
- PASS P1.1 — architecture.html contains complete ACi boundary, moat, trust, emergence, landscape, Oracle Policy and neuron material.
- PASS P1.2 — research.html contains topology, anchor/field, unified-field demo, compression demo, relational demo, Khepri, Klein Mirror, Tiny_Trinity and federation; all five requested resource links are present.
- PASS P1.3 — origins.html retains full ELLIS/DKMU/Liber Sigillum material, symbolic role cards and runes.
- PASS P1.4 — shared header, nav, footer, skip link, theme, titles, descriptions and canonical URLs.
- PASS P1.5 — Home follows the requested 12-section order, with footer, and is below one quarter of its prior source length.
- PASS P2.1 — one Home memory section.
- PASS P2.2 — eight Home screenshot assets, eight unique URLs; no repeated LTKG or Radar image.
- PASS P2.3 — guardian Raven identity moved to Origins; Home uses Huginn/Muninn.
- PASS P2.4 — landscape block moved to Architecture.
- PASS P2.5 — after-hours art moved to Origins.
- PASS P3.1 — seven empty cycle evidence slots, each exactly [PLACEHOLDER]; no invented outputs.
- PASS P3.2 — link selects the Cycle Inspection capture.
- PASS P4.1 — Founder & architect heading.
- PASS P4.2 — James Sapsford account retains the requested facts; optional background omitted as confirmed.
- PASS P4.3 — evidence line links Session Analytics and Canyon Runner; error/fallback figures remain a placeholder; no reliability-causation claim.
- PASS P4.4 — footer About points to index.html#founder.
- PASS P5.1 — code-stack text describes human architectural direction, AI implementation and recursive review; unsupported blanket claims removed.
- PASS P5.2 — visible Singularity Event wording becomes Convergence Event; compatibility fragment names remain valid.
- PASS P5.3 — specified third-person provenance phrases removed from visible public HTML.
- PASS P5.4 — one top-level research-preview status; short Home capture labels; detailed qualifications retained on depth pages and the Canyon Runner evidence disclosure.
- PASS P6.1 — two Home ELLIS marks; concept-art recurrence removed. Embedded original artwork pixels are unchanged.
- PASS P6.2 — twelve-term DefinedTermSet, data-ellis/from/to, llms.txt and dfn#ellis; Tiny_Trinity seed parses and its opt-in design is retained.
- PASS P7.1 — verifier trigger disabled/hidden and dialog hidden/inert; code retained; publication-pending message visible.
- PASS P7.2 — visible labelled email form with native validation and approved mailto fallback. No nonexistent HTTP endpoint or false registration success is used.
- PASS P7.3 — zero dead local HTML links/anchors; 130 moved homepage fragments route to valid destinations.
- PASS P7.4 — Roadmap Now: Coding UI/Radar/Huginn/Muninn; Next: signing/key/Forge/benchmark; Later: federation. No World Tree art-direction task.
- PASS P7.5 — sitemap contains new pages; all moved content images are lazy-loaded, including generated gallery thumbnails; mobile 375px has no page overflow in tested views.

## Browser and source checks
- python tools/check_site_v2.py: PASS (links, assets, IDs, screenshot preservation, routing, vocabulary, seed, email form, verifier gating and size).
- node --check for site-v2.js, homepage-redesign.js, legacy-fragments.js and cryptographic-trust.js: PASS.
- All eight Home captures select individually; enlargement and Escape work.
- Old index#unified-field routes to Research and Reset reports 0.5362 at the synthetic centre.
- Old index#workspace-axis-detail routes to the Architecture capture library.
- Compression Next advances to input 2 of 3; Klein traversal reports reversed local orientation.
- Invalid email is rejected without launching a draft. No email delivery or registration has been claimed or tested.
- New-page mobile navigation and verifier gating tested. No browser console errors observed in these checks.

## Signup mechanism and endpoint
- Prior intended HTTP endpoint: POST /api/waitlist. A read-only public GET check returned HTTP 404 on GitHub Pages.
- Approved replacement: mailto:v12trinityengine@gmail.com with subject Trinity Engine early access and the user's typed email in the request body.
- JavaScript prepares the draft; the user's configured mail app sends it. Without JavaScript, the form has a native mailto action.
- This static website stores no signup address and never reports the user as automatically registered. Delivery depends on the user's mail client and final Send action.

## Consolidated outstanding content
1. Worked cycle — question: [PLACEHOLDER].
2. Worked cycle — ENG summary: [PLACEHOLDER].
3. Worked cycle — SYNTH summary: [PLACEHOLDER].
4. Worked cycle — divergence reading: [PLACEHOLDER].
5. Worked cycle — PRIME arbitration, if invoked: [PLACEHOLDER].
6. Worked cycle — final answer: [PLACEHOLDER].
7. Worked cycle — material staged for LTKG: [PLACEHOLDER].
8. Founder evidence — Session Analytics error/fallback figures: [PLACEHOLDER].

The cycle must come from an actual Session Console record. No signup-benefit or biography question remains unresolved.

## Publication record
Pending commit, deployment and live verification.
