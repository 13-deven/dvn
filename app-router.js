class AppRouter {
  constructor() {
    this.container = document.getElementById('app-router');
    this.routes = {
      '/': 'Accueil',
      '/univers': 'Bible Universelle',
      '/series': 'Les 13 Séries',
      '/levels': 'Carte des Levels',
      '/personnages': 'Fiches Héros & Boss',
      '/portfolio': 'Art 2D/3D & Animations',
      '/lisa-nox': 'LISA NOX – Chants d’Empreinte',
      '/boutique': 'Shop & Précommandes',
      '/communaute': 'Fan Zone & Événements'
    };
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();

    // Intercepte tous les liens internes #/...
    document.querySelectorAll('a[href^="#/"]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const path = e.currentTarget.getAttribute('href').slice(1);
        window.location.hash = path;
      });
    });
  }

  async handleRoute() {
    const rawHash = window.location.hash.slice(1) || '/';
    const path = rawHash.split('?')[0].split('#')[0];
    const title = this.routes[path] || 'Page Non Trouvée';

    document.title = `${title} | Deven Phobe`;
    this.container.classList.add('loading');

    // Simulation de chargement (remplace par fetch/fetchMarkdown plus tard)
    await new Promise(r => setTimeout(r, 250));

    this.container.innerHTML = `
      <div class="route-view">
        <h2>${title}</h2>
        <p>Contenu dynamique pour <code>${path}</code></p>
        <p>💡 Intègre ici tes chapitres, fiches, galeries ou lecteurs audio.</p>
      </div>`;

    this.container.classList.remove('loading');
    this.syncProgress(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  syncProgress(path) {
    // Débloque automatiquement un Level visité
    const levelMatch = path.match(/^\/level\/(\d+)$/i);
    if (levelMatch && window.DPProgress) {
      window.DPProgress.unlock(levelMatch[1]);
    }
    // Marque un chapitre comme lu
    if (path.startsWith('/chapter/')) {
      window.DPProgress?.markChapterRead();
    }
  }
}

// Initialisation
window.Router = new AppRouter();