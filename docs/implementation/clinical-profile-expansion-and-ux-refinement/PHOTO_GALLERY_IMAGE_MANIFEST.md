# Photo gallery image manifest

The manifest is currently **empty** (`GALLERY = []`).

## To add a photo
1. Strip EXIF and GPS data (for example `exiftool -all= photo.jpg`).
2. Resize to at most 2000 px, plus an 800 px thumbnail.
3. Place both files in `public/images/gallery/`.
4. Add an entry like this:
```js
{ id: 'conf-2024-redsea-01', category: 'conferences', image: 'images/gallery/x.webp', thumbnail: 'images/gallery/x-800.webp',
  width, height, alt: { ar, en }, caption: { ar, en }, date: '2024', event: { ar, en }, location: { ar, en },
  source: 'Dr. Maan (personal archive)', permission: { documented: true, reference: 'owner email ...', patientPrivacyReviewed: true },
  exifStripped: true, published: true }
```
5. Rebuild. The page, the menu item and the sitemap entry appear automatically.

## Candidate
- `images/dr-maan-redsea.jpg` (Saudi Ophthalmology 2024) needs a permission reference and an EXIF check first.
