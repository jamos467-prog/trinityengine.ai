# Homepage redesign verification

Date: 21 November 2026
Scope: website only; no application changes.

## Static checks
- Historical fragment inventory: all 140 retained, no duplicate IDs.
- Same-page links and local image/script/stylesheet paths resolve in the source.
- Five gallery categories and 17 captures.
- Existing after-hours artwork remains inside Join Waitlist.
- JavaScript syntax: `node --check assets/homepage-redesign.js` passed.
- Structure regression: `python tools/check_homepage_structure.py` passed (BeautifulSoup required).

## Browser checks on local preview
- All 17 captures selected individually: exactly one active capture each time; no mobile horizontal page overflow.
- Operations opens with API traffic & roster; its gauges selector loads the correct image.
- Previous/next, category keyboard navigation, native enlargement dialog, Escape and focus restoration passed.
- Browser Back restores the preceding capture.
- Direct links to workspace-axis-detail, workspace-analytics, radar-reorganize, trinity-forge, unified-field and compression-next select or reveal the correct content.
- Unified-field Reset returns the expected 0.5362 centre value.
- Compression Next advances to input 2 of 3.
- Mobile menu opens and closes after navigation.
- Desktop and mobile default views have no horizontal page overflow.

## Default reading length
At matched CSS widths, with no fragment and default-closed disclosures:
- Desktop 1280px: 55,890px before; 11,116px after (80.1% less).
- Mobile 390px: 103,703px before; 14,036px after (86.5% less).
- Detailed content remains available. These figures describe the initial reading path, not deletion of that proportion of the content.
- Raw measurements: `homepage-scroll-metrics.json`.

## Publication
Live publication verification and screenshots pending at this revision.
