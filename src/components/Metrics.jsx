import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';
import { calcEngajamento, classificarPost, formatarViews } from '../utils/calculations';

const PILARES = ['Gestão', 'Técnica', 'Pessoal', 'Levena', 'ECDL'];
const MARCAS = ['Diego pessoal', 'Levena', 'ECDL', 'Pastry Club'];
const FORMATOS = ['Reels', 'Carrossel', 'Post foto', 'Story'];

const emptyForm = {
  data: new Date().toISOString().split('T')[0],
  titulo: '', pilar: 'Gestão', marca: 'Diego pessoal', formato: 'Reels',
  viewsIG: '', viewsFB: '', likes: '', comments: '', shares: '', saves: '',
  profileVisits: '', followersPerc: '', nonFollowersPerc: '',
};

function PostForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const eng = form.viewsIG
    ? calcEngajamento({ viewsIG: parseFloat(form.viewsIG), likes: parseFloat(form.likes) || 0, comments: parseFloat(form.comments) || 0, shares: parseFloat(form.shares) || 0, saves: parseFloat(form.saves) || 0 })
    : 0;
  const classif = form.viewsIG ? classificarPost(eng, parseFloat(form.viewsIG)) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo || !form.data) { showToast('Preencha título e data', 'error'); return; }
    onSave({ ...form, id: initial?.id || Date.now() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Input label="Data" type="date" value={form.data} onChange={e => set('data', e.target.value)} required />
        <Select label="Pilar" value={form.pilar} onChange={e => set('pilar', e.target.value)} options={PILARES} />
        <div style={{ gridColumn: '1/-1' }}>
          <Input label="Título do post" value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título do post" required />
        </div>
        <Select label="Marca" value={form.marca} onChange={e => set('marca', e.target.value)} options={MARCAS} />
        <Select label="Formato" value={form.formato} onChange={e => set('formato', e.target.value)} options={FORMATOS} />
      </div>

      <p style={{ fontFamily: 'Georgia,serif', color: '#B8860B', fontWeight: 700, fontSize: '14px', margin: '0 0 12px' }}>Métricas</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <Input label="Views IG" type="number" value={form.viewsIG} onChange={e => set('viewsIG', e.target.value)} placeholder="0" />
        <Input label="Views FB" type="number" value={form.viewsFB} onChange={e => set('viewsFB', e.target.value)} placeholder="0" />
        <Input label="Likes" type="number" value={form.likes} onChange={e => set('likes', e.target.value)} placeholder="0" />
        <Input label="Comments" type="number" value={form.comments} onChange={e => set('comments', e.target.value)} placeholder="0" />
        <Input label="Shares" type="number" value={form.shares} onChange={e => set('shares', e.target.value)} placeholder="0" />
        <Input label="Saves" type="number" value={form.saves} onChange={e => set('saves', e.target.value)} placeholder="0" />
        <Input label="Profile Visits" type="number" value={form.profileVisits} onChange={e => set('profileVisits', e.target.value)} placeholder="0" />
        <Input label="Followers %" type="number" value={form.followersPerc} onChange={e => set('followersPerc', e.target.value)} placeholder="0-100" />
        <Input label="Non-followers %" type="number" value={form.nonFollowersPerc} onChange={e => set('nonFollowersPerc', e.target.value)} placeholder="0-100" />
      </div>

      {form.viewsIG && (
        <div style={{ background: '#F5EDE0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#666' }}>Engajamento calculado:</span>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#1A1209', marginLeft: '8px', fontVariantNumeric: 'tabular-nums' }}>{eng.toFixed(2)}%</span>
          </div>
          {classif && <Badge tipo="classificacao" valor={classif} size="lg" />}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
        <Btn type="submit">{initial ? 'Salvar' : 'Registrar post'}</Btn>
      </div>
    </form>
  );
}

export function Metrics({ posts, setPosts }) {
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterPilar, setFilterPilar] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [filterClassif, setFilterClassif] = useState('');
  const [sortField, setSortField] = useState('data');
  const [sortDir, setSortDir] = useState('desc');

  const handleSave = (post) => {
    if (editPost) {
      setPosts(prev => prev.map(p => p.id === post.id ? post : p));
      showToast('Post atualizado');
    } else {
      setPosts(prev => [post, ...prev]);
      showToast('Post registrado');
    }
    setShowForm(false);
    setEditPost(null);
  };

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast('Post removido', 'info');
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = posts
    .filter(p => !filterPilar || p.pilar === filterPilar)
    .filter(p => !filterMarca || p.marca === filterMarca)
    .filter(p => {
      if (!filterClassif) return true;
      const eng = calcEngajamento(p);
      return classificarPost(eng, p.viewsIG) === filterClassif;
    })
    .sort((a, b) => {
      let va, vb;
      if (sortField === 'data') { va = new Date(a.data); vb = new Date(b.data); }
      else if (sortField === 'viewsIG') { va = parseFloat(a.viewsIG) || 0; vb = parseFloat(b.viewsIG) || 0; }
      else if (sortField === 'eng') { va = calcEngajamento(a); vb = calcEngajamento(b); }
      else return 0;
      return sortDir === 'asc' ? va - vb : vb - va;
    });

  const SortBtn = ({ field, label }) => (
    <button onClick={() => toggleSort(field)} style={{
      background: 'none', border: 'none', cursor: 'pointer', color: sortField === field ? '#B8860B' : '#666',
      display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', fontWeight: 600, padding: '2px 4px',
    }}>
      {label}
      {sortField === field ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
    </button>
  );

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <SectionHeader title="Métricas" subtitle={`${posts.length} post(s) registrado(s)`} />
        <Btn onClick={() => { setShowForm(true); setEditPost(null); }}>
          <Plus size={16} /> Novo post
        </Btn>
      </div>

      {/* Filters */}
      <Card style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Select label="Pilar" value={filterPilar} onChange={e => setFilterPilar(e.target.value)}
          options={[{ value: '', label: 'Todos' }, ...PILARES.map(p => ({ value: p, label: p }))]}
          style={{ width: '140px' }} />
        <Select label="Marca" value={filterMarca} onChange={e => setFilterMarca(e.target.value)}
          options={[{ value: '', label: 'Todas' }, ...MARCAS.map(m => ({ value: m, label: m }))]}
          style={{ width: '160px' }} />
        <Select label="Classificação" value={filterClassif} onChange={e => setFilterClassif(e.target.value)}
          options={[{ value: '', label: 'Todas' }, { value: 'EXCELENTE', label: 'EXCELENTE' }, { value: 'BOM', label: 'BOM' }, { value: 'REGULAR', label: 'REGULAR' }, { value: 'FRACO', label: 'FRACO' }]}
          style={{ width: '140px' }} />
        {(filterPilar || filterMarca || filterClassif) && (
          <Btn variant="ghost" size="sm" onClick={() => { setFilterPilar(''); setFilterMarca(''); setFilterClassif(''); }}>
            Limpar filtros
          </Btn>
        )}
        <span style={{ fontSize: '13px', color: '#666', marginLeft: 'auto' }}>{filtered.length} post(s)</span>
      </Card>

      {/* Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#1A1209' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#B8860B', fontWeight: 600, whiteSpace: 'nowrap' }}><SortBtn field="data" label="Data" /></th>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#B8860B', fontWeight: 600 }}>Título</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#B8860B', fontWeight: 600 }}>Pilar</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', color: '#B8860B', fontWeight: 600, whiteSpace: 'nowrap' }}><SortBtn field="viewsIG" label="Views IG" /></th>
                <th style={{ padding: '10px 14px', textAlign: 'right', color: '#B8860B', fontWeight: 600, whiteSpace: 'nowrap' }}><SortBtn field="eng" label="Eng %" /></th>
                <th style={{ padding: '10px 14px', textAlign: 'center', color: '#B8860B', fontWeight: 600 }}>Classif.</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', color: '#B8860B', fontWeight: 600 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    Nenhum post registrado. Clique em "Novo post" para começar.
                  </td>
                </tr>
              ) : filtered.map((p, i) => {
                const eng = calcEngajamento(p);
                const classif = classificarPost(eng, p.viewsIG);
                return (
                  <tr key={p.id} className="zebra-row" style={{ borderBottom: '1px solid #F0E4D0' }}>
                    <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>{p.data}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 500, maxWidth: '240px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.titulo}>{p.titulo}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}><Badge tipo="pilar" valor={p.pilar} /></td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{formatarViews(p.viewsIG)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{eng.toFixed(2)}%</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}><Badge tipo="classificacao" valor={classif} /></td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => { setEditPost(p); setShowForm(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B8860B' }}>
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditPost(null); }} title={editPost ? 'Editar post' : 'Registrar post'} width="640px">
        <PostForm initial={editPost} onSave={handleSave} onCancel={() => { setShowForm(false); setEditPost(null); }} />
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)}
        title="Remover post" message="Tem certeza que deseja remover este post? Esta ação não pode ser desfeita." />
    </div>
  );
}
