# dhashu.com/next/ (preview build, final for this deploy)

`index.html` is self-contained (fonts and images inside). `share-card.jpg` is the link-preview image (1200x630). It reads films and posters from `/media/...` at the repo root, so leave `media/` where it is.

## What is in this build
- noindex, nofollow, so search engines skip it until you swap it to the root.
- Watch section with three films: The idea (opens `/idea.html` in a new tab), How it works, App screens. The promo is left out on purpose.
- Waitlist form: name (optional), email, city, "I am", age band. Endpoint is empty, so it says "Preview... nothing was sent or saved". To turn it on, set `WAITLIST_ENDPOINT` in the page script.
- Founder text corrected. `lang="en"` set. Link-preview tags (title, description, image) set.
- Footer carries the legal fine print and "Shuddha Sangama Private Limited".

## Still open before this replaces the root page
- Waitlist endpoint does not exist yet.
- Visible placeholders: verified-stats list, "six months", partner-logo slot.
- Decisions on the "Intimacy" card and the "Consent, built in" section.

## Upload (also changes idea.html at the repo root)
1. Repo root: Add file, Upload files, `idea.html` (replaces the old one). Commit.
2. Inside `next/`: Add file, Upload files, `index.html`, `share-card.jpg`, `README.md`. Commit.
3. Hard refresh https://dhashu.com/next/ on phone and laptop.
