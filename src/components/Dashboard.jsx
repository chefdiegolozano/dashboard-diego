import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { BarChart3, Eye, Users, TrendingUp } from 'lucide-react';
import { Card, SectionHeader, StatCard } from './ui/Card';
import { Badge } from './ui/Badge';
import {
  calcEngajamento, classificarPost, formatarViews,
  getPostsDoMes, agruparPorPilar, getSemanasRecentes,
} from '../utils/calculations';

const PILAR_COLORS_PIE = {
  Gestão: '#E65100',
  Técnica: '#6A1B9A',
  Pessoal: '#2E7D32',
  Levena: '#B8860B',
  ECDL: '#1565C0',
};

const META_PILARES = [
  { pilar: 'Gestão', meta: 40 },
  { pilar: 'Técnica', meta: 20 },
  { pilar: 'Pessoal', meta: 10 },
  { pilar: 'Levena', meta: 20 },
  { pilar: 'ECDL', meta: 10 },
];

// Sample data for empty state
const SAMPLE_WEEKS = [
  { label: 'S1', mediaViews: 145000, mediaEng: 1.8 },
  { label: 'S2', mediaViews: 162000, mediaEng: 2.1 },
  { label: 'S3', mediaViews: 138000, mediaEng: 1.9 },
  { label: 'S4', mediaViews: 178000, mediaEng: 2.4 },
  { label: 'S5', mediaViews: 155000, mediaEng: 2.0 },
  { label: 'S6', mediaViews: 190000, mediaEng: 2.6 },
  { label: 'S7', mediaViews: 171000, mediaEng: 2.2 },
  { label: 'S8', mediaViews: 185000, mediaEng: 2.3 },
];

const SAMPLE_PILARES = [
  { pilar: 'Gestão', mediaViews: 171000 },
  { pilar: 'Técnica', mediaViews: 72000 },
  { pilar: 'Pessoal', mediaViews: 95000 },
  { pilar: 'Levena', mediaViews: 88000 },
  { pilar: 'ECDL', mediaViews: 65000 },
];

export function Dashboard({ posts }) {
  const postsMes = getPostsDoMes(posts);
  const semanas = posts.length > 0 ? getSemanasRecentes(posts, 8) : SAMPLE_WEEKS;
  const pilares = posts.length > 0 ? agruparPorPilar(postsMes) : SAMPLE_PILARES.map(p => ({ ...p, count: 0, mediaEng: 0 }));

  const totalPosts = postsMes.length;
  const mediaViews = postsMes.length > 0
    ? Math.round(postsMes.reduce((a, p) => a + (parseFloat(p.viewsIG) || 0), 0) / postsMes.length)
    : 0;
  const mediaEng = postsMes.length > 0
    ? (postsMes.reduce((a, p) => a + calcEngajamento(p), 0) / postsMes.length).toFixed(2)
    : 0;
  const totalProfileVisits = postsMes.reduce((a, p) => a + (parseInt(p.profileVisits) || 0), 0);

  // Top 3 posts
  const top3 = [...postsMes]
    .sort((a, b) => (parseFloat(b.viewsIG) || 0) - (parseFloat(a.viewsIG) || 0))
    .slice(0, 3);

  // Distribuição por pilar
  const totalPostsPilar = pilares.reduce((a, p) => a + p.count, 0);
  const pieData = pilares.map(p => ({
    name: p.pilar,
    value: totalPostsPilar > 0 ? Math.round((p.count / totalPostsPilar) * 100) : META_PILARES.find(m => m.pilar === p.pilar)?.meta || 0,
  }));

  const isEmpty = posts.length === 0;

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader
        title="Dashboard"
        subtitle={isEmpty ? 'Dados de exemplo — registre posts reais em Métricas' : `${postsMes.length} post(s) este mês`}
      />

      {isEmpty && (
        <div style={{ background: '#FFF8E7', border: '1px solid #B8860B', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#B8860B' }}>
          Mostrando dados de exemplo. Acesse <strong>Métricas</strong> para registrar seus posts reais.
        </div>
      )}

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Posts no mês" value={totalPosts || '—'} icon={BarChart3} sub="publicados" />
        <StatCard label="Média views IG" value={totalPosts ? formatarViews(mediaViews) : '—'} icon={Eye} sub="por post" color="#1565C0" />
        <StatCard label="Média engajamento" value={totalPosts ? `${mediaEng}%` : '—'} icon={TrendingUp} sub="likes+coment+shares+saves/views" color="#2E7D32" />
        <StatCard label="Profile visits" value={totalPosts ? formatarViews(totalProfileVisits) : '—'} icon={Users} sub="total no mês" color="#6A1B9A" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '15px' }}>Views IG — últimas 8 semanas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={semanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis tickFormatter={v => formatarViews(v)} tick={{ fontSize: 11, fill: '#666' }} />
              <Tooltip formatter={(v) => [formatarViews(v), 'Média views']} />
              <Line type="monotone" dataKey="mediaViews" stroke="#B8860B" strokeWidth={2} dot={{ fill: '#B8860B', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '15px' }}>Engajamento % — últimas 8 semanas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={semanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#666' }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Engajamento']} />
              <Line type="monotone" dataKey="mediaEng" stroke="#2E7D32" strokeWidth={2} dot={{ fill: '#2E7D32', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance por pilar + Top 3 + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Bar chart pilares */}
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '15px' }}>Performance por pilar</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pilares} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D0" />
              <XAxis type="number" tickFormatter={v => formatarViews(v)} tick={{ fontSize: 10, fill: '#666' }} />
              <YAxis type="category" dataKey="pilar" tick={{ fontSize: 11, fill: '#333' }} width={55} />
              <Tooltip formatter={(v) => [formatarViews(v), 'Média views']} />
              <Bar dataKey="mediaViews" fill="#B8860B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top 3 */}
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '15px' }}>Top 3 posts do mês</h3>
          {top3.length === 0 ? (
            <div style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>Nenhum post registrado este mês</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {top3.map((p, i) => {
                const eng = calcEngajamento(p);
                const classif = classificarPost(eng, p.viewsIG);
                return (
                  <div key={p.id} style={{ padding: '10px', background: '#F5EDE0', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#B8860B', fontSize: '16px' }}>#{i + 1}</span>
                      <Badge tipo="classificacao" valor={classif} />
                    </div>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#333', fontWeight: 600, lineHeight: 1.3 }}>{p.titulo}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#666', marginTop: '4px' }}>
                      <span>{formatarViews(p.viewsIG)} views</span>
                      <span>{eng.toFixed(1)}% eng</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Donut */}
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 8px', fontSize: '15px' }}>Distribuição por pilar</h3>
          <p style={{ fontSize: '11px', color: '#999', margin: '0 0 8px' }}>Meta: 40/20/10/20/10</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={PILAR_COLORS_PIE[entry.name] || '#999'} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
              <Legend formatter={(v) => <span style={{ fontSize: '11px' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
