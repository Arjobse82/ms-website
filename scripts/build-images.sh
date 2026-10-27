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

# Social share image: 1200x630 JPEG, made from the metadata-free WebP.
dwebp -quiet $out/granite-1600.webp -o $tmp/og.png
sips --resampleWidth 1200 $tmp/og.png >/dev/null
sips -c 630 1200 $tmp/og.png >/dev/null
sips -s format jpeg -s formatOptions 80 $tmp/og.png --out $out/og.jpg >/dev/null
echo "og.jpg  $(du -h $out/og.jpg | cut -f1)"
