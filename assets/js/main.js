/**
 * BashIt Theme Runtime - Extended Components & Lazy Loaders
 */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initTypeIt();
  initMermaid();
  initECharts();
  initMaps();
  initMath();
  initCloudflareBBS();
});

/* Helper to load external CSS dynamically */
function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

/* Helper to load external JS dynamically */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * 1. Terminal Tabs Initialization
 */
function initTabs() {
  document.querySelectorAll('.tui-tabs-container').forEach(container => {
    const nav = container.querySelector('.tui-tab-nav');
    const panels = container.querySelectorAll('.tui-tab-panel');
    if (!nav || panels.length === 0) return;

    nav.innerHTML = '';
    const defaultIndex = parseInt(container.getAttribute('data-default-tab') || '0', 10);

    panels.forEach((panel, idx) => {
      const title = panel.getAttribute('data-title') || `Tab ${idx + 1}`;
      const btn = document.createElement('button');
      btn.className = 'tui-tab-button';
      btn.type = 'button';
      btn.role = 'tab';
      btn.textContent = `[ ${title} ]`;

      if (idx === defaultIndex) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        panel.classList.add('active');
      } else {
        btn.setAttribute('aria-selected', 'false');
        panel.classList.remove('active');
      }

      btn.addEventListener('click', () => {
        nav.querySelectorAll('.tui-tab-button').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        panel.classList.add('active');
      });

      nav.appendChild(btn);
    });
  });
}

/**
 * 2. TypeIt Terminal Typewriter Effect
 */
function initTypeIt() {
  document.querySelectorAll('.typeit-target').forEach(el => {
    const fullText = el.getAttribute('data-text') || el.textContent;
    const speed = parseInt(el.getAttribute('data-speed') || '50', 10);
    el.textContent = '';
    let index = 0;

    function typeChar() {
      if (index < fullText.length) {
        el.textContent += fullText.charAt(index);
        index++;
        setTimeout(typeChar, speed);
      }
    }
    setTimeout(typeChar, 200);
  });
}

/**
 * 3. Mermaid Diagrams (Lazy Loaded)
 */
function initMermaid() {
  const mermaidEls = document.querySelectorAll('.mermaid');
  if (mermaidEls.length === 0) return;

  import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')
    .then(m => {
      const mermaid = m.default;
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        themeVariables: {
          darkMode: true,
          background: '#1e1e2e',
          primaryColor: '#89b4fa',
          primaryTextColor: '#cdd6f4',
          primaryBorderColor: '#b4befe',
          lineColor: '#a6adc8',
          secondaryColor: '#313244',
          tertiaryColor: '#181825',
          fontFamily: 'monospace'
        }
      });
      mermaid.run();
    })
    .catch(err => console.error('Mermaid load failed:', err));
}

/**
 * 4. ECharts (Lazy Loaded)
 */
function initECharts() {
  const chartEls = document.querySelectorAll('.echarts-chart');
  if (chartEls.length === 0) return;

  loadScript('https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js')
    .then(() => {
      const echarts = window.echarts;
      const chartInstances = [];

      chartEls.forEach(el => {
        const dataEl = el.parentElement.querySelector(`.echarts-data[data-id="${el.id}"]`);
        if (!dataEl) return;
        try {
          const options = JSON.parse(dataEl.textContent);
          const chart = echarts.init(el, 'dark');
          chart.setOption(options);
          chartInstances.push(chart);
        } catch (e) {
          console.error('Error parsing ECharts data for', el.id, e);
        }
      });

      window.addEventListener('resize', () => {
        chartInstances.forEach(c => c.resize());
      });
    })
    .catch(err => console.error('ECharts load failed:', err));
}

/**
 * 5. Mapbox / Leaflet Fallback (Lazy Loaded)
 */
function initMaps() {
  const mapEls = document.querySelectorAll('.tui-map');
  if (mapEls.length === 0) return;

  mapEls.forEach(el => {
    const token = el.getAttribute('data-token');
    const lng = parseFloat(el.getAttribute('data-lng') || '0');
    const lat = parseFloat(el.getAttribute('data-lat') || '0');
    const zoom = parseInt(el.getAttribute('data-zoom') || '10', 10);
    const marked = el.getAttribute('data-marked') !== 'false';

    if (token) {
      // Use Mapbox GL
      loadCSS('https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css');
      loadScript('https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js')
        .then(() => {
          const mapboxgl = window.mapboxgl;
          mapboxgl.accessToken = token;
          const map = new mapboxgl.Map({
            container: el,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom
          });
          if (marked) new mapboxgl.Marker({ color: '#89b4fa' }).setLngLat([lng, lat]).addTo(map);
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        })
        .catch(err => console.error('Mapbox load failed:', err));
    } else {
      // Zero-config Dark Theme Leaflet Fallback
      loadCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
      loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
        .then(() => {
          const L = window.L;
          const map = L.map(el).setView([lat, lng], zoom);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
          }).addTo(map);
          if (marked) {
            L.circleMarker([lat, lng], {
              radius: 8,
              fillColor: '#89b4fa',
              color: '#cdd6f4',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            }).addTo(map);
          }
        })
        .catch(err => console.error('Leaflet fallback load failed:', err));
    }
  });
}

/**
 * 6. KaTeX Math (Lazy Loaded)
 */
function initMath() {
  const mathEls = document.querySelectorAll('.tui-math-body');
  if (mathEls.length === 0) return;

  loadCSS('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css');
  loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js')
    .then(() => {
      const katex = window.katex;
      mathEls.forEach(el => {
        const tex = el.textContent.trim();
        try {
          katex.render(tex, el, { displayMode: true, throwOnError: false });
        } catch (err) {
          console.error('KaTeX rendering error:', err);
        }
      });
    })
    .catch(err => console.error('KaTeX load failed:', err));
}

/**
 * 7. Cloudflare Workers + D1 Terminal BBS Comments
 */
function initCloudflareBBS() {
  const form = document.querySelector('.tui-bbs-form');
  if (!form) return;

  const slug = form.getAttribute('data-slug') || 'default';
  const api = form.getAttribute('data-api') || '';
  const mock = form.getAttribute('data-mock') === 'true' || !api;
  const thread = document.querySelector('.tui-bbs-thread');
  const statusEl = form.querySelector('.tui-bbs-status') || form.querySelector('#tui-bbs-status');
  const storageKey = 'tui_bbs_comments_' + slug;

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderComments(comments) {
    if (!thread) return;
    if (!comments || comments.length === 0) {
      thread.innerHTML = '<div class="tui-bbs-empty">No messages posted to this terminal thread yet. Be the first to transmit!</div>';
      return;
    }

    let html = '';
    comments.forEach(c => {
      const dateStr = new Date(c.created_at || Date.now()).toLocaleString();
      const authorHtml = escapeHTML(c.author);

      html += `
        <div class="tui-bbs-comment" box-="square">
          <div class="tui-bbs-meta">
            <span is-="badge" variant-="peach"> ${authorHtml}</span>
            <span style="color: var(--foreground2); font-size: 0.85em;">[ ${dateStr} ]</span>
          </div>
          <div class="tui-bbs-body">${escapeHTML(c.content).replace(/\\n/g, '<br>')}</div>
        </div>
      `;
    });
    thread.innerHTML = html;
  }

  // Load comments
  if (mock) {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      renderComments(stored);
    } catch (e) {
      renderComments([]);
    }
  } else {
    fetch(`${api}/api/comments?post=${encodeURIComponent(slug)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          renderComments(data);
        } else {
          renderComments([]);
        }
      })
      .catch(err => {
        console.error('Failed to load BBS comments:', err);
        if (thread) thread.innerHTML = '<div class="tui-bbs-empty" style="color: var(--red);">[!] Error connecting to terminal BBS service.</div>';
      });
  }

  // Handle comment submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const hp = form.elements['website_hp'] ? form.elements['website_hp'].value : '';
    if (hp) return; // silent drop for bots

    const author = form.elements['author'].value.trim();
    const email = form.elements['email'] ? form.elements['email'].value.trim() : '';
    const content = form.elements['content'].value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!author || !content) return;

    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.innerHTML = '<span is-="spinner" variant-="cursor"></span> Transmitting...';

    const newComment = {
      id: 'msg-' + Date.now(),
      post_slug: slug,
      author: author,
      email: email,
      content: content,
      created_at: Date.now()
    };

    if (mock) {
      setTimeout(() => {
        try {
          const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
          stored.unshift(newComment);
          localStorage.setItem(storageKey, JSON.stringify(stored));
          renderComments(stored);
        } catch (err) {
          console.error(err);
        }
        form.elements['content'].value = '';
        if (submitBtn) submitBtn.disabled = false;
        if (statusEl) statusEl.innerHTML = '<span is-="badge" variant-="green">[✓ Message recorded to BBS]</span>';
        setTimeout(() => { if (statusEl) statusEl.innerHTML = ''; }, 3000);
      }, 300);
    } else {
      fetch(`${api}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      })
        .then(res => res.json())
        .then(resData => {
          if (submitBtn) submitBtn.disabled = false;
          if (resData.success || resData.id) {
            form.elements['content'].value = '';
            if (statusEl) statusEl.innerHTML = '<span is-="badge" variant-="green">[✓ Message posted]</span>';
            // Reload comments
            fetch(`${api}/api/comments?post=${encodeURIComponent(slug)}`)
              .then(r => r.json())
              .then(data => renderComments(data));
          } else {
            if (statusEl) statusEl.innerHTML = `<span is-="badge" variant-="red">[!] ${resData.error || 'Failed to post'}</span>`;
          }
          setTimeout(() => { if (statusEl) statusEl.innerHTML = ''; }, 4000);
        })
        .catch(err => {
          if (submitBtn) submitBtn.disabled = false;
          if (statusEl) statusEl.innerHTML = '<span is-="badge" variant-="red">[!] Connection error</span>';
          setTimeout(() => { if (statusEl) statusEl.innerHTML = ''; }, 4000);
        });
    }
  });
}

