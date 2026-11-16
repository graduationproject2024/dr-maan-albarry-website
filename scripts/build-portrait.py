"""Prepare a new home-page portrait of Dr. Maan from an authentic photograph (DOCTOR_PORTRAIT_STATUS.md).

    python scripts/build-portrait.py path/to/photo.jpg [--focus-x 0.5] [--focus-y 0.38]

What it does: crops the photograph to the hero's 5:6 frame around the focus point (the face; fractions of the
width and height), and writes WebP copies 480, 800 and 1200 px wide to public/images/ — only the widths the
photograph can fill without being enlarged. It prints the PORTRAIT object to paste into doctor-data.js.

What it never does: enlarge, sharpen, retouch, change colours, remove the background or generate anything.
The pixels of the photograph are only cropped and scaled down (Lanczos). A photograph smaller than 480 px wide
after cropping is refused, because it would not improve on the current portrait.
"""
import argparse
import sys
from pathlib import Path
from PIL import Image, ImageOps

ap = argparse.ArgumentParser()
ap.add_argument('photo')
ap.add_argument('--focus-x', type=float, default=0.5)
ap.add_argument('--focus-y', type=float, default=0.38)
ap.add_argument('--out', default='public/images')
ap.add_argument('--name', default='dr-maan-portrait-hero')
a = ap.parse_args()

im = ImageOps.exif_transpose(Image.open(a.photo)).convert('RGB')
W, H = im.size
cw, ch = (W, round(W * 6 / 5)) if W * 6 / 5 <= H else (round(H * 5 / 6), H)
left = min(max(0, round(a.focus_x * W - cw / 2)), W - cw)
top = min(max(0, round(a.focus_y * H - ch / 2)), H - ch)
crop = im.crop((left, top, left + cw, top + ch))
widths = [w for w in (480, 800, 1200) if w <= cw]
if not widths:
    sys.exit(f'The 5:6 crop of this photograph is only {cw}x{ch} px. At least 480 px wide is needed '
             f'(recommended: a photograph at least 1600 px on its long side).')
out = Path(a.out)
files = []
for w in widths:
    h = round(w * 6 / 5)
    f = out / f'{a.name}-{w}.webp'
    crop.resize((w, h), Image.LANCZOS).save(f, 'WEBP', quality=84, method=6)
    files.append((f, w, h))
    print(f'wrote {f}  {w}x{h}  {f.stat().st_size // 1024} KB')
(f0, w0, h0), rest = files[0], files[1:]
rel = lambda f: 'images/' + f.name
print('\nPaste into doctor-data.js:\n')
print('export const PORTRAIT = Object.freeze({')
print(f"  src: '{rel(f0)}',\n  width: {w0},\n  height: {h0},\n  type: 'image/webp',")
print('  variants: Object.freeze([' + ', '.join(f"{{ src: '{rel(f)}', width: {w} }}" for f, w, _ in rest) + ']),')
print("  sizes: '(max-width: 639px) 62vw, (max-width: 1023px) 40vw, 420px',\n});")
print('\nThen: npm run build, and npx playwright test tests/hero-portrait.spec.js')
