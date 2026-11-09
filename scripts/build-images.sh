#!/bin/zsh
# Builds the web images in src/assets/img from the originals in git-ignore/assets.
# macOS only (sips + cwebp). The originals stay out of git; the output is committed.
# cwebp drops all metadata (EXIF, GPS, camera data) by default.
set -euo pipefail

root=${0:A:h:h}
src=$root/git-ignore/assets
out=$root/src/assets/img
tmp=$(mktemp -d)
trap 'rm -rf $tmp' EXIT
mkdir -p $out

# name  source file  rotate (degrees clockwise, to undo the EXIF orientation)  widths
build() {
  local name=$1 file=$2 rotate=$3; shift 3
  local base=$tmp/$name.png
  sips -s format png $src/$file --out $base >/dev/null
  [[ $rotate != 0 ]] && sips -r $rotate $base >/dev/null
  for w in $@; do
    sips --resampleWidth $w $base --out $tmp/$name-$w.png >/dev/null
    cwebp -quiet -q 78 -m 6 $tmp/$name-$w.png -o $out/$name-$w.webp
    echo "$name-$w.webp  $(du -h $out/$name-$w.webp | cut -f1)"
  done
}

build facade      IMG_0205.JPG 0   800 1600 2400
build granite     L1061424.JPG 0   800 1600 2400
build granite-tall L1061422.JPG 270 800 1600
build frame-multiplier frame-multiplier-heroL1062024.JPG 0 800 1600 2400
build bloom      bloom-preflight-L1060980.JPG 0 800 1600 2400
# The About page's hero.
build about      L1061270.JPG 0 800 1600 2400
# The poster of Assemblr's intro video: the video's own thumbnail (i.ytimg.com/vi/fQn1EZXqsBs/maxresdefault.jpg).
build assemblr-intro assemblr-intro.jpg 0 800 1280

# Studio Tools' plugin icon, cropped square: 336 px, for the largest place it shows (168 px) at 2×.
sips -s format png $src/studio-tools-icon-figma-plugin.png --out $tmp/st.png >/dev/null
side=$(sips -g pixelWidth -g pixelHeight $tmp/st.png | awk '/pixel/ {print $2}' | sort -n | head -1)
sips -c $side $side $tmp/st.png >/dev/null
sips -Z 336 $tmp/st.png >/dev/null
cwebp -quiet -q 86 -m 6 $tmp/st.png -o $out/studio-tools-icon.webp
echo "studio-tools-icon.webp  $(du -h $out/studio-tools-icon.webp | cut -f1)"

# The example objects in Assemblr's drawings and live demo (src/_lib/shapes.js): ten 3D shapes, cut-outs, so the alpha
# is kept (cwebp's alpha is lossless by default, and the demo measures it). Not built here: each is a transparent PNG
# trimmed to its visible edge plus a 3 % margin, 800 px tall (sips cannot trim by alpha), then cwebp -q 82 -m 6 into
# src/assets/img/shape-<key>.webp. The bounding boxes in shapes.js are measured from that trim; redo both together.

# A product's tour: its Figma Community carousel (git-ignore/assets/carousels), in order. Screens with text in them, so
# a higher quality than the photos, never tinted or turned. 960 and 1920 wide, as made (16 : 9).
slides() {
  local name=$1; shift
  local n=0
  for file in "$@"; do
    n=$((n + 1))
    for w in 960 1920; do
      sips -s format png --resampleWidth $w "$src/carousels/$file" --out $tmp/$name-$n-$w.png >/dev/null
      cwebp -quiet -q 88 -m 6 $tmp/$name-$n-$w.png -o $out/$name-$n-$w.webp
    done
    echo "$name-$n.webp  $(du -h $out/$name-$n-1920.webp | cut -f1)"
  done
}
slides bloom-tour bloom-preflight/bloom_carousels-1.png bloom-preflight/bloom_carousels-0{2..6}.png
slides frame-multiplier-tour "frame-multiplier/Frame "{1..8}.png

# Social share image: 1200x630 JPEG, made from the metadata-free WebP.
dwebp -quiet $out/granite-1600.webp -o $tmp/og.png
sips --resampleWidth 1200 $tmp/og.png >/dev/null
sips -c 630 1200 $tmp/og.png >/dev/null
sips -s format jpeg -s formatOptions 80 $tmp/og.png --out $out/og.jpg >/dev/null
echo "og.jpg  $(du -h $out/og.jpg | cut -f1)"
