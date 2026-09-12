/**
 * SpaceDex - Storage Service
 * Camada de abstração de dados.
 * 
 * Atualmente utiliza localStorage com fallback para dados iniciais (INITIAL_ASTROS).
 * Estruturado com Promises assíncronas para possibilitar substituição direta
 * e transparente pelo Firebase Firestore no futuro.
 */

const STORAGE_KEY = 'spacedex_astros_v1';

class SpaceDexStorage {
  constructor() {
    this._init();
  }

  // Inicializa o localStorage caso esteja vazio
  _init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASTROS));
    }
  }

  // Recupera todos os astros salvos
  async getAll() {
    return new Promise((resolve) => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const data = raw ? JSON.parse(raw) : [];
        resolve(data);
      } catch (err) {
        console.error('Erro ao ler dados do localStorage:', err);
        resolve([...INITIAL_ASTROS]);
      }
    });
  }

  // Recupera um astro por ID
  async getById(id) {
    const list = await this.getAll();
    return list.find((item) => String(item.id) === String(id)) || null;
  }

  // Adiciona um novo astro (Create)
  async create(astroData) {
    const list = await this.getAll();
    const newAstro = {
      ...astroData,
      id: 'astro-' + Date.now(),
      favorito: Boolean(astroData.favorito),
      dataCriacao: new Date().toISOString()
    };
    list.unshift(newAstro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newAstro;
  }

  // Atualiza um astro existente (Update)
  async update(id, updatedData) {
    const list = await this.getAll();
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) {
      throw new Error(`Astro com ID ${id} não encontrado.`);
    }

    list[index] = {
      ...list[index],
      ...updatedData,
      id: list[index].id, // preserva o ID original
      dataCriacao: list[index].dataCriacao || new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[index];
  }

  // Exclui um astro (Delete)
  async delete(id) {
    const list = await this.getAll();
    const filtered = list.filter((item) => String(item.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  // Alterna o estado de favorito
  async toggleFavorite(id) {
    const list = await this.getAll();
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) {
      throw new Error(`Astro com ID ${id} não encontrado.`);
    }

    list[index].favorito = !list[index].favorito;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list[index].favorito;
  }

  // Restaura os dados originais de exemplo
  async resetDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASTROS));
    return [...INITIAL_ASTROS];
  }
}

// Exporta instância global única
window.StorageService = new SpaceDexStorage();
