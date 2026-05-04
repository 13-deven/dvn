/**
 * DP Universe Navigation & Progress Tracker
 * Compatible with DP Lore: 13 Levels, Phobies, Dream Mode, Progression
 */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.dp-nav');
  const panel = document.getElementById('levels-panel');
  const grid = document.getElementById('levels-grid');
  const dreamBtn = document.querySelector('.dream-toggle');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const primaryMenu = document.querySelector('.nav-primary');
  const closePanelBtn = document.querySelector('.panel-close');
  const progressFill = document.querySelector('.progress-fill');
  const progressCount = document.querySelector('.progress-count');

  // ── CANON DATA: 13 LEVELS × PHOBIES × HEROES ──
  const levelsData = [
    { num: '01', phobia: 'Nécrophobie', hero: 'LETUM', gov: 'DR. CAROLE' },
    { num: '02', phobia: 'Photophobie', hero: 'RAY', gov: 'EITAN' },
    { num: '03', phobia: 'Tératophobie', hero: 'VIO', gov: 'HOPPER' },
    { num: '04', phobia: 'Arachnophobie', hero: 'CUSTOS', gov: 'A-SOUL' },
    { num: '05', phobia: 'Anthropophobie', hero: 'SENTIO', gov: 'CELARE' },
    { num: '06', phobia: 'Démonophobie', hero: 'CLERICUS', gov: 'VITRUM' },
    { num: '07', phobia: 'Pyrophobie', hero: 'EFFY', gov: 'BRASHER' },
    { num: '08', phobia: 'Claustrophobie', hero: 'FAYE', gov: 'LIORA' },
    { num: '09', phobia: 'Psychophobie', hero: 'PSYCHO', gov: 'DR. CAPRA' },
    { num: '10', phobia: 'Hématophobie', hero: 'SIBYL', gov: 'NYMPHES' },
    { num: '11', phobia: 'Nyctophobie', hero: 'DEVEN', gov: 'LENDER' },
    { num: '12', phobia: 'Thanatophobie', hero: 'RENOVO', gov: 'RENOVO' },
    { num: '13', phobia: 'Triskaïdékaphobie', hero: 'ALPHA OMEGA', gov: 'ALPHA OMEGA' }
  ];

  // ── PROGRESS TRACKER (localStorage) ──
  const STORAGE_KEY = 'dp_progress';
  let progress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { visitedLevels: [], chaptersRead: 0 };

  function updateProgressUI() {
    const total = 13;
    const visited = progress.visitedLevels.length;
    const pct = (visited / total) * 100;
    progressFill.style.width = `${pct}%`;
    progressCount.textContent = `${visited}/${total}`;
  }

  function unlockLevel(num) {
    if (!progress.visitedLevels.includes(num)) {
      progress.visitedLevels.push(num);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      updateProgressUI();
      document.querySelector(`.level-item[data-level="${num}"]`)?.classList.replace('locked', 'unlocked');
    }
  }

  // ── RENDER LEVELS PANEL ──
  function renderLevels() {
    grid.innerHTML = '';
    levelsData.forEach(l => {
      const item = document.createElement('a');
      item.href = `#level-${l.num}`;
      item.className = `level-item ${progress.visitedLevels.includes(l.num) ? 'unlocked' : 'locked'}`;
      item.dataset.level = l.num;
      item.dataset.phobia = l.phobia;
      item.innerHTML = `
        <span class="level-num">${l.num}</span>
        <span class="phobia-name">${l.phobia}</span>
        <span class="hero-name">${l.hero} • ${l.gov}</span>
        <span class="level-status"></span>
      `;
      item.addEventListener('click', (e) => {
        e.preventDefault();
        unlockLevel(l.num);
        // Ici: redirige vers la page de la série ou ouvre un modal lore
        console.log(`Navigation vers Level ${l.num}`);
        panel.classList.remove('visible');
        panel.setAttribute('hidden', '');
      });
      grid.appendChild(item);
    });
  }

  // ── INTERACTIONS ──
  // Toggle Panel
  document.querySelector('.dropdown-trigger').addEventListener('click', (e) => {
    const isOpen = !panel.hasAttribute('hidden');
    panel.setAttribute('hidden', !isOpen);
    panel.classList.toggle('visible', isOpen);
    e.currentTarget.setAttribute('aria-expanded', isOpen);
  });
  closePanelBtn.addEventListener('click', () => {
    panel.classList.remove('visible');
    panel.setAttribute('hidden', '');
    document.querySelector('.dropdown-trigger').setAttribute('aria-expanded', 'false');
  });

  // Dream Mode
  dreamBtn.addEventListener('click', () => {
    const isDream = document.documentElement.getAttribute('data-dream') === 'true';
    document.documentElement.setAttribute('data-dream', !isDream);
    dreamBtn.textContent = !isDream ? '☀️' : '🌙';
    dreamBtn.setAttribute('title', !isDream ? 'Mode Éveillé' : 'Mode Rêve');
    localStorage.setItem('dp_dream', !isDream);
  });

  // Mobile Menu
  mobileBtn.addEventListener('click', () => {
    const isOpen = !primaryMenu.classList.contains('open');
    primaryMenu.classList.toggle('open', isOpen);
    mobileBtn.setAttribute('aria-expanded', isOpen);
    mobileBtn.textContent = isOpen ? '✕' : '☰';
  });

  // Keyboard & Accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hasAttribute('hidden')) {
      closePanelBtn.click();
    }
  });

  // ── INIT ──
  renderLevels();
  updateProgressUI();
  if (localStorage.getItem('dp_dream') === 'true') {
    document.documentElement.setAttribute('data-dream', 'true');
    dreamBtn.textContent = '☀️';
  }

  // Expose API for external use (ex: chapitres visités via SPA routing)
  window.DPProgress = {
    unlock: (levelNum) => unlockLevel(levelNum),
    markChapterRead: () => {
      progress.chaptersRead++;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    },
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      progress = { visitedLevels: [], chaptersRead: 0 };
      updateProgressUI();
      renderLevels();
    }
  };


  
});