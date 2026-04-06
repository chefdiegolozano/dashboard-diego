export const FLUXO_SEMANAL = [
  {
    dia: 'DOM/SEG',
    diego: 'Define pautas da semana com base no que viveu',
    editor: '—',
    claude: 'Gera copies para cada pauta',
  },
  {
    dia: 'SEG/TER',
    diego: 'Grava batch (6–8 peças)',
    editor: '—',
    claude: 'Refina copies pós-aprovação',
  },
  {
    dia: 'TER/QUA',
    diego: 'Envia brutos pro editor',
    editor: 'Recebe e inicia edição',
    claude: 'Prepara carrosséis se necessário',
  },
  {
    dia: 'QUA/QUI',
    diego: 'Revisa primeiros cortes',
    editor: 'Ajusta e finaliza',
    claude: '—',
  },
  {
    dia: 'QUI/SEX',
    diego: 'Aprova finais',
    editor: 'Entrega tudo editado',
    claude: 'Agenda no Meta Business',
  },
  {
    dia: 'SEG–DOM',
    diego: 'Posta stories em tempo real',
    editor: '—',
    claude: 'Monitora métricas + sugere ajustes',
  },
];

export const BATCH_SCHEDULE = [
  {
    bloco: '09–10h',
    atividade: 'Preparação: separar pautas, escolher locais, trocar de roupa entre gravações',
  },
  {
    bloco: '10–12h',
    atividade: 'Gravar 3–4 Reels de gestão/diagnóstico (escritório, bancada limpa, balcão)',
  },
  {
    bloco: '12–13h',
    atividade: 'Gravar 1–2 Reels de técnica no Levena ou ECDL (produção real, não encenada)',
  },
  {
    bloco: '14–15h',
    atividade: 'Gravar fotos para carrossel + material de stories (banco de imagens da semana)',
  },
  {
    bloco: '15–16h',
    atividade: 'Contos do Levena: gravar 1–2 episódios (escadaria, piso, luminárias, logo)',
  },
];

export const REGRAS_BATCH = [
  'Resultado: 6–8 peças brutas em 1 dia',
  'Trocar de camiseta entre gravações (mínimo 3 diferentes)',
  'Banco de B-Roll semanal: mãos na bancada, equipe em ação, produtos finalizados, detalhes do espaço, Diego andando/pensando',
];

export const FERRAMENTAS = [
  { ferramenta: 'ManyChat', funcao: 'Automação de DMs, comentários e story replies', custo: '$15/mês (Pro)' },
  { ferramenta: 'Meta Business Suite', funcao: 'Agendamento de posts, reels e stories', custo: 'Gratuito' },
  { ferramenta: 'Claude (Anthropic)', funcao: 'Geração de copies, estratégia, análise de métricas', custo: '$20/mês (Pro)' },
  { ferramenta: 'Google Drive', funcao: 'Pasta compartilhada Diego + Editor (brutos e finais)', custo: 'Gratuito' },
  { ferramenta: 'Notion ou Trello', funcao: 'Kanban de conteúdo (se preferir fora do dashboard)', custo: 'Gratuito' },
  { ferramenta: 'Plataforma ECDL', funcao: 'Venda de produtos digitais (Raio-X Operacional)', custo: 'Variável' },
];

export const BRIEFING_TEMPLATE = `1. Arquivo bruto: [link Google Drive]
2. Copy aprovada: [colar texto]
3. Cortes importantes: [indicar momentos]
4. Sugestão de música: [se Reels]
5. Data de publicação: [dia + horário]`;
