export const TEMPLATES_INICIAIS = [
  {
    id: 1,
    nome: 'Reels Gestão — História + Diagnóstico',
    pilar: 'Gestão',
    campos: [
      { key: 'gancho', label: 'GANCHO CONTRAINTUITIVO', placeholder: '1 frase que para o scroll', tipo: 'textarea', rows: 2 },
      { key: 'vulnerabilidade', label: 'VULNERABILIDADE', placeholder: 'história real com número, ano, contexto específico', tipo: 'textarea', rows: 4 },
      { key: 'virada', label: 'VIRADA', placeholder: 'momento de clareza', tipo: 'textarea', rows: 3 },
      { key: 'constatacao', label: 'CONSTATAÇÃO', placeholder: 'lição como constatação, NÃO como conselho', tipo: 'textarea', rows: 3 },
      { key: 'cta', label: 'CTA CONVERSACIONAL', placeholder: 'pergunta que gera reflexão', tipo: 'textarea', rows: 2 },
    ],
  },
  {
    id: 2,
    nome: 'Reels ECDL — Turma/Curso',
    pilar: 'ECDL',
    campos: [
      { key: 'transformacao', label: 'TRANSFORMAÇÃO DO ALUNO', placeholder: 'como chegou vs como saiu', tipo: 'textarea', rows: 3 },
      { key: 'aprendizado', label: 'O QUE APRENDERAM', placeholder: 'lista curta de técnicas/habilidades', tipo: 'textarea', rows: 3 },
      { key: 'metodo', label: 'MÉTODO > TALENTO', placeholder: 'por que funciona', tipo: 'textarea', rows: 2 },
      { key: 'proxima', label: 'PRÓXIMA TURMA', placeholder: 'abertura para demanda', tipo: 'textarea', rows: 2 },
    ],
    sufixo: 'ECDL.',
  },
  {
    id: 3,
    nome: 'Contos do Levena',
    pilar: 'Levena',
    campos: [
      { key: 'detalhe', label: 'DETALHE QUE NINGUÉM PERCEBE', placeholder: 'o que as pessoas veem sem saber', tipo: 'textarea', rows: 2 },
      { key: 'historia', label: 'HISTÓRIA POR TRÁS', placeholder: 'origem, memória, decisão', tipo: 'textarea', rows: 4 },
      { key: 'revelacao', label: 'REVELAÇÃO', placeholder: 'o significado real do detalhe', tipo: 'textarea', rows: 2 },
      { key: 'fechamento', label: 'FECHAMENTO ÚNICO', placeholder: 'fechamento único para este episódio', tipo: 'textarea', rows: 2 },
    ],
    sufixo: 'Contos do Levena. Cada detalhe tem uma razão.',
  },
  {
    id: 4,
    nome: 'Pessoal — Deise/Família/Vida',
    pilar: 'Pessoal',
    campos: [
      { key: 'momento', label: 'MOMENTO ESPECÍFICO', placeholder: 'dia, hora, lugar', tipo: 'textarea', rows: 2 },
      { key: 'memoria', label: 'MEMÓRIA OU EMOÇÃO', placeholder: 'infância, família, descoberta', tipo: 'textarea', rows: 3 },
      { key: 'constatacao', label: 'CONSTATAÇÃO SILENCIOSA', placeholder: 'o que aquilo significou', tipo: 'textarea', rows: 2 },
    ],
  },
  {
    id: 5,
    nome: 'Produto Levena',
    pilar: 'Levena',
    campos: [
      { key: 'origem', label: 'ORIGEM DA IDEIA', placeholder: 'por que esse produto existe', tipo: 'textarea', rows: 2 },
      { key: 'processo', label: 'PROCESSO', placeholder: 'como foi desenvolvido (sem virar catálogo)', tipo: 'textarea', rows: 3 },
      { key: 'resultado', label: 'RESULTADO', placeholder: 'reação do público, não número de vendas', tipo: 'textarea', rows: 2 },
    ],
  },
];
