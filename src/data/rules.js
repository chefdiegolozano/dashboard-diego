export const REGRAS = [
  {
    id: 1,
    numero: 1,
    titulo: 'Laura = Conteúdo Nuclear',
    descricao: 'Laura = conteúdo nuclear (15x média). Usar com moderação estratégica. Não diluir o impacto com uso frequente.',
    icone: 'Star',
  },
  {
    id: 2,
    numero: 2,
    titulo: 'Sequências Narrativas Viralizam',
    descricao: 'Sequências narrativas viralizam (Tuning → Upgrade). Uma história que continua gera mais engajamento que posts isolados.',
    icone: 'TrendingUp',
  },
  {
    id: 3,
    numero: 3,
    titulo: 'Fracasso > Sucesso como Hook',
    descricao: 'Fracasso > Sucesso como hook. O que deu errado prende mais atenção do que o que deu certo.',
    icone: 'AlertTriangle',
  },
  {
    id: 4,
    numero: 4,
    titulo: 'Luxo Silencioso com Marcas',
    descricao: 'Luxo Silencioso funciona com marcas quando integrado por experiência, não por ostentação ou catálogo de produtos.',
    icone: 'Gem',
  },
  {
    id: 5,
    numero: 5,
    titulo: 'Por que o Diego fala HOJE?',
    descricao: 'Todo post precisa responder: "Por que o Diego está falando isso HOJE?" Urgência e contexto são fundamentais.',
    icone: 'Clock',
  },
  {
    id: 6,
    numero: 6,
    titulo: 'Vulnerabilidade com Contexto',
    descricao: 'Vulnerabilidade precisa de número, ano e contexto específico. "Perdi R$500 mil em 2019" > "Passei por dificuldades".',
    icone: 'Heart',
  },
  {
    id: 7,
    numero: 7,
    titulo: 'Constatação, Nunca Conselho',
    descricao: 'Lição como constatação, NUNCA como conselho. "Percebi que..." funciona. "Você deveria..." não funciona.',
    icone: 'MessageSquare',
  },
  {
    id: 8,
    numero: 8,
    titulo: 'Técnica Pura Não Funciona',
    descricao: 'Técnica pura sem diagnóstico embutido não funciona. Sempre conectar o processo técnico a um problema real.',
    icone: 'Tool',
  },
  {
    id: 9,
    numero: 9,
    titulo: 'Gestão é o Pilar Motor',
    descricao: 'Gestão é o pilar motor (171k views médias vs 72k técnica). Priorizar gestão no calendário é estratégia, não preferência.',
    icone: 'BarChart2',
  },
  {
    id: 10,
    numero: 10,
    titulo: 'Pessoal 1x/semana',
    descricao: 'Pessoal 1x/semana como boost estratégico. Frequência excessiva dilui o impacto. Menos é mais.',
    icone: 'User',
  },
];

export const TOM_PODE = [
  { texto: 'Confrontar: "O difícil não é delegar. É aceitar que a pessoa não vai fazer do seu jeito."' },
  { texto: 'Reframear: "A pergunta certa. Mas a resposta não cabe num comentário."' },
  { texto: 'Validar: "Pouca gente tem coragem de dizer isso."' },
];

export const TOM_NAO_PODE = [
  { texto: 'Orientar: "Começa fazendo X, tenta Y, o primeiro passo é Z"' },
  { texto: 'Bajular: "Muito obrigado pelo carinho, vocês são incríveis"' },
  { texto: 'Catalogar: "5.000 unidades, toda a linha de produtos"' },
];

export const PALAVRAS_PROIBIDAS = ['curso', 'mentoria', 'acompanhamento', 'comunidade de apoio', 'espaço terapêutico', 'programa motivacional'];

export const PLAYBOOKS = [
  {
    id: 1,
    nome: 'Dia Normal',
    stories: [
      { ordem: 1, horario: 'Manhã', tipo: 'Foto', descricao: 'Foto chegando no Levena/ECDL.', texto: '"Bom dia." Só isso.' },
      { ordem: 2, horario: 'Meio-dia', tipo: 'Vídeo', descricao: 'Vídeo curto de produto/prato do dia.', texto: 'Sem texto.' },
      { ordem: 3, horario: 'Tarde', tipo: 'Texto', descricao: 'Fundo preto + texto branco com frase de constatação do dia.', texto: 'Frase de constatação.' },
    ],
  },
  {
    id: 2,
    nome: 'Dia de Curso ECDL',
    stories: [
      { ordem: 1, horario: 'Manhã', tipo: 'Foto', descricao: 'Foto da sala montada antes dos alunos.', texto: '"Hoje tem [nome do curso]."' },
      { ordem: 2, horario: 'Meio-dia', tipo: 'Vídeo', descricao: 'Vídeo dos alunos trabalhando.', texto: 'Sem texto ou "[X] alunos, [Y] horas."' },
      { ordem: 3, horario: 'Final', tipo: 'Foto', descricao: 'Foto dos produtos finalizados.', texto: '"O resultado de [X] horas de imersão."' },
    ],
  },
  {
    id: 3,
    nome: 'Lançamento/Produto',
    stories: [
      { ordem: 1, horario: 'Teaser', tipo: 'Texto', descricao: 'Fundo preto + texto branco.', texto: 'Frase de curiosidade sem revelar.' },
      { ordem: 2, horario: 'Contexto', tipo: 'Foto/Vídeo', descricao: 'Foto/vídeo do produto com texto curto explicando.', texto: 'Texto curto explicando.' },
      { ordem: 3, horario: 'CTA', tipo: 'Texto', descricao: 'Fundo preto + texto branco.', texto: '"Comenta [KEYWORD] que eu te mando o link."' },
    ],
  },
  {
    id: 4,
    nome: 'Pessoal/Família',
    stories: [
      { ordem: 1, horario: 'Principal', tipo: 'Foto', descricao: 'Foto com Deise/Laura.', texto: 'Sem texto. Só a foto.' },
      { ordem: 2, horario: 'Opcional', tipo: 'Texto', descricao: 'Texto curto sobre o momento.', texto: 'Máximo 1 frase.' },
    ],
  },
];
