function openTab(evt, tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  evt.currentTarget.classList.add('active');
}

function loadProduct(url, direction) {
  const old = document.getElementById('page-content');
  if (!old) {
    window.location.href = url;
    return;
  }

  const clone = old.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '100%';
  document.body.appendChild(clone);
  clone.classList.add(direction === 'left' ? 'slide-out-left' : 'slide-out-right');

  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error('fetch failed');
      return r.text();
    })
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const incoming = doc.getElementById('page-content');
      if (!incoming) throw new Error('no content');

      incoming.style.position = 'relative';
      incoming.style.opacity = '0';
      incoming.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
      incoming.style.transition = 'transform .4s ease, opacity .4s ease';

      old.replaceWith(incoming);
      requestAnimationFrame(() => {
        incoming.style.transform = 'translateX(0)';
        incoming.style.opacity = '1';
      });

      history.pushState({ url }, '', url);
      setTimeout(() => clone.remove(), 500);
    })
    .catch(() => {
      window.location.href = url;
    });
}

window.addEventListener('popstate', e => {
  if (e.state?.url) {
    fetch(e.state.url)
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newPage = doc.getElementById('page-content');
        if (newPage) {
          document.getElementById('page-content').replaceWith(newPage);
        }
      });
  }
});
