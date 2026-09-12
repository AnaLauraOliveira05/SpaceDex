# 🪐 SpaceDex - Enciclopédia Digital do Universo

> *"Explore, descubra e catalogue o universo."*

O **SpaceDex** é uma aplicação web moderna, responsiva e com temática espacial para catalogar, explorar e favoritar corpos celestes (planetas, luas, estrelas, galáxias, nebulosas e buracos negros).

---

## 🚀 Funcionalidades

- **Dashboard / Início:**
  - Painel de estatísticas em tempo real com contadores dinâmicos calculados automaticamente (total de astros, planetas, estrelas, galáxias e favoritos).
- **Explorar o Universo:**
  - Grade responsiva com cards elegantes em efeito *glassmorphism*.
  - Pesquisa em tempo real por nome do astro.
  - Filtro interativo por categorias (*Planetas, Luas, Estrelas, Galáxias, Nebulosas, Buracos Negros, Outros*).
- **Cadastrar Astro (Create):**
  - Formulário completo validado com prévia do card em tempo real.
  - Botões de seleção rápida de imagens espaciais de alta resolução.
- **Visualização de Detalhes (Read):**
  - Modal imersivo com imagem ampliada, especificações (distância, localização), descrição detalhada e curiosidade cósmica.
- **Edição de Astro (Update):**
  - Modal de edição rápida de dados com atualização instantânea de todas as telas.
- **Exclusão com Confirmação (Delete):**
  - Exclusão segura com janela de confirmação para prevenir remoções acidentais.
- **Meus Favoritos:**
  - Sistema de favoritos com botão de estrela nos cards e modal, sincronizado com o contador no menu superior.
- **Visual Espacial & Performance:**
  - Canvas com estrelas cintilantes sutis em segundo plano.
  - Gradientes e tons cósmicos escuros (azul-marinho, roxo, ciano).
  - Totalmente responsivo para computadores, tablets e smartphones.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico**
- **CSS3 Moderno:** Flexbox, CSS Grid, Glassmorphism, Variáveis CSS, Media Queries
- **JavaScript (ES6+):** Programação assíncrona, manipulação do DOM e Canvas API
- **Arquitetura Desacoplada (`StorageService`):**
  - Atualmente persistindo em `localStorage` para testes 100% locais sem necessidade de servidor externo.
  - Estrutura baseada em Promises pronta para substituição direta pelo **Firebase Firestore**.

---

## 📁 Estrutura de Arquivos

```
SpaceDex/
├── index.html              # Página principal e estrutura semântica SPA
├── css/
│   └── style.css           # Design system cósmico, componentes e responsividade
├── js/
│   ├── data.js             # Coleção inicial de dados astronômicos em alta resolução
│   ├── storage.js          # Camada de abstração de dados (Local / Firestore)
│   └── app.js              # Controlador central da aplicação e eventos
├── .gitignore              # Configuração de arquivos ignorados pelo Git
└── README.md               # Documentação do projeto
```

---

## 🖥️ Como Executar Localmente

Você pode abrir o arquivo `index.html` diretamente em qualquer navegador moderno, ou utilizar um servidor local estático simples:

```bash
# Opção 1: Via npx serve
npx serve .

# Opção 2: Via Python 3
python -m http.server 3000
```

Em seguida, acesse no navegador: `http://localhost:3000` (ou porta indicada no terminal).

---

## 🔮 Próximas Etapas

1. **Integração com Firebase Firestore:**
   - Conectar à coleção `astros` no Firestore para sincronização em nuvem em tempo real.
2. **Deploy no Firebase Hosting:**
   - Publicação na infraestrutura do Google Firebase.
3. **Publicação no GitHub:**
   - Inicialização do repositório Git, commit e push para o GitHub.
