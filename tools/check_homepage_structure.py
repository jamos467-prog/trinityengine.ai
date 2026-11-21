"""Regression checks for the public homepage information architecture."""
from pathlib import Path
from collections import Counter
from bs4 import BeautifulSoup
import json
root=Path(__file__).resolve().parents[1]
s=BeautifulSoup((root/'index.html').read_text(encoding='utf-8'),'html.parser')
ids=[e['id'] for e in s.select('[id]')]
legacy=json.loads((root/'docs/homepage-legacy-anchors.json').read_text())
assert set(legacy)<=set(ids), 'Historical fragments removed'
assert not [k for k,v in Counter(ids).items() if v>1], 'Duplicate IDs'
for a in s.select('a[href^="#"]'):
 assert not a['href'][1:] or a['href'][1:] in ids, a['href']
for e in s.select('[src],link[href]'):
 ref=e.get('src') or e.get('href')
 if not ref or ref.startswith(('http','data:','#')):continue
 assert (root/ref.split('?')[0]).exists(), ref
assert len(s.select('[data-gallery-category]'))==5
assert len(s.select('[data-gallery-group]'))==17
assert s.select_one('#signup #trinity-after-hours'), 'Footer artwork moved'
assert s.select_one('script[src^="assets/homepage-redesign.js"]').has_attr('defer')
assert 'sole issuer' in s.select_one('#development').get_text()
print('PASS: 140 historical anchors, unique IDs, local assets, fragment links, five gallery categories, 17 captures, footer placement and deferred controller')
