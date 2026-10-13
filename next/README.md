# dhashu.com/next/ (preview build, v2, 13 Oct 2026 evening)

One self-contained `index.html` (about 3.4 MB). Fonts and images are inside the file. It does not touch the live page at the repo root. The `media/` folder and `/idea.html` must stay where they are.

## What changed in v2
- **Films play inside the page.** All three (The idea, How it works, App screens) have a play button on the poster. Click it and the film plays right there.
- **Expand button** on each film, top right. It opens a full-screen view. Close with the Close button, the Esc key, or a tap outside. On a phone held upright it suggests turning the phone sideways.
- If a video file fails to load, the player says so and links to the file.
- **Guru section rewritten.** It now says who Guru is (DhaShu's AI relationship navigator, not a counsellor or therapist), with four themes: Express your emotions, Keep romance alive, Manage expenses better, Resolve things together. A closed panel, "Where you meet Guru in the app", lists the stage headings.
- **Step 8 of "One couple's week"** shows the real Guru screen from the app (it was a "Guru screen coming" placeholder).

## Carried over from v1
- `noindex, nofollow`, so search engines skip this preview.
- Waitlist form: name (optional), email, city, "I am", age band. The endpoint is empty, so the form says "Preview... nothing was sent or saved". It never shows a fake thank-you. To turn it on, set `WAITLIST_ENDPOINT` in the page script. It sends `name, email, city, gender, age_band, source, submitted_at` as JSON.
- Footer legal text and company name.

## Still open before this replaces the root page
- Waitlist endpoint, terms and privacy pages, contact route.
- Placeholders: "PLACEHOLDER LIST" (verified stats), partner-logo slot, "PLACEHOLDER" (six months).
- "Intimacy" card label and "Consent, built in" section.
- The poster for "The idea" shows the app Home screen with an Intimacy item and a "Photo, ethnicity & health preferences" button. Check it against the no-appearance rule.

## Upload
1. GitHub, `dhashu-site` repo, open the `next` folder. Add file, Upload files, drag `index.html` (and `README.md`) in. Commit.
2. Optional: the same for `idea.html` and `share-card.jpg` (unchanged since last time).
3. Open https://dhashu.com/next/ and hard refresh (Ctrl+Shift+R). In the Watch section each film should show a play button and an Expand button.
Going live later: move `next/index.html` to the root as `index.html` after the endpoint works, and remove the noindex tags. The tag `v1-site` is the restore point.
