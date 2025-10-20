document.getElementById('scrollToIframe').addEventListener('click', function(e){
    e.preventDefault(); 
    const iframe = document.getElementById('DreamFrame');
    iframe.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
(function() {
  const SCROLL_DISABLE_MS = 1500;
  const FORCE_CHECK_INTERVAL = 200;
  const FORCE_STOP_AFTER = 2000;
  let disableForce = false;
  let forceTopInterval = null;
  let forceTopStopped = false;

  window.addEventListener("load", function() {
    setTimeout(function() {
      try { window.scrollTo({ top: 0, behavior: "auto" }); }
      catch(e) { window.scrollTo(0,0); }
    }, 80);
  });

  function pauseForceTemporarily(ms) {
    disableForce = true;
    setTimeout(function() { disableForce = false; }, ms);
  }

  document.addEventListener('click', function(e) {
    const anchor = e.target.closest('a[href="#DreamFrame"], #scrollToIframe, .scroll-to-iframe');
    if (anchor) {
      e.preventDefault();
      pauseForceTemporarily(SCROLL_DISABLE_MS);
      const iframe = document.getElementById('DreamFrame');
      if (iframe) {
        try {
          iframe.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
          const rect = iframe.getBoundingClientRect();
          const top = window.scrollY + rect.top;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    }
  }, false);

  window.addEventListener("focusin", function(e) {
    if (disableForce) return;
    const target = e.target;
    if (target && (target.closest && (target.closest('a[href="#DreamFrame"], #scrollToIframe, .scroll-to-iframe')))) {
      return;
    }
    try { window.scrollTo(0, 0); } catch(e) { window.scrollTo(0,0); }
  });

  let startTime = Date.now();
  forceTopInterval = setInterval(function() {
    if (forceTopStopped) return;
    if (Date.now() - startTime > FORCE_STOP_AFTER) {
      clearInterval(forceTopInterval);
      forceTopStopped = true;
      return;
    }
    if (disableForce) return;
    if (window.scrollY > 10) {
      try { window.scrollTo({ top: 0, behavior: 'auto' }); }
      catch (e) { window.scrollTo(0,0); }
    }
  }, FORCE_CHECK_INTERVAL);

  const iframe = document.getElementById('DreamFrame');
  if (iframe) {
    iframe.addEventListener('load', function() {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (doc && doc.body) {
          iframe.style.height = (doc.body.scrollHeight + 45) + 'px';
          return;
        }
      } catch (err) {}
      iframe.style.minHeight = '230px';
    });
  }
})();
