/* ═══════════════════════════════════════════════════════════════════════
   content.js — everything you will want to change lives here.
   Edit this file alone to update copy, stages, principles or cities.
   No markup, no styling. app.js renders it; styles.css styles it.

   `icon` values refer to symbols in the SVG sprite at the top of
   index.html. Available: target, shield, calendar, exchange, document,
   sprout, lock, heart, question, clock, trend, check, speech, hearts,
   wallet, handshake, compass, ring, wedding.

   Stage `tone` values: green, rose, amber, plum. They set the icon
   colour and the card tint in styles.css (.tone-green and friends).
   ═══════════════════════════════════════════════════════════════════════ */

window.DHASHU = {

  /* ── sticky navigation ───────────────────────────────────────────── */
  nav: [
    { id: 'watch',     label: 'Watch' },
    { id: 'arc',       label: 'The arc' },
    { id: 'plan',      label: '169 days' },
    { id: 'week',      label: 'Each week' },
    { id: 'guru',      label: 'Guru' },
    { id: 'verify',    label: 'Verification' },
    { id: 'principles',label: 'Principles' }
  ],
  navCta: 'Join waitlist',

  /* ── the top of the page ─────────────────────────────────────────── */
  hero: {
    operator: 'Shuddha Sangama · Bengaluru',
    wordmark: 'DhaShu',
    tagline: 'Built for meaningful relationships that last — not just matches that spark.',
    meta: [
      ['Registrations', 'open mid-November'],
      ['First cities', 'Delhi NCR · Mumbai · Bengaluru']
    ],
    seal: {
      devanagari: 'शुद्ध', line1: 'Purity', line2: 'Reengineered',
      /* two lines, printed under the circle */
      caption: ['Start with Truth,', 'Build with Trust.']
    },
    cta: 'Join the waitlist'
  },

  /* ── the four films ──────────────────────────────────────────────────
     Each item renders one of three ways, in this order of precedence:
       embed : 'idea.html'          → played inline in an iframe
       src   : 'media/thing.mp4'    → played inline in a <video>
       href  : 'https://…'          → poster still that opens elsewhere
     Options per item:
       wide  : true                 → spans the full row (use for anything
                                      portrait, or long enough to deserve it)
       fit   : 'contain'            → letterbox instead of crop; required for
                                      portrait footage or it gets cropped
       ratio : '3/4' | '16/9'       → frame shape; defaults to 16/9          */
  watch: {
    eyebrow: 'Watch',
    heading: 'Four films, start to finish',
    lede: 'Why DhaShu exists, what happens on which day, what the app actually looks like, and the thirty-five second version.',
    items: [
      {
        title: 'The idea',
        body: 'What is going wrong — the fraud, the loneliness, the apps that profit from you never stopping — and the three-step answer we built instead: match the end goal, verify the facts, then build the chemistry.',
        meta: '3:04 · plays here',
        poster: 'media/film-poster.jpg',
        embed: 'idea.html',
        wide: true
      },
      {
        title: 'How it works',
        body: 'One week, end to end — recorded from the app itself. Reality Check, the three matches, weekend slots, the overlap, the signed agreement, the date, the debrief, and the next cycle.',
        meta: '2:13 · no sound',
        poster: 'media/calendar-poster.jpg',
        src: 'media/calendar-explainer.mp4',
        wide: true,
        fit: 'contain',
        ratio: '3/4'
      },
      {
        title: 'App screens',
        body: 'A walkthrough of the product itself — vision, stats, identity, REACH, the week, a match and Guru, screen by screen from the live app.',
        meta: '1:30 · no sound',
        poster: 'media/app-screens-poster.jpg',
        src: 'media/app-screens.mp4'
      },
      {
        title: 'The promo',
        body: 'Thirty-five seconds on why perpetual searching fails, and what replaces it.',
        meta: '0:35 · sound on',
        poster: 'media/promo-poster.jpg',
        src: 'media/dhashu-promo.mp4'
      }
    ]
  },

  /* ── the four stages ─────────────────────────────────────────────── */
  arc: {
    eyebrow: 'The arc',
    heading: 'Four stages, and you decide where to stop',
    lede: 'Most apps end at the match. DhaShu is built for what comes after it, with a different set of questions, agreements and support at each stage.',
    /* this phrase is drawn out of the lede above and emphasised */
    highlight: 'Most apps end at the match.',
    stages: [
      { icon: 'sprout',  tone: 'green', name: 'Dating',       body: 'One candidate at a time, on a weekly rhythm. Expectations set in writing before the first meeting.' },
      { icon: 'heart',   tone: 'rose',  name: 'Relationship', body: 'Exclusivity acknowledged. Routines, obligations and availability mapped so the weeks ahead are real, not assumed.' },
      { icon: 'ring',    tone: 'amber', name: 'Engaged',      body: 'The conversations most couples postpone — money, family, children, where you live — worked through properly.' },
      { icon: 'wedding', tone: 'plum',  name: 'Married',      body: 'A playbook you wrote together, revisited as life changes it.' }
    ],
    note: 'Nothing here is required. A couple who want to date and stop there have not failed at anything.'
  },

  /* ── the 169-day plan ────────────────────────────────────────────── */
  /* segment days must add up to `span`. The wedding sits on span + 1.  */
  plan: {
    eyebrow: 'The 169-day plan',
    heading: 'A paced route from the first date to a wedding',
    lede: 'For people who already know what they want, the stages have a suggested length. It is a template, not a rule — take longer at any stage, or stop wherever you choose.',
    quote: 'Stop perpetually looking. Start matching with people who want the same life you do.',
    span: 168,
    tickEvery: 28,
    segments: [
      { name: 'Dating',       weeks: 4,  days: 28  },
      { name: 'Relationship', weeks: 16, days: 112 },
      { name: 'Engaged',      weeks: 4,  days: 28  }
    ],
    finish: { day: 169, label: 'Wedding' },
    footnote: 'Structure, clarity and the assistance you need — for a meaningful, beautiful journey to your partner for life.'
  },

  /* ── how a week works ────────────────────────────────────────────── */
  week: {
    eyebrow: 'How a week works',
    heading: 'Dating with a cadence and a finish line',
    lede: 'No endless scroll. Each week has a shape, and by Sunday evening you know where you stand.',
    rows: [
      { when: 'Mon – Wed',     title: 'One candidate, revealed', body: 'Not a deck of fifty. One person who is genuinely open to someone like you, with their verified details attached.' },
      { when: 'Wed eve – Thu', title: 'Availability set',        body: 'Both of you mark real windows. The calendar closes Thursday, so nobody is left waiting on a maybe.' },
      { when: 'Fri – Sun',     title: 'The date',                body: 'Breakfast, lunch, coffee or dinner, agreed in advance — including who pays and the budget you both chose.' },
      { when: 'Sun evening',   title: 'Lock in, or close it',    body: 'Carry on together, or end it in words. Either way it is stated. Nothing is left hanging.' }
    ]
  },

  /* ── Guru ────────────────────────────────────────────────────────── */
  guru: {
    eyebrow: 'Guru',
    heading: 'Your AI relationship navigator',
    lede: 'With you at every stage, from dating through married. Differences, romance, money, mediation — assistance at the moment you need it.',
    icon: 'compass',
    pillars: [
      { icon: 'speech',    name: 'Air and resolve differences', body: 'A structured space to voice disagreements and work through them together.' },
      { icon: 'hearts',    name: 'Keep romance alive',          body: 'Nudges and ideas that protect intentionality as life gets busier.' },
      { icon: 'wallet',    name: 'Expenses handling',           body: 'Helps you manage your money together — track what you spend, apply the split you agreed, and plan for what is coming.' },
      { icon: 'handshake', name: 'Mediator',                    body: 'Brings in best-practice guidance and mediates when you are both stuck.' }
    ],
    note: 'Guru never decides for you. It asks the question that moves the conversation on, and keeps what each of you says private until you choose to share it.'
  },

  /* ── verification ────────────────────────────────────────────────── */
  verify: {
    eyebrow: 'Verification',
    heading: 'Checked before you ever meet',
    lede: 'Verification runs through licensed background-check partners. Each field below is confirmed against a source record, not taken on trust.',
    fields: [
      'Age and date of birth',
      'Nationality',
      'Identity, matched to a live face capture',
      'Employment history',
      'Education',
      'Salary band, confirmed against income tax records'
    ],
    photo: {
      heading: 'Your photograph',
      body: 'One standard passport or visa photograph, plus a live face capture taken once and matched against it. The photograph is what your match sees. The capture is only ever used to prove you are the person in it.'
    },
    custody: {
      lead: 'We do not keep your documents.',
      body: 'Identity numbers go straight to the verification partner. What comes back to us is a result and a reference — never the document itself.'
    }
  },

  /* ── the twelve principles ───────────────────────────────────────── */
  principles: {
    eyebrow: 'What we commit to',
    heading: 'Twelve principles the product is built on',
    lede: 'Not aspirations. Each one is a mechanism you will meet somewhere in the journey.',
    items: [
      { icon: 'target',   title: 'One at a time, by design',             body: 'An antidote to choice overload. Attention given to one person is worth more than attention split across forty.' },
      { icon: 'shield',   title: 'Verified before you ever meet',        body: 'Security at the core, not a paid upgrade. Age, identity, employment, education and salary confirmed by licensed partners.' },
      { icon: 'calendar', title: 'A weekly rhythm, not an endless scroll', body: 'Matches arrive, availability is set, dates happen. Dating gets a cadence and a finish line.' },
      { icon: 'exchange', title: 'REACH — the reality check',           body: 'Matching reads both directions: what you are looking for, and who is genuinely open to you. Expectations align before hope is invested.' },
      { icon: 'document', title: 'Expectation-setting playbooks',        body: 'The invisible fairness contract, made visible. No guessing games, and no suspicion of being taken advantage of.' },
      { icon: 'sprout',   title: 'Feedback that coaches, not punishes',  body: 'Post-date reflections come back as private growth notes. Room to improve, rather than a rating that follows you.' },
      { icon: 'lock',     title: 'Consent architecture',                 body: 'Expectations are disclosed. Consent is never presumed, and never recorded in advance of the moment.' },
      { icon: 'heart',    title: 'Guru, for the long arc',               body: 'Couple wellbeing at the centre. Quality connection built with patience, not urgency.' },
      { icon: 'question', title: 'Difficult questions, facilitated',     body: 'A forum for the conversations couples systematically avoid, paced to your own comfort and readiness.' },
      { icon: 'clock',    title: 'Room to express yourself',             body: 'Space to work out what you actually think before you have to say it. Calm, and free of performance pressure.' },
      { icon: 'trend',    title: 'Success-aligned revenue',              body: 'We earn when people progress. A platform that profits from you staying single has the wrong incentive.' },
      { icon: 'check',    title: 'Closure, not ghosting',                body: 'Every ending is stated. No message left undelivered, and every pairing closes with clarity.' }
    ]
  },

  /* ── waitlist ────────────────────────────────────────────────────── */
  join: {
    eyebrow: 'Waitlist',
    heading: 'Be among the first in your city',
    lede: 'We open a city only when there are enough people on both sides for a real match. Your city and age band tell us when that is. No payment now, and nothing shared with anyone.',
    /* grouped dropdown. Each group becomes an <optgroup>; add a city by
       dropping it into the right list.                                   */
    cityGroups: [
      { label: 'Metro India', options: [
          'Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad',
          'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'
      ]},
      { label: 'Elsewhere in India', options: [
          'Chandigarh', 'Jaipur', 'Lucknow', 'Indore', 'Kochi',
          'Coimbatore', 'Surat', 'Nagpur', 'Bhubaneswar',
          'Another city in India'
      ]},
      { label: 'Outside India', options: [
          'United States', 'Canada', 'United Kingdom', 'Ireland',
          'United Arab Emirates', 'Qatar', 'Saudi Arabia', 'Singapore',
          'Australia', 'New Zealand', 'Germany', 'Netherlands',
          'Another country'
      ]},
    ],
    genders: ['A woman', 'A man'],
    ageBands: ['25–29', '30–34', '35–39', '40–44', '45–50', 'Over 50'],
    consent: 'We use these four answers to decide which city opens next, and to email you when yours does. Nothing else. You can ask us to delete your details at any time and we will.',
    button: 'Join the waitlist'
  },

  /* ── footer ──────────────────────────────────────────────────────── */
  footer: {
    operator: { label: 'Operated by', lines: ['Shuddha Sangama Private Limited', 'Bengaluru, Karnataka, India'] },
    contact:  { label: 'Contact', email: 'shuddha.sangama@gmail.com', phone: '+91 99860 06265' },
    status:   { label: 'Status', lines: ['Pre-launch. Registrations open mid-November 2026.', 'Matching opens once a city reaches density.'] },
    fine: 'DhaShu is a matchmaking platform. The playbooks and agreements it helps couples record are their own statements to each other — they are not prenuptial agreements, marital contracts, or legally binding instruments of any kind, and they create, alter or waive no legal right. Background verification is carried out by licensed third-party partners; verification confirms records held by those sources and is not a guarantee about any person. Available checks vary by country. Terms of service and privacy policy will be published before registrations open.',
    copyright: '© 2026 Shuddha Sangama Private Limited.',
    motto: 'purity arrived at through honesty, effort and transformation.'
  },

  /* ── waitlist delivery ───────────────────────────────────────────────
     Point this at your own POST route once the backend is live, e.g.
     'https://dhashu.com/api/waitlist'. It receives JSON:
       { email, city, gender, age_band, source, submitted_at }
     Leave it empty and the form validates and confirms locally without
     sending anything, which is what you want while previewing.        */
  endpoint: ''
};
