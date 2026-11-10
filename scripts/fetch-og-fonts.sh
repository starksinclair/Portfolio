#!/usr/bin/env bash
# Downloads the Inter and JetBrains Mono TTFs that make-og-image.py renders with.
# They are not committed; run this once before regenerating the card.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p fonts && cd fonts
for q in "Inter:wght@400;500;600" "JetBrains+Mono:wght@400;500"; do
  curl -s -A "Mozilla/4.0" "https://fonts.googleapis.com/css2?family=$q"
done | grep -o "https://[^)]*\.ttf" | sort -u | while read -r u; do
  curl -s -o "$(basename "$u")" "$u"
done
echo "fetched $(ls -1 ./*.ttf | wc -l | tr -d ' ') font files into scripts/fonts/"
