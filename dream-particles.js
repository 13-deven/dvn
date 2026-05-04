class DreamParticles {
  constructor() {
    this.canvas = document.getElementById('dream-particles');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.active = false;
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // 80 particules max pour performance mobile
    for (let i = 0; i < 80; i++) this.particles.push(this.createParticle());
    this.animate();
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.4 - 0.05,
      size: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.6 + 0.15,
      hue: Math.random() > 0.6 ? 265 : 225, // violet / bleu nuit
      phase: Math.random() * Math.PI * 2
    };
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    if (!this.active) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const t = Date.now() * 0.001;

    this.particles.forEach(p => {
      p.x += p.vx + Math.sin(t + p.phase) * 0.15;
      p.y += p.vy;
      if (p.y < -20) { p.y = this.canvas.height + 20; p.x = Math.random() * this.canvas.width; }
      if (p.x < -20 || p.x > this.canvas.width + 20) p.vx *= -1;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 65%, 75%, ${p.opacity})`;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = `hsla(${p.hue}, 70%, 70%, 0.4)`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }

  setActive(state) {
    this.active = state;
    if (state && !this.particles.length) this.init();
  }
}

// Export global
window.DreamParticles = new DreamParticles();