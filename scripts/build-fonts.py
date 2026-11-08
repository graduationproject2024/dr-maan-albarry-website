# Builds the self-hosted web fonts in public/fonts/ from the OFL-licensed @fontsource packages (devDependencies).
#
#   python scripts/build-fonts.py        (needs: fontTools + brotli;  npm ci first)
#
# Families (all SIL Open Font License 1.1, licence texts copied next to the fonts):
#   Noto Naskh Arabic 600      Arabic display        arabic subset, copied as published
#   IBM Plex Sans Arabic 400/600  Arabic text        arabic subset, copied as published
#   IBM Plex Sans 400/600      English text, and Latin inside Arabic text (digits, FRCS, CXL)   latin subset, copied
#   Newsreader (roman, italic) English display + every numeral (chapter numbers, ledger figures)
#       instanced from the variable opsz+wght font: optical size pinned to 48 (the display range 28-84 px),
#       weight kept variable 400-500 (roman) and pinned at 400 (italic), then subset to Basic Latin, Latin-1,
#       general punctuation and arrows. ~70 % smaller than the full variable file.
# Only the weights the stylesheet uses are shipped. style.css section 0 declares them (font-display: swap) and the
# metric-matched local fallbacks (scripts/measure-fallback-fonts.mjs).
import os, shutil
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NM = os.path.join(ROOT, 'node_modules')
OUT = os.path.join(ROOT, 'public', 'fonts')
os.makedirs(OUT, exist_ok=True)

COPY = {
    'noto-naskh-arabic-600.woff2': '@fontsource/noto-naskh-arabic/files/noto-naskh-arabic-arabic-600-normal.woff2',
    'plex-arabic-400.woff2': '@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2',
    'plex-arabic-600.woff2': '@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2',
    'plex-sans-400.woff2': '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2',
    'plex-sans-600.woff2': '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2',
}
for dst, src in COPY.items():
    shutil.copyfile(os.path.join(NM, src), os.path.join(OUT, dst))

UNICODES = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + list(range(0x2010, 0x2028)) + \
    list(range(0x2030, 0x203B)) + [0x2044, 0x2190, 0x2191, 0x2192, 0x2193, 0x2212, 0x00D7, 0x2116]

def newsreader(src, dst, wght):
    f = TTFont(os.path.join(NM, '@fontsource-variable/newsreader/files', src))
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'lnum', 'pnum', 'tnum', 'onum', 'case', 'ss01']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    s = subset.Subsetter(opts)
    s.populate(unicodes=UNICODES)
    s.subset(f)  # subset first (the instancer trips on the woff2 glyph order), then pin the optical size
    f = instancer.instantiateVariableFont(f, {'opsz': 48, 'wght': wght})
    subset.save_font(f, os.path.join(OUT, dst), opts)

newsreader('newsreader-latin-opsz-normal.woff2', 'newsreader-roman.woff2', (400, 500))
newsreader('newsreader-latin-opsz-italic.woff2', 'newsreader-italic.woff2', 400)

for pkg, name in [('@fontsource/noto-naskh-arabic', 'OFL-noto-naskh-arabic.txt'),
                  ('@fontsource/ibm-plex-sans-arabic', 'OFL-ibm-plex-sans-arabic.txt'),
                  ('@fontsource/ibm-plex-sans', 'OFL-ibm-plex-sans.txt'),
                  ('@fontsource-variable/newsreader', 'OFL-newsreader.txt')]:
    shutil.copyfile(os.path.join(NM, pkg, 'LICENSE'), os.path.join(OUT, name))

for f in sorted(os.listdir(OUT)):
    print(f'{os.path.getsize(os.path.join(OUT, f)):>8}  {f}')
