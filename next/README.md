# dhashu.com/next/ (preview build, patched)

One self-contained `index.html` (about 3.3 MB). Fonts and images are inside the file. It does not touch the live page at the repo root.

## Changed from the Claude Design file
- `noindex, nofollow` added, so search engines skip this preview.
- "See it end to end" now links to `/idea.html`.
- Waitlist form uses the same fields and checks as the live form: email, city, "I am", age band, with the same privacy line. Name is optional.
  - The endpoint is empty, so the form shows "Preview. ... nothing was sent or saved." It never shows a fake thank-you.
  - To turn it on, set `WAITLIST_ENDPOINT` in the page script to your POST route. The form sends `name, email, city, gender, age_band, source, submitted_at` as JSON, the same shape as the live form.
- Footer carries over the live site's legal fine print and the company name (Shuddha Sangama Private Limited).
- City chips now include "Elsewhere in India" and "Outside India".

## Still open before this replaces the root page
- The waitlist endpoint does not exist yet.
- Visible placeholders: "PLACEHOLDER LIST" (verified stats), "PLACEHOLDER" (six months), the partner-logo slot, the film slot.
- Founder text has typos (see the chat note).
- Decisions on the "Intimacy" card label and the "Consent, built in" section.

## Upload
1. GitHub, `dhashu-site` repo: Add file, Create new file, type `next/.keep`, commit.
2. Add file, Upload files, upload `index.html` (and this README) into `next/`.
3. Open https://dhashu.com/next/ on a phone and a laptop (hard refresh).
Going live later: move `next/index.html` to the root as `index.html` after the endpoint works. The tag `v1-site` is the restore point.
