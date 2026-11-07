#!/bin/zsh
# Builds src/assets/js/assemblr-engine.js, the layout engine behind the Assemblr page's live demo, from Assemblr's own
# source: catalague-producer's src/core (pure TypeScript, no InDesign in it) at one commit, read with `git archive`, so
# that repo's working tree is never touched. Minified as the plugin's release build is, with its copyright banner.
#   ./scripts/build-assemblr-engine.sh [commit]     (default: the commit below; the repo is ../catalague-producer)
set -euo pipefail

root=${0:A:h:h}
repo=${ASSEMBLR_REPO:-$root/../catalague-producer}
commit=${1:-b8f80f9}
out=$root/src/assets/js/assemblr-engine.js
tmp=$(mktemp -d)
trap 'rm -rf $tmp' EXIT

git -C $repo archive $commit src/core | tar -x -C $tmp
full=$(git -C $repo rev-parse --short $commit)

# What the demo uses: the panel's preview solve (the same answer the page gets) and its drawing's controls (the line-up's
# axis, Pins' rows), the tracer hosts without a clipping path use (Photoshop's), the Photoshop host's pure placement maths,
# and the corner overlays' stacking.
cat > $tmp/entry.ts <<'EOF'
export { solvePreview, previewItems, mosaicChoices, sizeOfSpacing, clampAngle, ANGLE_LIMIT } from "./src/core/lineup/control.ts";
export { controlAxis, dragAxis, dragAngle, sizeFromDrag, alongLine, roomFrom, fanAngles } from "./src/core/lineup/control.ts";
export { resolveCounts, pinCounts, MAX_PIN_ROWS } from "./src/core/lineup/pins.ts";
export { DEFAULT_LINEUP, MODES, MAX_COLS, modeStart } from "./src/core/lineup/lineup.ts";
export { gridColumns, gridRows } from "./src/core/lineup/grid.ts";
export { traceAlpha, silhouette } from "./src/core/shape/trace.ts";
export { withBleed } from "./src/core/shape/subject.ts";
export { uprightHeight } from "./src/core/lineup/turn.ts";
export { imageTarget } from "./src/core/ps/apply.ts";
export { solveStack, stampMaster, overruns, DEFAULT_CORNER, CORNERS } from "./src/core/overlay/stack.ts";
EOF

npx esbuild $tmp/entry.ts --bundle --format=esm --minify --target=es2020 --legal-comments=none \
  --banner:js="/* Assemblr layout engine. Copyright (c) $(date +%Y) Monochrome Systems. All rights reserved. Built from catalague-producer $full (src/core) by scripts/build-assemblr-engine.sh: never edit, rebuild. */" \
  --outfile=$out --log-level=warning
echo "assemblr-engine.js  $(du -h $out | cut -f1)  ($full)"
