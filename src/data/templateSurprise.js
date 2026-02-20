// ── Modo Surpresa: Templates de Atividades com Pistas ──────────────────────
// Cada atividade tem pistas AMBÍGUAS — ela nunca consegue ter a certeza!

export const ACTIVITY_PRESETS = [
  {
    id: 'cinema',
    label: 'Cinema',
    emoji: '🎬',
    clues: [
      'Vamos sentar lado a lado no escuro 🌑',
      'Há um ecrã gigante envolvido',
      'Pipocas são praticamente obrigatórias',
      'Não vais precisar de falar muito',
    ],
  },
  {
    id: 'jantar',
    label: 'Jantar',
    emoji: '🍽️',
    clues: [
      'Há uma mesa reservada com o teu nome',
      'Podes vestir o teu melhor look',
      'Alguém vai fazer muito esforço na cozinha',
      'Vai haver talheres finos envolvidos',
    ],
  },
  {
    id: 'bowling',
    label: 'Bowling',
    emoji: '🎳',
    clues: [
      'Há sapatos especiais nesta aventura',
      'Vais tentar atirar alguma coisa',
      'Muito provavelmente vou ganhar 😏',
      'Há barulho de algo a cair',
    ],
  },
  {
    id: 'passeio',
    label: 'Passeio',
    emoji: '🚶',
    clues: [
      'Veste sapatos confortáveis',
      'Ar fresco garantido',
      'Podem aparecer paisagens bonitas',
      'Não há pressa, o tempo é nosso',
    ],
  },
  {
    id: 'piquenique',
    label: 'Piquenique',
    emoji: '🧺',
    clues: [
      'Vamos precisar de uma manta',
      'Há comida embalada com carinho',
      'O chão pode fazer parte da experiência',
      'Natureza pode estar envolvida',
    ],
  },
  {
    id: 'museu',
    label: 'Museu',
    emoji: '🏛️',
    clues: [
      'Vamos aprender algo juntos',
      'Há coisas antigas ou modernas para ver',
      'Falar baixo é educado',
      'Sair mais inteligentes do que entrámos',
    ],
  },
  {
    id: 'concerto',
    label: 'Concerto/Show',
    emoji: '🎶',
    clues: [
      'Os ouvidos vão trabalhar muito',
      'Pode haver multidão',
      'Ritmo e energia garantidos',
      'Uma memória que vais guardar',
    ],
  },
  {
    id: 'spa',
    label: 'Spa/Relaxamento',
    emoji: '🧖',
    clues: [
      'Vai ser muito relaxante',
      'Pode haver cheiros agradáveis',
      'Roupa confortável recomendada',
      'Stress? Que stress?',
    ],
  },
  {
    id: 'jogos',
    label: 'Sala de Jogos',
    emoji: '🎮',
    clues: [
      'Competição amigável garantida',
      'Pode haver pontuações envolvidas',
      'Há botões ou peças para mexer',
      'Vamos ver quem é melhor 👀',
    ],
  },
  {
    id: 'praia',
    label: 'Praia/Piscina',
    emoji: '🏖️',
    clues: [
      'Água pode estar envolvida',
      'Protetor solar não faz mal',
      'Vista provavelmente vai ser boa',
      'Roupa de banho pode ser útil',
    ],
  },
];

// Pistas genéricas para atividades customizadas
export const GENERIC_CLUES = [
  'Vai ser uma surpresa mesmo boa',
  'Escolhi especialmente a pensar em ti',
  'Vais adorar, confio em mim',
  'Pode ou não haver comida envolvida 🤷',
];
