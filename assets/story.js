/* DhaShu Story Home. Intro, then one screen per scene. The last answer leads straight to the home page.
   No dependencies, no build step. Config lives in index.html (window.STORY_CONFIG). */
(function () {
  'use strict';

  var CFG = { HOME_URL: '/home.html', REVEAL: 'each', LENGTH: 'full', PHOTOS: {} };
  var uc = window.STORY_CONFIG || {};
  for (var key in uc) if (Object.prototype.hasOwnProperty.call(uc, key)) CFG[key] = uc[key];
  // Optional overrides for QA and A/B links: ?reveal=end  ?length=short
  try {
    var qs = new URLSearchParams(location.search);
    if (qs.get('reveal') === 'each' || qs.get('reveal') === 'end') CFG.REVEAL = qs.get('reveal');
    if (qs.get('length') === 'full' || qs.get('length') === 'short') CFG.LENGTH = qs.get('length');
  } catch (e) {}

  var SEEN_KEY = 'dhashu_story_seen';
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE = window.matchMedia ? window.matchMedia('(max-width: 819px)') : { matches: false };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function markSeen() { try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {} }
  // Analytics hook. Wire plausible, gtag or a dataLayer; with none present it only emits a DOM event.
  function track(name, props) {
    try {
      if (typeof window.plausible === 'function') window.plausible(name, { props: props || {} });
      if (typeof window.gtag === 'function') window.gtag('event', name, props || {});
      else if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: name }, props || {}));
      window.dispatchEvent(new CustomEvent('dhashu:track', { detail: { name: name, props: props || {} } }));
    } catch (e) {}
  }

  /* ---------- content ---------- */
  var LINK = function (href, text) { return '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>'; };
  var SCENES = {
    'pretender': {
      kicker: 'THE PRETENDER', phone: 'pretender',
      story: 'Rohit, 34, lives in Pune. He never asks for money. Six months later you learn none of it was true.',
      source: 'Pune police say one man messaged ' + LINK('https://www.tribuneindia.com/news/diaspora/perth-based-nri-messaged-3000-women-on-matrimonial-site-using-fake-identity/amp', '3,194 women') + ' on a matrimonial site under a fake name. One in five US dating app users admit lying about their age (' + LINK('https://statista.com/statistics/1481187/us-online-dating-users-lying-on-profiles', 'Forbes survey, 2024') + ').',
      question: 'Would you have caught it?',
      options: ['Yes, on the first video call', 'Maybe, once we met', 'Probably not'],
      head: 'Six things are checked before any profile can match.',
      list: ['Name', 'Age', 'Address', 'Employment', 'Court cases', 'Identity, matched to a live face capture']
    },
    'two-way': {
      kicker: 'TWO-WAY MATCH', phone: 'two-way',
      story: 'An hour of swiping. Forty profiles fit what you want. Three reply.',
      question: 'What would actually help?',
      options: ['More profiles to choose from', 'Better photos on my profile', "Only people who'd pick me too"],
      head: 'Both sides have to fit.',
      body: 'At sign-up you both say how you want to live: kids, living together, travel. You only see people who fit you, and whom you fit.',
      chips: [['Who you want', 'rose'], ['Who wants you back', 'good']]
    },
    'weekly': {
      kicker: 'ONE AT A TIME', phone: 'weekly',
      story: 'Eight chats open. They have eight too. Weeks go by, and nobody picks anyone.',
      question: 'What would make you actually decide?',
      options: ['More people to pick from', 'One person at a time, with a deadline', "I'd keep chatting with everyone"],
      head: 'One match at a time. Up to three a week.',
      body: 'One match a day, Monday to Wednesday. Each stays open for about a day. Dates are at the weekend.',
      chips: [['Locked in means not shown to anyone else', 'good'], ['No one fits? We say so', 'gold']]
    },
    'details': {
      kicker: 'YOUR DETAILS, YOUR CALL', phone: 'details',
      story: "One good chat. By morning he's found your Instagram, your number, and where you work.",
      question: 'Who should decide what a match can see?',
      options: ['The app, by default', 'I do, one thing at a time', 'Whoever asks first'],
      head: 'Nothing about you is shared until you say yes.',
      body: 'Your number, your socials, a date invite. Each one arrives as a request. You accept or decline.',
      chips: [['Phone number', 'good'], ['Instagram and socials', 'good'], ['Date invites', 'good']]
    },
    'swindler': {
      kicker: 'THE SWINDLER', phone: 'swindler',
      story: "He says he's a diamond heir. Private jet, five-star dinners, all on him. Two weeks later, his cards are blocked.",
      source: 'This is the con from ' + LINK('https://www.deseret.com/2022/2/3/22916539/tinder-swindler-true-story-simon-leviev-conning-women-for-money-israel-fraud-netflix/', 'The Tinder Swindler') + ' (Netflix, 2022). The film estimates about $10 million was taken. US victims reported $1.14 billion lost to romance scams in 2023 (' + LINK('https://www.ftc.gov/business-guidance/blog/2024/02/love-stinks-when-scammer-involved', 'FTC') + ').',
      question: 'When would you have noticed?',
      options: ['At the first big gift', 'When he asked for money', 'Honestly, maybe never'],
      head: 'No free dinners. Every date has rules you both sign.',
      list: ['Both pay: 50/50, or 1/3 and 2/3', 'No asking for money or contact details', 'A public place, and a trusted contact', 'On time, or message first']
    },
    'ghosting': {
      kicker: 'AFTER THE DATE', phone: 'ghosting',
      story: 'A great first date. You text the next day. Nothing. Three days on, you are still guessing what went wrong.',
      question: 'What would help most?',
      options: ['A short reply, even if it is a no', "Nothing. That's how dating goes", 'To know what they really thought'],
      head: 'After every date, you both know where you stand.',
      body: 'You each say whether to continue. A pass reaches the other person plainly and kindly. Then you both get a private note.',
      chips: [['Green flags: build confidence', 'good'], ['Red flags: what to work on', 'rose']]
    },
    'both-yes': {
      kicker: 'BOTH SAY YES', phone: 'both-yes',
      story: "Four months in. Friends ask what you two are. You're not sure you'd give the same answer.",
      question: 'How should the next step happen?',
      options: ["Whoever's ready brings it up", "We both agree, and it's written down", "We don't put a label on it"],
      head: 'Nothing moves on one yes. Each stage needs both of you.',
      body: 'Dating, Relationship, Engaged, Married. Each move is saved in an agreement you both sign.'
    },
    'hard-talks': {
      kicker: 'HARD TALKS', phone: 'hard-talks',
      story: 'You have never talked about chores. Kids and money are next. Nobody wants to start.',
      question: 'When should these come up?',
      options: ['Before we commit', 'When it becomes a problem', "We'll figure it out as we go"],
      head: 'Hard topics come as questions, one at a time.',
      body: 'Each one waits until you are both ready. You answer on your own first, then see where you match.',
      chips: [['Chores and home', 'line'], ['Money', 'line'], ['Children', 'line'], ['Career', 'line'], ['Emotional and physical intimacy', 'line']]
    },
    'guru': {
      kicker: 'GURU', phone: 'guru',
      story: 'Same argument again. Money, this time. Neither of you wants to start it.',
      question: 'Who helps?',
      options: ['A friend who knows us both', 'Nobody. We let it go', 'Something neutral, right when it happens'],
      head: 'Guru helps you say it, and helps you hear it.',
      moments: [
        ['Same argument again', 'say it to Guru first. It is shared only if you agree.'],
        ['Feeling distant', 'emotional and physical intimacy.'],
        ['Awkward money talk', 'checked against the plan you agreed.'],
        ['Feeling stuck', 'Guru steps in when you both ask.']
      ]
    }
  };
  var FULL = ['pretender', 'two-way', 'weekly', 'details', 'swindler', 'ghosting', 'both-yes', 'hard-talks', 'guru'];
  var SHORT = ['swindler', 'weekly', 'guru'];
  function order() { return CFG.LENGTH === 'short' ? SHORT : FULL; }

  /* ---------- phone animations ---------- */
  function A(d, dur) { return ' style="--d:' + d + 's' + (dur ? ';--dur:' + dur + 's' : '') + '"'; }
  function phone(title, sub, body) {
    return '<div class="phone"><div class="ph-head"><div class="ph-av">' + esc(title.charAt(0)) + '</div><div><div class="ph-t">' + esc(title) + '</div><div class="ph-s">' + esc(sub) + '</div></div></div><div class="ph-body">' + body + '</div></div>';
  }
  function bub(me, text, d, warn) { return '<div class="bub a-in' + (me ? ' me' : '') + (warn ? ' warn' : '') + '"' + A(d) + '>' + esc(text) + '</div>'; }
  function note(text, d) { return '<div class="note a-in"' + A(d) + '>' + esc(text) + '</div>'; }
  function dots(d, until) { return '<div class="dots" style="--d:' + d + 's;--u:' + until + 's" aria-hidden="true"><span></span><span></span><span></span></div>'; }
  function banner(text, d, tone) { return '<div class="banner' + (tone ? ' ' + tone : '') + '" style="--d:' + d + 's">' + esc(text) + '</div>'; }
  function row(label, val, status, d, tone) {
    return '<div class="row a-in"' + A(d) + '><div class="row-l"><div class="row-k">' + esc(label) + '</div><div class="row-v">' + esc(val) + '</div></div><div class="st t-' + tone + '" style="--sd:' + (Math.round((d + 0.5) * 100) / 100) + 's">' + esc(status) + '</div></div>';
  }
  var PHONES = {
    'swindler': function () {
      return phone('Kabir', 'Matched 3 weeks ago',
        bub(false, 'Dinner in Paris on Saturday? I’ll send the jet.', 0.4) +
        bub(true, 'Is this real?', 1.4) +
        bub(false, 'For you, always. My treat.', 2.2) +
        note('TWO WEEKS LATER', 3.2) +
        bub(false, 'Someone’s after me. My cards are blocked.', 3.8, true) +
        dots(4.6, 5.6) +
        bub(false, 'Can you send ₹4 lakh? I’ll repay Friday.', 5.7, true) +
        banner('He’s asking you for money', 6.6, 'bad'));
    },
    'pretender': function () {
      return phone('Rohit, 34', 'Lives in Pune',
        '<div class="scan"></div>' +
        row('NAME', 'Rohit Oberoi', 'NO MATCH', 1.2, 'bad') +
        row('AGE', '34', 'ID SAYS 42', 1.6, 'bad') +
        row('ADDRESS', 'Pune', 'OUTSIDE INDIA', 2.0, 'bad') +
        row('EMPLOYMENT', 'A Pune IT firm', 'NOT FOUND', 2.4, 'bad') +
        row('COURT', 'Declared: none', '1 FOUND', 2.8, 'bad') +
        row('IDENTITY', 'Live face capture', 'NO MATCH', 3.2, 'bad') +
        banner('Not verified. Can’t match.', 4.3, 'bad'));
    },
    'two-way': function () {
      var cells = 'ADMKSRVNTJPL'.split('').map(function (ch, i) {
        var keep = i === 1 || i === 5 || i === 9;
        return '<div class="circ ' + (keep ? 'keep' : 'dim') + '" style="--d:' + (0.2 + i * 0.06).toFixed(2) + 's;--dd:' + (1.6 + (i % 4) * 0.12).toFixed(2) + 's">' + ch + '</div>';
      }).join('');
      return phone('Your matches', 'Filtered both ways',
        '<div class="mg">' + cells + '</div>' +
        note('YOU FIT THEIR FILTERS TOO', 2.8) +
        row('LIFE GOALS', 'Kids · Living · Travel', 'ALIGNED', 3.3, 'good') +
        banner('3 people who’d pick you back', 4.1, 'good'));
    },
    'details': function () {
      return phone('Arjun', 'Wants to see your details',
        note('REQUESTS', 0.3) +
        row('PHONE', 'Request', 'SHARED', 0.8, 'good') +
        row('INSTAGRAM', 'Request', 'DECLINED', 1.8, 'bad') +
        row('DATE INVITE', 'Sat 7 pm · Café', 'ACCEPTED', 2.8, 'good') +
        row('WORKPLACE', 'Request', 'DECLINED', 3.8, 'bad') +
        banner('He sees only what you said yes to', 4.9, 'good'));
    },
    'weekly': function () {
      return phone('Your week', 'One match at a time',
        row('MON', 'Match 1 · Neha', 'YES', 0.5, 'good') +
        row('TUE', 'Match 2 · Dev', 'PASS', 1.3, 'mid') +
        row('WED', 'Match 3 · Meera', 'YES', 2.1, 'good') +
        row('THU', 'Date is set with Meera', 'LOCKED IN', 3.1, 'good') +
        row('FRI TO SUN', 'Date · Sat 7 pm', 'BOOKED', 3.9, 'good') +
        banner('Three people, then a date', 5.0, 'good'));
    },
    'ghosting': function () {
      return phone('After your date', 'Sunday night',
        row('YOU', 'Continue', 'SENT', 0.5, 'good') +
        row('MEERA', 'Pass', 'TOLD KINDLY', 1.3, 'mid') +
        note('YOUR PRIVATE NOTE', 2.3) +
        row('GREEN FLAG', 'Listened well', 'BUILD ON IT', 2.9, 'good') +
        row('RED FLAG', 'Phone out at dinner', 'WORK ON', 3.7, 'bad') +
        banner('You know where you stand', 4.9, 'good'));
    },
    'both-yes': function () {
      var labels = ['Dating', 'Relationship', 'Engaged', 'Married'];
      return phone('Move to Relationship?', 'Needs both of you',
        row('YOU', 'Ready', 'YES', 0.6, 'good') +
        '<div style="position:relative">' + row('MEERA', 'Thinking…', 'WAITING', 1.2, 'mid') +
          '<div class="layer a-in" style="--d:2.8s;--dur:.3s">' + row('MEERA', 'Ready', 'YES', 2.8, 'good') + '</div></div>' +
        '<div class="track a-in"' + A(0.3) + '><div class="dt on"></div><div class="ln on"></div><div class="dt on pop"></div><div class="ln"></div><div class="dt"></div><div class="ln"></div><div class="dt"></div></div>' +
        '<div class="tlabels a-in"' + A(0.4) + '>' + labels.map(function (s) { return '<span>' + s + '</span>'; }).join('') + '</div>' +
        banner('Saved to your shared agreement', 4.5, 'good'));
    },
    'hard-talks': function () {
      return phone('Chores', 'A question for both of you',
        bub(false, 'Who does what at home?', 0.4) +
        row('YOU', 'We take turns', 'ANSWERED', 1.3, 'good') +
        row('MEERA', 'Taking her time', 'WAITING', 2.1, 'mid') +
        note('SHOWN ONLY WHEN BOTH ARE READY', 3.0) +
        banner('No one has to go first', 4.2, 'good'));
    },
    'guru': function () {
      return phone('Guru', 'Here when you need it',
        bub(true, 'We’re fighting about money again.', 0.5) +
        bub(false, 'Say it to me first. I only share it if you say yes.', 1.6) +
        '<div class="layer sheet a-in" style="--d:3.8s">' +
          note('SAMPLE WEEKLY REPORT', 4.0) +
          row('APPRECIATION', 'Planned around your deadline', 'FROM ARJUN', 4.4, 'good') +
          row('SORTED', 'Who plans weekend trips', 'DONE', 5.0, 'good') +
          row('STILL SORTING', 'Weeknight chores', 'NEW', 5.6, 'mid') +
          row('WHERE YOU DIFFER', 'Weekends: rest or plans', 'TALK', 6.2, 'mid') +
          banner('Appreciation first. No scores.', 7.0, 'good') +
        '</div>');
    }
  };

  /* ---------- state ---------- */
  var S = { step: 0, picks: {}, focus: false };
  var app = document.getElementById('app');
  var prog = document.getElementById('prog');
  var progLabel = document.getElementById('prog-l');
  var progBar = document.getElementById('prog-bar');
  var progFill = progBar.querySelector('i');
  var skip = document.getElementById('skip');
  var timer = null;
  var ro = window.ResizeObserver ? new ResizeObserver(function () { fit(); }) : null;
  skip.setAttribute('href', CFG.HOME_URL);

  /* ---------- views ---------- */
  function introHTML(n) {
    var words = { 3: 'THREE', 7: 'SEVEN', 8: 'EIGHT', 9: 'NINE' };
    return '<div class="grid intro">' +
      '<div class="col">' +
        '<div class="kick">DHASHU · ' + (words[n] || n) + ' SHORT SCENES</div>' +
        '<h1 class="hd" id="focus-h" tabindex="-1">Picture the partner you are hoping to meet.</h1>' +
        '<p class="lede">Some are who they say. Some aren\'t. Pick what you\'d do in each scene. Then see what DhaShu does.</p>' +
        '<div class="row-cta"><button type="button" class="btn" data-begin>Begin</button><span class="time">' + (n === 3 ? 'About a minute' : 'About four minutes') + '</span></div>' +
      '</div>' +
      '<div class="stage hero">' +
        '<div class="kb"><img class="hero-img" src="assets/hero-date.webp" width="1200" height="1800" fetchpriority="high" alt="Two people across a café table, relaxed and clearly interested in each other."></div>' +
        '<a class="credit" href="https://unsplash.com/photos/a-man-and-a-woman-sitting-at-a-table-zTjVhEKkhRc" target="_blank" rel="noopener">Photo by Good Faces on Unsplash</a>' +
      '</div></div>';
  }

  function ansHTML(sc, last) {
    var h = '<div class="ans"><div class="kick sm">ON DHASHU</div><h3>' + esc(sc.head) + '</h3>';
    if (sc.body) h += '<p>' + esc(sc.body) + '</p>';
    if (sc.list) h += '<ul class="ans-list">' + sc.list.map(function (t) { return '<li><span aria-hidden="true">✓</span> ' + esc(t) + '</li>'; }).join('') + '</ul>';
    if (sc.moments) h += '<ul class="moments">' + sc.moments.map(function (m) { return '<li><b>' + esc(m[0]) + '</b> ' + esc(m[1]) + '</li>'; }).join('') + '</ul>';
    if (sc.chips) h += '<div class="chips' + (sc.chips.length === 2 ? ' l' : '') + '">' + sc.chips.map(function (c) { return '<div class="c-' + c[1] + '">' + esc(c[0]) + '</div>'; }).join('') + '</div>';
    if (sc.source) h += '<p class="src in-ans">' + sc.source + '</p>';
    h += '<div class="ans-actions">' +
      (last ? '<a class="btn sm" href="' + esc(CFG.HOME_URL) + '" data-final>Enter DhaShu</a>' : '<button type="button" class="btn sm" data-next>Next scene</button>') +
      '<button type="button" class="chg" data-change>Change answer</button></div>';
    return h + '</div>';
  }

  function sceneHTML(id, n, step) {
    var sc = SCENES[id], picked = S.picks[id], last = step === n, photo = (CFG.PHOTOS || {})[id];
    var opts = sc.options.map(function (t, i) {
      var k = 'abc'.charAt(i);
      return '<button type="button" class="opt" data-k="' + k + '" aria-pressed="' + (picked === k) + '">' + esc(t) + '</button>';
    }).join('');
    var answered = picked && CFG.REVEAL !== 'end';
    return '<h1 class="sr">DhaShu story, scene ' + step + ' of ' + n + '</h1>' +
      '<div class="scene grid' + (answered ? ' is-answered' : '') + '" data-scene="' + id + '">' +
      '<div class="stage">' +
        (photo ? '<img class="photo" src="' + esc(photo) + '" alt="" loading="lazy" decoding="async">' : '') +
        '<div class="vis" aria-hidden="true">' + PHONES[sc.phone]() + '</div>' +
        '<button type="button" class="replay" data-replay>Replay</button>' +
      '</div>' +
      '<div class="col">' +
        '<h2 class="kick" id="focus-h" tabindex="-1">' + esc(sc.kicker) + '</h2>' +
        '<div class="ask">' +
          '<p class="story">' + esc(sc.story) + '</p>' +
          (sc.source ? '<p class="src">' + sc.source + '</p>' : '') +
          '<div class="q" id="q-' + id + '">' + esc(sc.question) + '</div>' +
          '<div class="opts" role="group" aria-labelledby="q-' + id + '">' + opts + '</div>' +
        '</div>' +
        (CFG.REVEAL === 'end' ? '' : '<div class="ans-wrap" aria-live="polite">' + ansHTML(sc, last) + '</div>') +
      '</div></div>';
  }

  function chrome(cur, n, step) {
    prog.hidden = !cur;
    if (cur) {
      progLabel.innerHTML = '<span class="sw">SCENE </span>' + step + ' / ' + n;
      progFill.style.width = (step / n * 100) + '%';
      progBar.setAttribute('aria-valuenow', String(step));
      progBar.setAttribute('aria-valuemax', String(n));
    }
  }

  // The phone is designed at 260 x 450. On a short screen it is scaled so the whole scene fits one screen.
  function fit() {
    var stage = app.querySelector('.stage');
    var vis = stage && stage.querySelector('.vis');
    if (!vis) return;
    var s = Math.min(1, (stage.clientHeight - 24) / 450, (stage.clientWidth - 24) / 260);
    vis.style.setProperty('--ps', Math.max(0.5, s).toFixed(3));
  }

  function render() {
    var ord = order(), n = ord.length, step = S.step;
    var cur = step >= 1 && step <= n ? ord[step - 1] : null;
    chrome(cur, n, step);
    app.innerHTML = step === 0 ? introHTML(n) : sceneHTML(cur, n, step);
    document.title = cur ? 'DhaShu · Scene ' + step + ' of ' + n : 'DhaShu · Start with truth. Build with trust.';
    var stage = app.querySelector('.stage');
    if (ro) { ro.disconnect(); if (stage) ro.observe(stage); }
    fit();
    if (S.focus) {
      var h = document.getElementById('focus-h');
      if (h) h.focus({ preventScroll: true });
      S.focus = false;
    }
  }

  function scrollTop() { window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' }); }

  function finish() {
    clearTimeout(timer);
    markSeen();
    track('story_complete');
    location.href = CFG.HOME_URL;
  }

  function next() {
    clearTimeout(timer);
    if (S.step >= order().length) { finish(); return; }
    S.step += 1;
    S.focus = true;
    scrollTop();
    render();
  }

  function pick(id, k) {
    S.picks[id] = k;
    track('story_pick', { scene: id, option: k });
    var scene = app.querySelector('[data-scene]');
    if (scene) scene.querySelectorAll('.opt').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-k') === k)); });
    if (CFG.REVEAL === 'end') { clearTimeout(timer); timer = setTimeout(next, 420); return; }
    if (scene) {
      scene.classList.add('is-answered');
      // On a phone the options step aside for the answer, so keyboard focus moves with it.
      if (MOBILE.matches) {
        var b = scene.querySelector('.ans [data-next], .ans [data-final]');
        if (b) b.focus({ preventScroll: true });
      }
    }
  }

  function changeAnswer() {
    var scene = app.querySelector('[data-scene]');
    if (!scene) return;
    scene.classList.remove('is-answered');
    var sel = scene.querySelector('.opt[aria-pressed="true"]') || scene.querySelector('.opt');
    if (sel) sel.focus({ preventScroll: true });
  }

  function replay() {
    var scene = app.querySelector('[data-scene]');
    if (!scene) return;
    // Fresh nodes restart every CSS animation, so the picks and the answer stay as they are.
    scene.querySelector('.vis').innerHTML = PHONES[SCENES[scene.getAttribute('data-scene')].phone]();
  }

  /* ---------- events (delegated, so re-rendering never re-binds) ---------- */
  app.addEventListener('click', function (e) {
    var t = e.target.closest('button, a');
    if (!t || !app.contains(t)) return;
    if (t.hasAttribute('data-begin')) { track('story_start'); next(); }
    else if (t.hasAttribute('data-next')) next();
    else if (t.hasAttribute('data-final')) { markSeen(); track('story_complete'); }
    else if (t.hasAttribute('data-replay')) replay();
    else if (t.hasAttribute('data-change')) changeAnswer();
    else if (t.classList.contains('opt')) {
      var scene = t.closest('[data-scene]');
      if (scene) pick(scene.getAttribute('data-scene'), t.getAttribute('data-k'));
    }
  });
  skip.addEventListener('click', function () {
    markSeen();
    track('story_skip', { step: S.step });
  });
  window.addEventListener('resize', fit);

  render();
})();
