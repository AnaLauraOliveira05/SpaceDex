/**
 * SpaceDex - Dados Iniciais de Exemplo
 * Coleção de objetos celestes para testes locais antes da integração com Firebase
 */

const INITIAL_ASTROS = [
  {
    id: "astro-1",
    nome: "Júpiter",
    categoria: "Planetas",
    imagem: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=1000&q=80",
    descricao: "O maior planeta do Sistema Solar, um gigante gasoso conhecido por sua Grande Mancha Vermelha e um sistema massivo com mais de 90 luas conhecidas.",
    distancia: "778 milhões de km do Sol",
    localizacao: "Sistema Solar",
    curiosidade: "Júpiter tem uma massa duas vezes e meia superior à de todos os outros planetas do Sistema Solar reunidos.",
    favorito: true,
    dataCriacao: "2026-09-01T10:00:00.000Z"
  },
  {
    id: "astro-2",
    nome: "Nebulosa de Órion (M42)",
    categoria: "Nebulosas",
    imagem: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80",
    descricao: "Uma das nebulosas mais brilhantes e conhecidas, sendo uma maternidade estelar visível a olho nu na constelação de Órion.",
    distancia: "1.344 anos-luz da Terra",
    localizacao: "Braço de Órion, Via Láctea",
    curiosidade: "É um dos berçários estelares mais próximos e intensamente estudados pela astronomia moderna.",
    favorito: true,
    dataCriacao: "2026-09-02T11:30:00.000Z"
  },
  {
    id: "astro-3",
    nome: "Galáxia de Andrômeda (M31)",
    categoria: "Galáxias",
    imagem: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1000&q=80",
    descricao: "Galáxia espiral gigante e a maior galáxia do Grupo Local, que se aproxima em rota de colisão gravitacional com a nossa Via Láctea.",
    distancia: "2,537 milhões de anos-luz",
    localizacao: "Grupo Local de Galáxias",
    curiosidade: "Em aproximadamente 4,5 bilhões de anos, Andrômeda e a Via Láctea colidirão e formarão uma nova galáxia elíptica gigante chamada 'Lactômeda'.",
    favorito: false,
    dataCriacao: "2026-09-03T14:15:00.000Z"
  },
  {
    id: "astro-4",
    nome: "Sagitário A*",
    categoria: "Buracos Negros",
    imagem: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1000&q=80",
    descricao: "Buraco negro supermassivo localizado no centro gravitacional da Via Láctea com massa equivalente a mais de 4 milhões de sóis.",
    distancia: "26.000 anos-luz da Terra",
    localizacao: "Centro da Via Láctea",
    curiosidade: "Sua primeira imagem direta foi revelada pela colaboração internacional Event Horizon Telescope (EHT) em maio de 2022.",
    favorito: true,
    dataCriacao: "2026-09-04T09:40:00.000Z"
  },
  {
    id: "astro-5",
    nome: "Betelgeuse",
    categoria: "Estrelas",
    imagem: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    descricao: "Uma supergigante vermelha colossal na constelação de Órion, que se encontra nos estágios finais de sua vida e explodirá em supernova.",
    distancia: "642,5 anos-luz da Terra",
    localizacao: "Constelação de Órion",
    curiosidade: "Se estivesse no centro do nosso Sistema Solar, sua superfície se estenderia além da órbita de Júpiter.",
    favorito: false,
    dataCriacao: "2026-09-05T16:20:00.000Z"
  },
  {
    id: "astro-6",
    nome: "Europa",
    categoria: "Luas",
    imagem: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80",
    descricao: "Uma das quatro luas galileanas de Júpiter, coberta por uma espessa camada de gelo que esconde um imenso oceano líquido subterrâneo.",
    distancia: "628,3 milhões de km da Terra",
    localizacao: "Órbita de Júpiter",
    curiosidade: "Os cientistas acreditam que o oceano sob a crosta de Europa possa abrigar mais água que todos os oceanos da Terra juntos, sendo um alvo prioritário na busca por vida extraterrestre.",
    favorito: false,
    dataCriacao: "2026-09-06T18:00:00.000Z"
  },
  {
    id: "astro-7",
    nome: "Terra",
    categoria: "Planetas",
    imagem: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1000&q=80",
    descricao: "O terceiro planeta a partir do Sol e o único corpo astronômico conhecido que abriga vida, protegido por uma atmosfera e campo magnético únicos.",
    distancia: "149,6 milhões de km do Sol (1 UA)",
    localizacao: "Sistema Solar",
    curiosidade: "Mais de 70% de sua superfície é coberta por água líquida e sua atmosfera é composta por 78% de nitrogênio e 21% de oxigênio.",
    favorito: true,
    dataCriacao: "2026-09-07T08:10:00.000Z"
  },
  {
    id: "astro-8",
    nome: "Nebulosa do Caranguejo (M1)",
    categoria: "Nebulosas",
    imagem: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    descricao: "Remanescente de uma supernova colossal observada por astrônomos chineses e árabes no ano de 1054, contendo um pulsar giratório em seu centro.",
    distancia: "6.500 anos-luz da Terra",
    localizacao: "Constelação de Touro",
    curiosidade: "O pulsar no centro da nebulosa gira a incríveis 30 rotações completas por segundo, emitindo pulsos de radiação eletromagnética.",
    favorito: false,
    dataCriacao: "2026-09-08T12:00:00.000Z"
  },
  {
    id: "astro-9",
    nome: "Cinturão de Kuiper",
    categoria: "Outros",
    imagem: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=80",
    descricao: "Uma vasta região em forma de disco no Sistema Solar exterior além da órbita de Netuno, repleta de corpos gelados e planetas anões como Plutão.",
    distancia: "4,5 a 7,5 bilhões de km do Sol",
    localizacao: "Borda do Sistema Solar",
    curiosidade: "É considerado um fóssil cósmico primordial, contendo remanescentes intactos da formação do Sistema Solar há 4,6 bilhões de anos.",
    favorito: false,
    dataCriacao: "2026-09-09T17:45:00.000Z"
  }
];
