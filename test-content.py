from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json

root = Path(__file__).parent
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.ids=set(); self.refs=[]; self.repos=[]; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        if a.get('data-repo'): self.repos.append(a['data-repo'])
        for k in ('href','src'):
            if a.get(k): self.refs.append(a[k])

text=(root/'dist/index.html').read_text(encoding='utf-8')
page=Page(text)
data=json.loads((root/'github-sources.json').read_text(encoding='utf-8'))
known={r['name'] for r in data['repositories']}
assert len(page.repos)==6 and len(set(page.repos))==6
assert set(page.repos)<=known
assert data['profile']['name'] in text
assert data['profile']['public_repos']==len(data['repositories'])==22
assert not {'mindset','contact','motion-control'} & page.ids
assert 'language-toggle' in page.ids and '~/learning' not in text
assert 'fonts.googleapis.com' not in text and 'fonts.gstatic.com' not in text
assert not any(token in text for token in ['Bi?u t??ng','Lorem ipsum','hoangpc.dev'])
for ref in page.refs:
    url=urlsplit(ref)
    if url.scheme or url.netloc: continue
    target=unquote(url.path) or 'index.html'
    assert (root/'dist'/target).exists(),(ref,'missing file')
    if url.fragment and target=='index.html': assert unquote(url.fragment) in page.ids,(ref,'missing anchor')
print('PASS: profile identity, repository snapshot, six projects, removed sections and valid assets/anchors.')
