export function calcEngajamento(post) {
  const { viewsIG, likes, comments, shares, saves } = post;
  if (!viewsIG || viewsIG === 0) return 0;
  const interacoes = (likes || 0) + (comments || 0) + (shares || 0) + (saves || 0);
  return ((interacoes / viewsIG) * 100);
}

export function classificarPost(engajamento, viewsIG) {
  const eng = parseFloat(engajamento);
  const views = parseFloat(viewsIG);
  if (eng > 2.5 && views > 180000) return 'EXCELENTE';
  if (eng >= 2.0 && eng <= 2.5 && views >= 140000 && views <= 180000) return 'BOM';
  if (eng >= 1.5 && eng < 2.0 && views >= 100000 && views < 140000) return 'REGULAR';
  return 'FRACO';
}

export function classificarCor(classificacao) {
  const cores = {
    EXCELENTE: { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
    BOM: { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
    REGULAR: { bg: '#FFF8E1', text: '#F57F17', border: '#F57F17' },
    FRACO: { bg: '#FFEBEE', text: '#C62828', border: '#C62828' },
  };
  return cores[classificacao] || cores.FRACO;
}

export function formatarViews(views) {
  if (!views) return '0';
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(0)}k`;
  return views.toString();
}

export function calcMediaMensal(posts, campo) {
  if (!posts || posts.length === 0) return 0;
  const soma = posts.reduce((acc, p) => acc + (parseFloat(p[campo]) || 0), 0);
  return soma / posts.length;
}

export function getPostsDoMes(posts) {
  const agora = new Date();
  const mes = agora.getMonth();
  const ano = agora.getFullYear();
  return (posts || []).filter(p => {
    const d = new Date(p.data);
    return d.getMonth() === mes && d.getFullYear() === ano;
  });
}

export function getPostsDaSemana(posts, offset = 0) {
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  const diaSemana = hoje.getDay();
  const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1;
  inicioSemana.setDate(hoje.getDate() - diffInicio + offset * 7);
  inicioSemana.setHours(0, 0, 0, 0);
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);
  fimSemana.setHours(23, 59, 59, 999);
  return (posts || []).filter(p => {
    const d = new Date(p.data);
    return d >= inicioSemana && d <= fimSemana;
  });
}

export function agruparPorPilar(posts) {
  const pilares = ['Gestão', 'Técnica', 'Pessoal', 'Levena', 'ECDL'];
  return pilares.map(pilar => {
    const pPilar = posts.filter(p => p.pilar === pilar);
    const mediaViews = pPilar.length > 0
      ? pPilar.reduce((a, p) => a + (parseFloat(p.viewsIG) || 0), 0) / pPilar.length
      : 0;
    const mediaEng = pPilar.length > 0
      ? pPilar.reduce((a, p) => a + (calcEngajamento(p) || 0), 0) / pPilar.length
      : 0;
    return { pilar, count: pPilar.length, mediaViews, mediaEng };
  });
}

export function getSemanasRecentes(posts, numSemanas = 8) {
  const semanas = [];
  const hoje = new Date();
  for (let i = numSemanas - 1; i >= 0; i--) {
    const inicioSemana = new Date(hoje);
    const diaSemana = hoje.getDay();
    const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1;
    inicioSemana.setDate(hoje.getDate() - diffInicio - i * 7);
    inicioSemana.setHours(0, 0, 0, 0);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);

    const postsSemana = (posts || []).filter(p => {
      const d = new Date(p.data);
      return d >= inicioSemana && d <= fimSemana;
    });

    const label = `S${numSemanas - i}`;
    const mediaViews = postsSemana.length > 0
      ? postsSemana.reduce((a, p) => a + (parseFloat(p.viewsIG) || 0), 0) / postsSemana.length
      : 0;
    const mediaEng = postsSemana.length > 0
      ? postsSemana.reduce((a, p) => a + calcEngajamento(p), 0) / postsSemana.length
      : 0;

    semanas.push({ label, mediaViews: Math.round(mediaViews), mediaEng: parseFloat(mediaEng.toFixed(2)) });
  }
  return semanas;
}
