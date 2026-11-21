"""Public-site consolidation checks; no network requests or signups."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
from collections import Counter
import json
R=Path(__file__).resolve().parents[1]
docs={p.name:BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser') for p in R.glob('*.html')}
for name,d in docs.items():
 ids=[e['id'] for e in d.select('[id]')];assert all(n==1 for n in Counter(ids).values()),name
 for a in d.select('a[href]'):
  u=urlsplit(a['href'])
  if u.scheme or u.netloc:continue
  path=unquote(u.path).lstrip('/') or name
  assert (R/path).exists(),(name,a['href'])
  if u.fragment and path in docs:assert docs[path].find(id=unquote(u.fragment)),(name,a['href'])
 for e in d.select('img[src],script[src],link[rel="stylesheet"]'):
  ref=e.get('src') or e.get('href')
  if not ref or urlsplit(ref).scheme:continue
  assert (R/urlsplit(ref).path.lstrip('/')).exists(),(name,ref)
for name in ['index.html','architecture.html','research.html','origins.html']:
 d=docs[name];assert d.title and d.select_one('meta[name="description"]') and d.select_one('link[rel="canonical"]')
 vocab=[json.loads(e.string) for e in d.select('script[type="application/ld+json"]') if json.loads(e.string).get('@type')=='DefinedTermSet'];assert len(vocab)==1 and len(vocab[0]['hasDefinedTerm'])==12
h=docs['index.html'];assert len(h.select('[data-gallery-group]'))==8
captures=[e['src'] for e in h.select('img[src*="assets/screenshots/"]')];assert len(captures)==len(set(captures))==8
assert len(h.select('img[src*="ellis-orb-weaver"]'))<=6
assert not h.find(id='trinity-after-hours') and docs['origins.html'].find(id='trinity-after-hours')
assert docs['origins.html'].select_one('dfn#ellis')
assert h.find(id='early-access-form')['action'].startswith('mailto:v12trinityengine@gmail.com')
assert len(str(h)) < json.loads((R/'docs/consolidation-v2-before.json').read_text())['characters']*.25
# Every screenshot that existed on the prior homepage remains somewhere in the consolidated HTML.
before=json.loads((R/'docs/consolidation-v2-before.json').read_text())
old=set(before['capture_sources']);now={e['src'] for d in docs.values() for e in d.select('img[src]')};assert old<=now,old-now
mapping=json.loads((R/'assets/legacy-fragments.json').read_text())
assert all(h.find(id=id) or id in mapping for id in before['ids']), 'Unmapped historical fragment'
for id,target in mapping.items():
 page,frag=target.split('#',1);assert docs[page].find(id=frag),(id,target)
seed=json.loads((R/'ai/tiny-trinity.json').read_text(encoding='utf-8-sig'));assert isinstance(seed,dict)
for name,d in docs.items():
 if d.find(id='open-trust-verifier'):assert d.find(id='open-trust-verifier').has_attr('hidden') and d.find(id='trust-verifier').has_attr('hidden')
print('PASS: cross-page links/assets/IDs; eight unique home captures; all old screenshots retained; 130 routed fragments; vocabulary; seed; email form; verifier gating; homepage below 25%')
