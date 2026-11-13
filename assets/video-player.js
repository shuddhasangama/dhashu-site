(() => {
  const dialog = document.querySelector('#film-player');
  const shell = document.querySelector('#film-shell');
  const video = document.querySelector('#film-video');
  const expand = document.querySelector('#film-expand');
  const error = document.querySelector('#film-error');
  let trigger, previousOverflow;
  if (!dialog || typeof dialog.showModal !== 'function') return;
  document.querySelectorAll('a.film[href$=".mp4"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      document.querySelector('#film-title').textContent = link.querySelector('.meta b').textContent;
      error.hidden = true;
      video.poster = link.querySelector('img').src;
      video.src = link.href;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      video.play().catch(() => { /* Native controls allow manual playback. */ });
    });
  });
  async function close() {
    if (document.fullscreenElement === shell) {
      try { await document.exitFullscreen(); } catch (_) { }
    }
    dialog.close();
  }
  document.querySelector('#film-close').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });
  dialog.addEventListener('close', () => {
    video.pause(); video.removeAttribute('src'); video.load();
    document.body.style.overflow = previousOverflow || '';
    trigger?.focus({preventScroll:true});
  });
  video.addEventListener('error', () => { error.hidden = false; });
  expand.hidden = !document.fullscreenEnabled && !video.webkitEnterFullscreen;
  expand.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.fullscreenEnabled && shell.requestFullscreen) await shell.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } catch (_) { /* Native video controls remain available. */ }
  });
  document.addEventListener('fullscreenchange', () => {
    expand.textContent = document.fullscreenElement === shell ? 'Minimize' : 'Expand';
  });
})();
