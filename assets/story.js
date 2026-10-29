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
      head: 'Five things are checked before any profile can match.',
      list: ['Name', 'Age', 'Address', 'Identity, matched to a live face capture', 'Court cases']
    },
    'life-goals': {
      kicker: 'LIFE GOALS', phone: 'life-goals',
      story: "Third date. It's going well. Then kids come up. You want two. They want none.",
      question: 'When should you know you want the same things out of life?',
      options: ['Before the first date', 'After a few dates', 'Whenever it comes up'],
      head: 'You both say what you want out of life at sign-up. Kids, living together, travel.',
      body: 'Each match shows where your life goals line up, before you meet.'
    },
    'swindler': {
      kicker: 'THE SWINDLER', phone: 'swindler',
      story: "He says he's a diamond heir. Private jet, five-star dinners, all on him. Two weeks later, his cards are blocked.",
      source: 'This is the con from ' + LINK('https://www.deseret.com/2022/2/3/22916539/tinder-swindler-true-story-simon-leviev-conning-women-for-money-israel-fraud-netflix/', 'The Tinder Swindler') + ' (Netflix, 2022). The film estimates about $10 million was taken. US victims reported $1.14 billion lost to romance scams in 2023 (' + LINK('https://www.ftc.gov/business-guidance/blog/2024/02/love-stinks-when-scammer-involved', 'FTC') + ').',
      question: 'When would you have noticed?',
      options: ['At the first big gift', 'When he asked for money', 'Honestly, maybe never'],
      head: 'No free dinners.',
      body: 'You both put money toward every date. The big spender who later needs a loan has nothing to build on.',
      chips: [['Pay your own', 'gold'], ['1/4 and 3/4', 'gold'], ['1/3 and 2/3', 'gold']]
    },
    'two-way': {
      kicker: 'TWO-WAY MATCH', phone: 'two-way',
      story: 'An hour of swiping. Forty profiles fit what you want. Three reply.',
      question: 'What would actually help?',
      options: ['More profiles to choose from', 'Better photos on my profile', "Only people who'd pick me too"],
      head: 'Filters work both ways. You only see people whose filters you also fit.',
      chips: [['Who you want', 'rose'], ['Who wants you back', 'good']]
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
    'ghosting': {
      kicker: 'GHOSTING', phone: 'ghosting',
      story: 'A great first date. You text the next day. Nothing. Three days on, you are still guessing what went wrong.',
      question: 'What would help most?',
      options: ['A short reply, even if it is a no', "Nothing. That's how dating goes", 'To know what they really thought'],
      head: 'After every date, nobody is left guessing.',
      body: 'You both say how it went and whether to continue. A pass reaches the other person plainly and kindly. Going silent is flagged.',
      chips: [['Two green flags', 'good'], ['Continue or pass', 'rose'], ['Silence is flagged', 'gold']]
    },
    'both-yes': {
      kicker: 'BOTH SAY YES', phone: 'both-yes',
      story: "Four months in. Friends ask what you two are. You're not sure you'd give the same answer.",
      question: 'How should the next step happen?',
      options: ["Whoever's ready brings it up", "We both agree, and it's written down", "We don't put a label on it"],
      head: 'Nothing moves on one yes. Each stage needs both of you.',
      body: 'Dating, Relationship, Engaged, Married. Each move is saved in an agreement you both sign.'
    },
    'guru': {
      kicker: 'GURU', phone: 'guru',
      story: 'Same argument again. Money, this time. Neither of you wants to start it.',
      question: 'Who helps?',
      options: ['A friend who knows us both', 'Nobody. We let it go', 'Something neutral, right when it happens'],
      head: 'Guru helps you say it, and helps you hear it.',
      chips: [['Same argument again', 'line'], ['Skipped date nights', 'line'], ['Awkward money talk', 'line'], ['Feeling stuck', 'line']]
    }
  };
  var FULL = ['pretender', 'life-goals', 'swindler', 'two-way', 'details', 'ghosting', 'both-yes', 'guru'];
  var SHORT = ['swindler', 'life-goals', 'guru'];
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
        note('CHECKING AGAINST ID', 0.3) +
        row('NAME', 'Rohit Oberoi', 'NO MATCH', 1.4, 'bad') +
        row('AGE', '34', 'ID SAYS 42', 1.9, 'bad') +
        row('ADDRESS', 'Pune', 'OUTSIDE INDIA', 2.4, 'bad') +
        row('IDENTITY', 'Live face capture', 'NO MATCH', 2.9, 'bad') +
        row('COURT', 'Declared: none', '1 FOUND', 3.4, 'bad') +
        banner('Not verified. Can’t match anyone.', 4.5, 'bad'));
    },
    'two-way': function () {
      var cells = 'ADMKSRVNTJPL'.split('').map(function (ch, i) {
        var keep = i === 1 || i === 5 || i === 9;
        return '<div class="circ ' + (keep ? 'keep' : 'dim') + '" style="--d:' + (0.2 + i * 0.06).toFixed(2) + 's;--dd:' + (1.6 + (i % 4) * 0.12).toFixed(2) + 's">' + ch + '</div>';
      }).join('');
      return phone('Your matches', 'Filtered both ways',
        '<div class="mg">' + cells + '</div>' +
        note('YOU FIT THEIR FILTERS TOO', 2.8) +
        banner('3 people who’d pick you back', 3.4, 'good'));
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
    'ghosting': function () {
      return phone('Date debrief', 'An hour after your date',
        note('HOW DID IT GO?', 0.3) +
        row('GREEN FLAG', 'Actually listened', 'ADDED', 0.8, 'good') +
        row('GREEN FLAG', 'On time', 'ADDED', 1.5, 'good') +
        row('YOU', 'Continue', 'SENT', 2.3, 'good') +
        row('MEERA', 'Pass', 'REPLIED', 3.1, 'mid') +
        bub(false, 'Lovely evening. It didn’t feel right for me. Thank you.', 3.9) +
        banner('You know where you stand', 5.0, 'good'));
    },
    'life-goals': function () {
      return phone('You & Meera', 'Life goals, before you meet',
        row('KIDS', 'Two · None', 'DIFFERS', 0.5, 'bad') +
        row('LIVING', 'After marriage · After marriage', 'ALIGNED', 1.3, 'good') +
        row('TRAVEL', 'Every year · Sometimes', 'PARTIAL', 2.1, 'mid') +
        banner('You knew this before date one', 3.4));
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
    'guru': function () {
      return phone('Guru', 'Here when you need it',
        bub(true, 'We’re fighting about money again.', 0.5) +
        bub(false, 'Same one as last month?', 1.5) +
        bub(true, 'Yes. I don’t even know how it starts.', 2.4) +
        dots(3.2, 4.0) +
        bub(false, 'Try this. Say what worries you, in one line. I’ll help them hear it.', 4.1) +
        note('SUGGESTED', 5.2) +
        bub(true, 'I’m worried we’re not saving.', 5.6));
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
    var words = { 3: 'THREE', 7: 'SEVEN', 8: 'EIGHT' };
    return '<div class="grid intro">' +
      '<div class="col">' +
        '<div class="kick">DHASHU · ' + (words[n] || n) + ' SHORT SCENES</div>' +
        '<h1 class="hd" id="focus-h" tabindex="-1">Picture the partner you are hoping to meet.</h1>' +
        '<p class="lede">Some are who they say. Some aren\'t. Pick what you\'d do in each scene. Then see what DhaShu does.</p>' +
        '<div class="row-cta"><button type="button" class="btn" data-begin>Begin</button><span class="time">' + (n === 3 ? 'About a minute' : 'About three minutes') + '</span></div>' +
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
