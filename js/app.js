/**
 * SpaceDex - Application Controller
 * Lógica principal da aplicação: navegação, renderização, filtros, pesquisa, CRUD e animações.
 */

class SpaceDexApp {
  constructor() {
    this.astros = [];
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.activeModalAstroId = null;
    this.pendingDeleteId = null;

    this.init();
  }

  async init() {
    this.initStarfield();
    this.bindNavigation();
    this.bindSearchAndFilters();
    this.bindCreateForm();
    this.bindEditForm();
    this.bindModals();
    await this.loadData();
    this.setupQuickImageButtons();
  }

  /* ==========================================================================
     CARREGAMENTO E ATUALIZAÇÃO DE DADOS
     ========================================================================== */
  async loadData() {
    try {
      this.astros = await window.StorageService.getAll();
      this.renderAll();
    } catch (err) {
      console.error('Erro ao carregar astros:', err);
      this.showToast('Erro ao carregar os dados dos astros', 'danger');
    }
  }

  renderAll() {
    this.renderStats();
    this.renderExplorarGrid();
    this.renderFavoritosGrid();
    this.updateNavFavBadge();
  }

  /* ==========================================================================
     ESTATÍSTICAS DO DASHBOARD
     ========================================================================== */
  renderStats() {
    const total = this.astros.length;
    const planetas = this.astros.filter(a => a.categoria === 'Planetas').length;
    const estrelas = this.astros.filter(a => a.categoria === 'Estrelas').length;
    const galaxias = this.astros.filter(a => a.categoria === 'Galáxias').length;
    const favoritos = this.astros.filter(a => a.favorito).length;

    this.animateCounter('stat-total', total);
    this.animateCounter('stat-planetas', planetas);
    this.animateCounter('stat-estrelas', estrelas);
    this.animateCounter('stat-galaxias', galaxias);
    this.animateCounter('stat-favoritos', favoritos);
  }

  animateCounter(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const startValue = parseInt(el.textContent, 10) || 0;
    if (startValue === targetValue) {
      el.textContent = targetValue;
      return;
    }

    const duration = 400;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(startValue + (targetValue - startValue) * progress);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = targetValue;
      }
    };

    requestAnimationFrame(updateCount);
  }

  updateNavFavBadge() {
    const favCount = this.astros.filter(a => a.favorito).length;
    const badge = document.getElementById('nav-fav-count');
    if (badge) {
      badge.textContent = favCount;
    }
  }

  /* ==========================================================================
     RENDERIZAÇÃO DOS CARDS
     ========================================================================== */
  getCategoryClass(categoria) {
    const map = {
      'Planetas': 'cat-planetas',
      'Estrelas': 'cat-estrelas',
      'Galáxias': 'cat-galaxias',
      'Nebulosas': 'cat-nebulosas',
      'Buracos Negros': 'cat-buracos-negros',
      'Luas': 'cat-luas',
      'Outros': 'cat-outros'
    };
    return map[categoria] || 'cat-outros';
  }

  createCardHTML(astro) {
    const catClass = this.getCategoryClass(astro.categoria);
    const favActiveClass = astro.favorito ? 'active' : '';
    const safeName = this.escapeHtml(astro.nome);
    const safeDesc = this.escapeHtml(astro.descricao);
    const safeDist = this.escapeHtml(astro.distancia);
    const safeLoc = this.escapeHtml(astro.localizacao);

    return `
      <div class="astro-card" data-id="${astro.id}">
        <div class="card-media">
          <span class="category-badge ${catClass}">${astro.categoria}</span>
          <button class="btn-fav ${favActiveClass}" title="${astro.favorito ? 'Remover dos favoritos' : 'Favoritar'}" onclick="app.toggleFavorite('${astro.id}', event)">
            ★
          </button>
          <img src="${astro.imagem}" alt="${safeName}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80'">
        </div>
        <div class="card-body">
          <h3 class="card-title">${safeName}</h3>
          <p class="card-desc">${safeDesc}</p>
          <div class="card-meta">
            <div class="meta-item">
              <span>📍</span> Local: <strong>${safeLoc}</strong>
            </div>
            <div class="meta-item">
              <span>📏</span> Distância: <strong>${safeDist}</strong>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary btn-sm" onclick="app.openDetailsModal('${astro.id}')">
              <span>🔍</span> Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderExplorarGrid() {
    const grid = document.getElementById('astros-grid');
    if (!grid) return;

    let filtered = [...this.astros];

    // Filtro de categoria
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(a => a.categoria.toLowerCase() === this.currentCategory.toLowerCase());
    }

    // Filtro de busca por nome
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(a => a.nome.toLowerCase().includes(q) || a.descricao.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🪐</div>
          <h3 class="empty-title">Nenhum astro encontrado</h3>
          <p class="empty-desc">Não localizamos nenhum corpo celeste correspondente aos critérios de busca ou filtros atuais.</p>
          <button class="btn btn-secondary btn-sm" onclick="app.resetFilters()">
            <span>🔄</span> Limpar Filtros
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(astro => this.createCardHTML(astro)).join('');
  }

  renderFavoritosGrid() {
    const grid = document.getElementById('favoritos-grid');
    if (!grid) return;

    const favoritos = this.astros.filter(a => a.favorito);

    if (favoritos.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⭐</div>
          <h3 class="empty-title">Nenhum favorito salvo ainda</h3>
          <p class="empty-desc">Explore a enciclopédia e clique no ícone de estrela nos cards para salvar seus objetos cósmicos favoritos aqui.</p>
          <a href="#explorar" class="btn btn-primary btn-sm" onclick="app.navigateTo('explorar')">
            <span>🔭</span> Explorar Astros
          </a>
        </div>
      `;
      return;
    }

    grid.innerHTML = favoritos.map(astro => this.createCardHTML(astro)).join('');
  }

  /* ==========================================================================
     FILTROS E PESQUISA
     ========================================================================== */
  bindSearchAndFilters() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const chipsContainer = document.getElementById('category-chips');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (searchClear) {
          searchClear.classList.toggle('visible', this.searchQuery.length > 0);
        }
        this.renderExplorarGrid();
      });
    }

    if (searchClear && searchInput) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        this.searchQuery = '';
        searchClear.classList.remove('visible');
        this.renderExplorarGrid();
        searchInput.focus();
      });
    }

    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip-btn');
        if (!btn) return;

        chipsContainer.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentCategory = btn.dataset.category;
        this.renderExplorarGrid();
      });
    }
  }

  resetFilters() {
    this.searchQuery = '';
    this.currentCategory = 'all';

    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.classList.remove('visible');

    const chips = document.querySelectorAll('.chip-btn');
    chips.forEach(c => {
      c.classList.toggle('active', c.dataset.category === 'all');
    });

    this.renderExplorarGrid();
  }

  /* ==========================================================================
     CRUD: CREATE (CADASTRAR ASTRO) COM PRÉVIA AO VIVO
     ========================================================================== */
  bindCreateForm() {
    const form = document.getElementById('astro-form');
    if (!form) return;

    // Listeners para Prévia em tempo real
    const nomeInput = document.getElementById('astro-nome');
    const catSelect = document.getElementById('astro-categoria');
    const imgInput = document.getElementById('astro-imagem');
    const distInput = document.getElementById('astro-distancia');
    const locInput = document.getElementById('astro-localizacao');
    const descInput = document.getElementById('astro-descricao');

    const updatePreview = () => {
      const nome = nomeInput.value.trim() || 'Nome do Astro';
      const cat = catSelect.value || 'Categoria';
      const img = imgInput.value.trim() || 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80';
      const dist = distInput.value.trim() || '0 km';
      const loc = locInput.value.trim() || 'Sistema Solar';
      const desc = descInput.value.trim() || 'A descrição do seu astro será exibida aqui em tempo real enquanto você digita no formulário.';

      document.getElementById('preview-title').textContent = nome;
      document.getElementById('preview-badge').textContent = cat;
      document.getElementById('preview-badge').className = `category-badge ${this.getCategoryClass(cat)}`;
      document.getElementById('preview-dist').textContent = dist;
      document.getElementById('preview-loc').textContent = loc;
      document.getElementById('preview-desc').textContent = desc;

      const previewImg = document.getElementById('preview-img');
      previewImg.src = img;
    };

    [nomeInput, catSelect, imgInput, distInput, locInput, descInput].forEach(el => {
      if (el) {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
      }
    });

    // Submissão do Formulário
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = nomeInput.value.trim();
      const categoria = catSelect.value;
      const imagem = imgInput.value.trim();
      const distancia = distInput.value.trim();
      const localizacao = locInput.value.trim();
      const descricao = descInput.value.trim();
      const curiosidade = document.getElementById('astro-curiosidade').value.trim();

      if (!nome || !categoria || !imagem || !distancia || !localizacao || !descricao || !curiosidade) {
        this.showToast('Por favor, preencha todos os campos obrigatórios!', 'danger');
        return;
      }

      try {
        const newAstro = await window.StorageService.create({
          nome,
          categoria,
          imagem,
          distancia,
          localizacao,
          descricao,
          curiosidade,
          favorito: false
        });

        this.astros.unshift(newAstro);
        this.renderAll();
        form.reset();
        updatePreview();

        this.showToast(`✨ Astro "${newAstro.nome}" cadastrado com sucesso!`, 'success');
        this.navigateTo('explorar');
      } catch (err) {
        console.error('Erro ao cadastrar astro:', err);
        this.showToast('Erro ao cadastrar astro.', 'danger');
      }
    });
  }

  setupQuickImageButtons() {
    const buttons = document.querySelectorAll('.quick-img-btn');
    const imgInput = document.getElementById('astro-imagem');
    const previewImg = document.getElementById('preview-img');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        if (imgInput) {
          imgInput.value = url;
          if (previewImg) previewImg.src = url;
          imgInput.dispatchEvent(new Event('input'));
        }
      });
    });
  }

  /* ==========================================================================
     CRUD: READ (DETALHES DO ASTRO)
     ========================================================================== */
  async openDetailsModal(id) {
    const astro = this.astros.find(a => String(a.id) === String(id));
    if (!astro) return;

    this.activeModalAstroId = astro.id;

    document.getElementById('modal-img').src = astro.imagem;
    document.getElementById('modal-nome').textContent = astro.nome;
    
    const badge = document.getElementById('modal-badge');
    badge.textContent = astro.categoria;
    badge.className = `category-badge ${this.getCategoryClass(astro.categoria)}`;

    document.getElementById('modal-distancia').textContent = astro.distancia;
    document.getElementById('modal-localizacao').textContent = astro.localizacao;
    document.getElementById('modal-descricao').textContent = astro.descricao;
    document.getElementById('modal-curiosidade').textContent = astro.curiosidade;

    const favBtn = document.getElementById('modal-fav-btn');
    favBtn.classList.toggle('active', Boolean(astro.favorito));
    favBtn.title = astro.favorito ? 'Remover dos favoritos' : 'Favoritar';

    this.openModal('modal-details');
  }

  /* ==========================================================================
     CRUD: UPDATE (EDITAR ASTRO)
     ========================================================================== */
  bindEditForm() {
    const form = document.getElementById('edit-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('edit-id').value;
      const nome = document.getElementById('edit-nome').value.trim();
      const categoria = document.getElementById('edit-categoria').value;
      const imagem = document.getElementById('edit-imagem').value.trim();
      const distancia = document.getElementById('edit-distancia').value.trim();
      const localizacao = document.getElementById('edit-localizacao').value.trim();
      const descricao = document.getElementById('edit-descricao').value.trim();
      const curiosidade = document.getElementById('edit-curiosidade').value.trim();

      if (!nome || !categoria || !imagem || !distancia || !localizacao || !descricao || !curiosidade) {
        this.showToast('Por favor, preencha todos os campos.', 'danger');
        return;
      }

      try {
        const updated = await window.StorageService.update(id, {
          nome,
          categoria,
          imagem,
          distancia,
          localizacao,
          descricao,
          curiosidade
        });

        // Atualiza estado em memória
        const idx = this.astros.findIndex(a => String(a.id) === String(id));
        if (idx !== -1) {
          this.astros[idx] = updated;
        }

        this.renderAll();
        this.closeModal('modal-edit');
        this.showToast(`🚀 "${updated.nome}" atualizado com sucesso!`, 'success');

        // Se o modal de detalhes estiver aberto, atualiza-o
        if (this.activeModalAstroId === id) {
          this.openDetailsModal(id);
        }
      } catch (err) {
        console.error('Erro ao atualizar astro:', err);
        this.showToast('Falha ao atualizar astro.', 'danger');
      }
    });

    const cancelBtn = document.getElementById('modal-edit-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.closeModal('modal-edit');
      });
    }
  }

  openEditModal(id) {
    const astro = this.astros.find(a => String(a.id) === String(id));
    if (!astro) return;

    document.getElementById('edit-id').value = astro.id;
    document.getElementById('edit-nome').value = astro.nome;
    document.getElementById('edit-categoria').value = astro.categoria;
    document.getElementById('edit-imagem').value = astro.imagem;
    document.getElementById('edit-distancia').value = astro.distancia;
    document.getElementById('edit-localizacao').value = astro.localizacao;
    document.getElementById('edit-descricao').value = astro.descricao;
    document.getElementById('edit-curiosidade').value = astro.curiosidade;

    this.closeModal('modal-details');
    this.openModal('modal-edit');
  }

  /* ==========================================================================
     CRUD: DELETE (EXCLUIR ASTRO COM CONFIRMAÇÃO)
     ========================================================================== */
  confirmDelete(id) {
    const astro = this.astros.find(a => String(a.id) === String(id));
    if (!astro) return;

    this.pendingDeleteId = id;
    document.getElementById('confirm-message').textContent = 
      `Tem certeza que deseja excluir "${astro.nome}" da enciclopédia? Esta ação não pode ser desfeita.`;

    this.closeModal('modal-details');
    this.openModal('modal-confirm');
  }

  async executeDelete() {
    if (!this.pendingDeleteId) return;

    const id = this.pendingDeleteId;
    const astro = this.astros.find(a => String(a.id) === String(id));
    const nome = astro ? astro.nome : 'Astro';

    try {
      await window.StorageService.delete(id);
      this.astros = this.astros.filter(a => String(a.id) !== String(id));
      this.renderAll();
      this.closeModal('modal-confirm');
      this.pendingDeleteId = null;
      this.activeModalAstroId = null;
      this.showToast(`🗑️ "${nome}" foi removido da enciclopédia.`, 'info');
    } catch (err) {
      console.error('Erro ao excluir astro:', err);
      this.showToast('Erro ao tentar excluir o astro.', 'danger');
    }
  }

  /* ==========================================================================
     FAVORITOS
     ========================================================================== */
  async toggleFavorite(id, event) {
    if (event) {
      event.stopPropagation();
    }

    try {
      const newState = await window.StorageService.toggleFavorite(id);
      const astro = this.astros.find(a => String(a.id) === String(id));
      if (astro) {
        astro.favorito = newState;
      }

      this.renderAll();

      // Se o modal de detalhes estiver aberto com este mesmo astro, sincroniza o botão
      if (this.activeModalAstroId === id) {
        const favBtn = document.getElementById('modal-fav-btn');
        if (favBtn) {
          favBtn.classList.toggle('active', newState);
        }
      }

      const msg = newState 
        ? `⭐ "${astro?.nome}" adicionado aos favoritos!` 
        : `"${astro?.nome}" removido dos favoritos.`;
      this.showToast(msg, newState ? 'success' : 'info');
    } catch (err) {
      console.error('Erro ao alternar favorito:', err);
    }
  }

  /* ==========================================================================
     CONTROLE DE MODAIS
     ========================================================================== */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      // Restaura o overflow caso não haja outros modais abertos
      const anyOpen = document.querySelectorAll('.modal-overlay.active').length > 0;
      if (!anyOpen) {
        document.body.style.overflow = '';
      }
    }
  }

  bindModals() {
    // Fechar ao clicar no botão X ou no backdrop
    ['modal-details', 'modal-edit', 'modal-confirm'].forEach(id => {
      const modal = document.getElementById(id);
      if (!modal) return;

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(id);
        }
      });
    });

    // Fechar Detalhes
    document.getElementById('modal-details-close')?.addEventListener('click', () => {
      this.closeModal('modal-details');
    });
    document.getElementById('modal-btn-ok')?.addEventListener('click', () => {
      this.closeModal('modal-details');
    });

    // Botões dentro do Modal de Detalhes
    document.getElementById('modal-fav-btn')?.addEventListener('click', () => {
      if (this.activeModalAstroId) {
        this.toggleFavorite(this.activeModalAstroId);
      }
    });

    document.getElementById('modal-btn-edit')?.addEventListener('click', () => {
      if (this.activeModalAstroId) {
        this.openEditModal(this.activeModalAstroId);
      }
    });

    document.getElementById('modal-btn-delete')?.addEventListener('click', () => {
      if (this.activeModalAstroId) {
        this.confirmDelete(this.activeModalAstroId);
      }
    });

    // Fechar Edição
    document.getElementById('modal-edit-close')?.addEventListener('click', () => {
      this.closeModal('modal-edit');
    });

    // Confirmação de Exclusão
    document.getElementById('confirm-btn-cancel')?.addEventListener('click', () => {
      this.closeModal('modal-confirm');
      this.pendingDeleteId = null;
    });

    document.getElementById('confirm-btn-delete')?.addEventListener('click', () => {
      this.executeDelete();
    });

    // Tecla ESC fecha modais abertos
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        ['modal-details', 'modal-edit', 'modal-confirm'].forEach(id => {
          this.closeModal(id);
        });
      }
    });
  }

  /* ==========================================================================
     NAVEGAÇÃO E SCROLL
     ========================================================================== */
  bindNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Toggle menu mobile
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
    }

    // Links de navegação suave e ativação
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('data-target');
        if (targetId) {
          e.preventDefault();
          this.navigateTo(targetId);
          if (navMenu) navMenu.classList.remove('open');
        }
      });
    });

    // Scroll spy para destacar link ativo no header
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset + 120;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-target') === id);
          });
        }
      });
    });
  }

  navigateTo(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
      const headerOffset = 76;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'danger') icon = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3800);
  }

  /* ==========================================================================
     CANVAS: ESTRELAS CINTILANTES SUAVES
     ========================================================================== */
  initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    });

    const starCount = Math.min(Math.floor((width * height) / 4500), 220);
    let stars = [];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
          twinkleFactor: Math.random() * 0.02 + 0.005
        });
      }
    };

    initStars();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(s => {
        s.alpha += s.twinkleFactor;
        if (s.alpha > 0.95 || s.alpha < 0.15) {
          s.twinkleFactor = -s.twinkleFactor;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(s.alpha, 1))})`;
        ctx.fill();

        // Movimento cósmico sutil para cima
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }
      });

      requestAnimationFrame(render);
    };

    render();
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Inicialização Global
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SpaceDexApp();
});
