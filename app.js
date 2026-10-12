/* ═══════════════════════════════════════════════════════════════════════
   app.js — renders content.js into the page, then wires nav and waitlist.
   You should not need to edit this file to change copy.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  const C = window.DHASHU;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const roman = ['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii',
                 'xiii','xiv','xv','xvi','xvii','xviii','xix','xx'];

  /* an <svg> referencing a symbol from the sprite in index.html */
  const icon = (name, cls) =>
    `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true"
       fill="none" stroke="currentColor" stroke-width="1.5"
       stroke-linecap="round" stroke-linejoin="round"><use href="#icon-${esc(name)}"/></svg>`;

  /* escape the lede, then wrap `block.highlight` in a <mark> if present */
  function lede(block) {
    let txt = esc(block.lede);
    if (block.highlight) {
      const h = esc(block.highlight);
      if (txt.indexOf(h) === 0 || txt.indexOf(h) > -1) {
        txt = txt.replace(h, `<mark class="hl">${h}</mark>`);
      }
    }
    return txt;
  }

  function head(el, block) {
    el.innerHTML =
      `<p class="eyebrow">${esc(block.eyebrow)}</p>
       <h2>${esc(block.heading)}</h2>
       <p class="lede">${lede(block)}</p>`;
  }

  /* ── navigation ───────────────────────────────────────────────────── */
  $('nav-links').innerHTML = C.nav
    .map(n => `<a href="#${esc(n.id)}" data-sec="${esc(n.id)}">${esc(n.label)}</a>`).join('');
  $('nav-cta').textContent = C.navCta;

  /* show the bar once the hero has scrolled past, and mark the section
     currently in view */
  const nav = $('nav');
  const hero = $('top');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([e]) => nav.classList.toggle('visible', !e.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px' }
    ).observe(hero);

    const links = Array.from($('nav-links').querySelectorAll('a'));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.toggle('on', a.dataset.sec === en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    C.nav.forEach(n => { const el = $(n.id); if (el) spy.observe(el); });
  } else {
    nav.classList.add('visible');
  }

  /* ── hero ─────────────────────────────────────────────────────────── */
  $('hero-operator').textContent = C.hero.operator;
  $('hero-wordmark').textContent = C.hero.wordmark;
  $('hero-tagline').textContent  = C.hero.tagline;
  $('hero-meta').innerHTML = C.hero.meta
    .map(([k, v]) => `<span><b>${esc(k)}</b> ${esc(v)}</span>`).join('');
  $('hero-cta').textContent = C.hero.cta;

  /* ── the four films ───────────────────────────────────────────────── */
  head($('watch-head'), C.watch);
  $('watch-films').innerHTML = C.watch.items.map(v => {
    const caption =
      `<div class="film-body">
         <h3>${esc(v.title)}</h3>
         <p>${esc(v.body)}</p>
         <p class="film-meta">${esc(v.meta)}</p>
       </div>`;

    /* frame shape is per item; portrait footage must letterbox, not crop */
    const shape = `aspect-ratio:${esc(v.ratio || '16/9')}`;
    const fit = v.fit === 'contain' ? ' film-contain' : '';

    /* an embedded page plays here, a file plays here, and an item with
       only an href falls back to a still that opens elsewhere           */
    let frame;
    if (v.embed) {
      /* The embedded film autoplays the moment it loads, so it starts as a
         still with a play button and is swapped for the live page on click.
         That also keeps its weight off the page until someone wants it.   */
      frame = `<button type="button" class="film-media film-link film-cta"
                 data-embed="${esc(v.embed)}"
                 style="${shape};background-image:url('${esc(v.poster)}')"
                 aria-label="Play ${esc(v.title)}">
           <span class="film-play">${icon('play', 'ic-lg')}</span>
         </button>`;
    } else if (v.src) {
      /* MP4 first — every mainstream browser takes it. WebM is the fallback
         for builds shipped without H.264, which do exist in the wild.      */
      frame = `<video class="film-media${fit}" controls preload="metadata"
                 playsinline style="${shape}" poster="${esc(v.poster)}">
           <source src="${esc(v.src)}" type="video/mp4">
           <source src="${esc(v.src.replace(/\.mp4$/, '.webm'))}" type="video/webm">
           Your browser cannot play this video.
         </video>`;
    } else {
      frame = `<a class="film-media film-link" href="${esc(v.href)}"
            target="_blank" rel="noopener"
            style="${shape};background-image:url('${esc(v.poster)}')"
            aria-label="Watch ${esc(v.title)} — opens in a new tab">
           <span class="film-play">${icon('play', 'ic-lg')}</span>
         </a>`;
    }

    return `<div class="film${v.wide ? ' film-wide' : ''}">${frame}${caption}</div>`;
  }).join('');

  /* swap the still for the live film only when asked — one listener on the
     container, so it survives the grid being re-rendered */
  $('watch-films').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-embed]');
    if (!btn) return;
    const f = document.createElement('iframe');
    f.className = 'film-media film-embed';
    f.src = btn.dataset.embed;
    f.title = btn.getAttribute('aria-label') || '';
    f.setAttribute('allow', 'autoplay; fullscreen');
    f.style.aspectRatio = btn.style.aspectRatio || '16/9';
    btn.replaceWith(f);
  });

  /* ── arc ──────────────────────────────────────────────────────────── */
  head($('arc-head'), C.arc);
  $('arc-grid').innerHTML = C.arc.stages.map(s =>
    `<div class="stage tone-${esc(s.tone || 'plum')}">
       <span class="stage-mark">${icon(s.icon, 'ic-lg')}</span>
       <h3>${esc(s.name)}</h3><p>${esc(s.body)}</p></div>`).join('');
  $('arc-note').textContent = C.arc.note;

  /* ── 169-day plan ─────────────────────────────────────────────────── */
  head($('plan-head'), C.plan);
  const P = C.plan, span = P.span, pct = (d) => (d / span) * 100;

  $('track-labels').innerHTML = P.segments.map(s =>
    `<div class="track-label" style="flex:0 0 ${pct(s.days)}%">
       <b>${esc(s.name)}</b><span>${s.weeks}w · ${s.days}d</span></div>`).join('');

  $('track-bar').innerHTML = P.segments.map((s, i) =>
    `<div class="seg seg-${i + 1}" style="flex:0 0 ${pct(s.days)}%"
       title="${esc(s.name)}: ${s.days} days"></div>`).join('');

  const ticks = [];
  for (let d = 0; d <= span; d += P.tickEvery) ticks.push(d);
  $('track-ticks').innerHTML = ticks.map((d, i) => {
    const cls = i === 0 ? ' first' : (i === ticks.length - 1 ? ' last' : '');
    return `<span class="tick${cls}" style="left:${pct(d)}%">Day ${d}</span>`;
  }).join('');

  $('track-finish').innerHTML =
    `<span class="finish-dot"></span>
     <span class="finish-txt">Day ${P.finish.day} · ${esc(P.finish.label)}</span>`;

  $('plan-quote').innerHTML =
    `<h3>${esc(P.quote)}</h3><div class="rule"></div>
     <p class="stamp">${P.finish.day} days · Dating to ${esc(P.finish.label)}</p>`;
  $('plan-foot').textContent = P.footnote;

  /* ── week ─────────────────────────────────────────────────────────── */
  head($('week-head'), C.week);
  $('week-rows').innerHTML = C.week.rows.map(r =>
    `<div class="wk"><span class="wk-when">${esc(r.when)}</span>
       <span class="wk-what"><b>${esc(r.title)}</b><span>${esc(r.body)}</span></span>
     </div>`).join('');

  /* ── Guru ─────────────────────────────────────────────────────────── */
  $('guru-mark').innerHTML   = icon(C.guru.icon, 'ic-xl');
  $('guru-eyebrow').textContent = C.guru.eyebrow;
  $('guru-heading').textContent = C.guru.heading;
  $('guru-lede').textContent    = C.guru.lede;
  $('guru-pillars').innerHTML = C.guru.pillars.map(p =>
    `<div class="pillar">${icon(p.icon, 'ic-lg')}
       <h3>${esc(p.name)}</h3><p>${esc(p.body)}</p></div>`).join('');
  $('guru-note').textContent = C.guru.note;

  /* ── verification ─────────────────────────────────────────────────── */
  head($('verify-head'), C.verify);
  $('verify-list').innerHTML = C.verify.fields.map(f =>
    `<li>${icon('check', 'ic-sm')}<span>${esc(f)}</span></li>`).join('');
  $('verify-photo').innerHTML =
    `<h3>${esc(C.verify.photo.heading)}</h3>
     <p class="vnote" style="margin-top:0">${esc(C.verify.photo.body)}</p>`;
  $('verify-custody').innerHTML =
    `<strong>${esc(C.verify.custody.lead)}</strong> ${esc(C.verify.custody.body)}`;

  /* ── principles ───────────────────────────────────────────────────── */
  head($('principles-head'), C.principles);
  $('principles-list').innerHTML = C.principles.items.map((it, i) =>
    `<div class="principle">
       <span class="p-icon">${icon(it.icon)}</span>
       <div class="p-body">
         <h3>${esc(it.title)}</h3>
         <p>${esc(it.body)}</p>
       </div>
       <span class="p-n">${roman[i] || (i + 1)}</span>
     </div>`).join('');

  /* ── waitlist ─────────────────────────────────────────────────────── */
  head($('join-head'), C.join);
  const opts = (arr) => '<option value="">Select</option>' +
    arr.map(o => `<option>${esc(o)}</option>`).join('');
  $('wl-city').innerHTML = '<option value="">Select</option>' +
    C.join.cityGroups.map(g =>
      `<optgroup label="${esc(g.label)}">` +
      g.options.map(o => `<option>${esc(o)}</option>`).join('') +
      `</optgroup>`).join('');
  $('wl-gender').innerHTML = opts(C.join.genders);
  $('wl-age').innerHTML    = opts(C.join.ageBands);
  $('wl-consent').textContent = C.join.consent;
  $('wl-submit').textContent  = C.join.button;

  /* ── footer ───────────────────────────────────────────────────────── */
  const F = C.footer;
  $('foot-operator').innerHTML =
    `<p class="eyebrow">${esc(F.operator.label)}</p><p>${F.operator.lines.map(esc).join('<br>')}</p>`;
  $('foot-contact').innerHTML =
    `<p class="eyebrow">${esc(F.contact.label)}</p>
     <p><span class="copyable" id="em">${esc(F.contact.email)}</span><button class="copybtn" data-copy="em">copy</button><br>
        <span class="copyable" id="ph">${esc(F.contact.phone)}</span><button class="copybtn" data-copy="ph">copy</button></p>`;
  $('foot-status').innerHTML =
    `<p class="eyebrow">${esc(F.status.label)}</p><p>${F.status.lines.map(esc).join('<br>')}</p>`;
  $('foot-fine').innerHTML =
    `${esc(F.fine)}<br><br>${esc(F.copyright)} <span class="mono" lang="sa">${esc(C.hero.seal.devanagari)}</span> — ${esc(F.motto)}`;

  /* ── form behaviour ───────────────────────────────────────────────── */
  const form = $('waitlist'), result = $('wl-result'), submit = $('wl-submit');

  function show(html, bad) {
    result.innerHTML = html;
    result.classList.toggle('bad', !!bad);
    result.hidden = false;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      email: $('wl-email').value.trim(),
      city: $('wl-city').value,
      gender: $('wl-gender').value,
      age_band: $('wl-age').value,
      source: 'landing',
      submitted_at: new Date().toISOString()
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      show('That email address does not look complete. Check it and try again.', true); return;
    }
    if (!data.city || !data.gender || !data.age_band) {
      show('Please choose your city, who you are, and your age band.', true); return;
    }
    if (!C.endpoint) {
      show('<b>Preview mode.</b> Your answers passed validation but nothing was sent — set <code>endpoint</code> in content.js to start collecting.');
      return;
    }

    submit.disabled = true;
    const original = submit.textContent;
    submit.textContent = 'Sending…';
    try {
      const res = await fetch(C.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.hidden = true;
      show(`<b>You are on the list.</b> We will email you the week ${esc(data.city)} opens, and nothing in between.`);
    } catch (err) {
      submit.disabled = false;
      submit.textContent = original;
      show(`That did not go through. Try again in a moment, or email us at ${esc(C.footer.contact.email)} and we will add you by hand.`, true);
    }
  });

  /* copy buttons — mailto and tel links are unreliable in an embedded
     frame, so the text is selectable and copyable instead */
  document.querySelectorAll('.copybtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const el = $(btn.dataset.copy);
      try {
        await navigator.clipboard.writeText(el.textContent.trim());
        const was = btn.textContent;
        btn.textContent = 'copied';
        setTimeout(() => { btn.textContent = was; }, 1400);
      } catch {
        const r = document.createRange(); r.selectNode(el);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = 'select';
      }
    });
  });
})();
