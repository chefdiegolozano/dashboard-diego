import { useState } from 'react';
import { Plus, Shuffle, Search, Edit2, Trash2 } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';

const PILARES = ['Gestão', 'Técnica', 'Pessoal', 'Levena', 'ECDL'];
const MARCAS = ['Diego', 'Levena', 'ECDL'];
const FORMATOS = ['Reels', 'Carrossel', 'Post', 'Story'];
const STATUS_OPTS = ['Disponível', 'Usada', 'Arquivada'];

const emptyForm = { pilar: 'Gestão', marca: 'Diego', titulo: '', formato: 'Reels', status: 'Disponível' };

export function Pautas({ pautas, setPautas }) {
  const [filterPilar, setFilterPilar] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPauta, setEditPauta] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const disponíveis = pautas.filter(p => p.status === 'Disponível');
  const total = pautas.length;

  const filtered = pautas
    .filter(p => !filterPilar || p.pilar === filterPilar)
    .filter(p => !search || p.titulo.toLowerCase().includes(search.toLowerCase()));

  const sortear = () => {
    const pool = (filterPilar
      ? pautas.filter(p => p.pilar === filterPilar && p.status === 'Disponível')
      : pautas.filter(p => p.status === 'Disponível'));
    if (pool.length === 0) { showToast('Nenhuma pauta disponível no pilar selecionado', 'error'); return; }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    showToast(`Sorteada: "${chosen.titulo}" (#${chosen.numero})`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.titulo) { showToast('Título obrigatório', 'error'); return; }
    if (editPauta) {
      setPautas(prev => prev.map(p => p.id === editPauta.id ? { ...editPauta, ...form } : p));
      showToast('Pauta atualizada');
    } else {
      const maxNum = pautas.reduce((a, p) => Math.max(a, p.numero || 0), 0);
      setPautas(prev => [...prev, { id: Date.now(), numero: maxNum + 1, ...form }]);
      showToast('Pauta adicionada');
    }
    setShowForm(false);
    setEditPauta(null);
    setForm(emptyForm);
  };

  const marcarUsada = (id) => {
    setPautas(prev => prev.map(p => p.id === id
      ? { ...p, status: 'Usada', dataUso: new Date().toISOString().split('T')[0] }
      : p));
    showToast('Pauta marcada como usada');
  };

  const handleDelete = (id) => {
    setPautas(prev => prev.filter(p => p.id !== id));
    showToast('Pauta removida', 'info');
  };

  const openEdit = (pauta) => {
    setEditPauta(pauta);
    setForm({ pilar: pauta.pilar, marca: pauta.marca, titulo: pauta.titulo, formato: pauta.formato, status: pauta.status });
    setShowForm(true);
  };

  const STATUS_COLOR = { Disponível: '#2E7D32', Usada: '#1565C0', Arquivada: '#999' };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <SectionHeader title="Banco de Pautas" subtitle={`${disponíveis.length} disponíveis de ${total} total`} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <Btn variant="secondary" onClick={sortear}><Shuffle size={15} /> Sortear pauta</Btn>
          <Btn onClick={() => { setShowForm(true); setEditPauta(null); setForm(emptyForm); }}>
            <Plus size={15} /> Adicionar pauta
          </Btn>
        </div>
      </div>

      {/* Counter por pilar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {PILARES.map(pilar => {
          const count = pautas.filter(p => p.pilar === pilar && p.status === 'Disponível').length;
          const total = pautas.filter(p => p.pilar === pilar).length;
          return (
            <button key={pilar} onClick={() => setFilterPilar(filterPilar === pilar ? '' : pilar)}
              style={{
                padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                border: `1px solid ${filterPilar === pilar ? '#B8860B' : '#ddd'}`,
                background: filterPilar === pilar ? '#B8860B' : '#fff',
                color: filterPilar === pilar ? '#1A1209' : '#333',
                transition: 'all 0.15s',
              }}>
              {pilar} <span style={{ opacity: 0.7 }}>({count}/{total})</span>
            </button>
          );
        })}
        {filterPilar && (
          <button onClick={() => setFilterPilar('')}
            style={{ padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', border: '1px solid #ddd', background: 'transparent', color: '#666' }}>
            Todos
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar pautas..."
          style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
        {filtered.map(p => (
          <Card key={p.id} style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#999' }}>#{p.numero}</span>
                <Badge tipo="pilar" valor={p.pilar} />
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, color: STATUS_COLOR[p.status] || '#999', background: '#f9f9f9', border: '1px solid currentColor' }}>
                  {p.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B8860B' }}><Edit2 size={14} /></button>
                <button onClick={() => setDeleteId(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828' }}><Trash2 size={14} /></button>
              </div>
            </div>

            <p style={{ fontWeight: 600, fontSize: '14px', color: '#1A1209', margin: '0 0 8px', lineHeight: 1.4 }}>{p.titulo}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span>{p.formato}</span>
                <span>·</span>
                <span>{p.marca}</span>
              </div>
              {p.status === 'Disponível' && (
                <button onClick={() => marcarUsada(p.id)} style={{
                  padding: '3px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                  background: 'transparent', border: '1px solid #B8860B', color: '#B8860B',
                }}>
                  Marcar usada
                </button>
              )}
              {p.status === 'Usada' && p.dataUso && (
                <span style={{ fontSize: '11px', color: '#999' }}>Usada em {p.dataUso}</span>
              )}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#999', fontSize: '14px' }}>
            Nenhuma pauta encontrada
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditPauta(null); }}
        title={editPauta ? 'Editar pauta' : 'Nova pauta'} width="480px">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input label="Título / Ideia" value={form.titulo} onChange={e => set('titulo', e.target.value)} required placeholder="Descreva a pauta..." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select label="Pilar" value={form.pilar} onChange={e => set('pilar', e.target.value)} options={PILARES} />
            <Select label="Marca" value={form.marca} onChange={e => set('marca', e.target.value)} options={MARCAS} />
            <Select label="Formato" value={form.formato} onChange={e => set('formato', e.target.value)} options={FORMATOS} />
            <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_OPTS} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setEditPauta(null); }}>Cancelar</Btn>
            <Btn type="submit">{editPauta ? 'Salvar' : 'Adicionar'}</Btn>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Remover pauta" message="Remover esta pauta definitivamente?" />
    </div>
  );
}
