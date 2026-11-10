#!/usr/bin/env python3
"""Quality check for the BRM Consulting website.

Run from the repository root:  python3 tools/check_site.py

Checks that
  * every data-i18n key in index.html has a Nepali translation in js/i18n.js,
  * every local file referenced by index.html (src/href) exists,
  * every in-page link (#id) points to an element that exists,
  * no em dashes slipped into the visible English or Nepali text.
Exits with status 1 if anything fails, so it can run in GitHub Actions.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "index.html").read_text(encoding="utf-8")
i18n = (ROOT / "js" / "i18n.js").read_text(encoding="utf-8")
problems = []

keys = set(re.findall(r'data-i18n="([^"]+)"', html))
ne_keys = set(re.findall(r'^\s*"([^"]+)":', i18n, flags=re.M))
for k in sorted(keys - ne_keys):
    problems.append(f"missing Nepali translation: {k}")

for ref in re.findall(r'(?:src|href)="([^"#:?]+)"', html):
    if not (ROOT / ref).exists():
        problems.append(f"missing file: {ref}")

ids = set(re.findall(r'\sid="([^"]+)"', html))
for anchor in set(re.findall(r'href="#([^"]+)"', html)):
    if anchor not in ids:
        problems.append(f"broken in-page link: #{anchor}")

for name, text in (("index.html", html), ("js/i18n.js", i18n), ("js/services.js", (ROOT / "js" / "services.js").read_text(encoding="utf-8"))):
    if "—" in text:
        problems.append(f"em dash found in {name}")

print(f"{len(keys)} translated keys, {len(ids)} ids checked")
if problems:
    print("\n".join(problems))
    sys.exit(1)
print("All checks passed.")
