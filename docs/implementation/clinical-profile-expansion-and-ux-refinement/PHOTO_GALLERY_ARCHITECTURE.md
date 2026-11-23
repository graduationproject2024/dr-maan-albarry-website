# Photo gallery architecture

## Data
- `clinical-profile.js` holds `GALLERY`, `GALLERY_CATEGORIES` and `isPublishablePhoto()`.
- `isPublishablePhoto()` passes a photo only if it has:
  - `published` set;
  - an image;
  - alt text in Arabic and English;
  - a documented permission with a reference;
  - `exifStripped` set;
  - for the operating room, `patientPrivacyReviewed` set.

## Route
- A section-registry entry `gallery` gives `/gallery/` and `/en/gallery/`.
- It is published only when at least one photo passes the check.
- Until then it is absent from routes, menus, footer, sitemap, prerender and llms.txt (tested).

## Module (`src/gallery/`)
Loaded lazily, with no dependencies. It provides:
- filter chips with counts;
- a CSS-columns grid that keeps each photo's natural aspect ratio;
- a `<dialog>` lightbox with:
  - previous / next buttons;
  - RTL-aware arrow keys and swipe;
  - Esc and backdrop close;
  - focus returned to the opening thumbnail;
  - scroll lock while open;
- captions and metadata.

## Testing
- `gallery-preview.html` is a harness page built only in test builds (`CSIM_HARNESS`), with `noindex`.
- Its test fixtures reuse the Red Sea conference photo and are never published.

## Status
- No photographs have been supplied, so the gallery is not live.
