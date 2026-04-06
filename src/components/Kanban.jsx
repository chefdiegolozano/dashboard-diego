import { useState, useRef } from 'react';
import { Plus, GripVertical, X, ExternalLink, Clock } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { showToast } from './ui/Toast';

const COLUNAS = [
  { id: 'pauta', label: 'PAUTA', color: '#F5EDE0', border: '#E0D0B0' },
  { id: 'gravado', label: 'GRAVADO', color: '#E3F2FD', border: '#90CAF9' },
  { id: 'editando', label: 'EDITANDO', color: '#FFF8E1', border: '#FFE082' },
  { id: 'pronto', label: 'PRONTO', color: '#E8F5E9', border: '#A5D6A7' },
  { id: 'publicado', label: 'PUBLICADO', color: '#FFF8E7', border: '#B8860B' },
];

const PILARES = ['Gestão', 'Técnica', 'Pessoal', 'Levena', 'ECDL'];
const MARCAS = ['Diego pessoal', 'Levena', 'ECDL', 'Pastry Club'];

const emptyCard = {
  titulo: '', pilar: 'Gestão', marca: 'Diego pessoal',
  copy: '', dataPrevista: '', linkBruto: '', linkEditado: '', notas: '',
};

function timeDiff(isoDate) {
  if (!isoDate) return '';
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoje';
  if (days === 1) return '1 dia';
  return `${days} dias`;
}

function KanbanCardComp({ card, colId, onEdit, onDelete, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('cardId', card.id); e.dataTransfer.setData('fromCol', colId); onDragStart(); }}
      onDragEnd={onDragEnd}
      style={{
        background: '#fff', borderRadius: '8px', padding: '12px',
        border: '1px solid #F0E4D0', cursor: 'grab', marginBottom: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '6px' }}>
        <Badge tipo="pilar" valor={card.pilar} />
        <button onClick={() => onDelete(card.id, colId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '0', flexShrink: 0 }}>
          <X size={13} />
        </button>
      </div>
      <p style={{ fontWeight: 600, fontSize: '13px', color: '#1A1209', margin: '0 0 6px', lineHeight: 1.4, cursor: 'pointer' }} onClick={() => onEdit(card, colId)}>
        {card.titulo || <span style={{ color: '#999', fontStyle: 'italic' }}>Sem título</span>}
      </p>
      <div style={{ fontSize: '11px', color: '#999', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{card.marca}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Clock size={9} />
          <span>{timeDiff(card.criadoEm)}</span>
        </div>
      </div>
      {card.dataPrevista && (
        <div style={{ fontSize: '10px', color: '#B8860B', fontWeight: 600, marginTop: '4px' }}>
          {card.dataPrevista}
        </div>
      )}
    </div>
  );
}

function CardForm({ initial, colId, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyCard);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input label="Título" value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título do post" required />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Select label="Pilar" value={form.pilar} onChange={e => set('pilar', e.target.value)} options={PILARES} />
        <Select label="Marca" value={form.marca} onChange={e => set('marca', e.target.value)} options={MARCAS} />
      </div>
      <Input label="Copy" type="textarea" value={form.copy} onChange={e => set('copy', e.target.value)} placeholder="Copy do post..." rows={4} />
      <Input label="Data prevista" type="date" value={form.dataPrevista} onChange={e => set('dataPrevista', e.target.value)} />
      <Input label="Link bruto (Drive)" value={form.linkBruto} onChange={e => set('linkBruto', e.target.value)} placeholder="https://drive.google.com/..." />
      <Input label="Link editado" value={form.linkEditado} onChange={e => set('linkEditado', e.target.value)} placeholder="https://..." />
      <Input label="Notas para o editor" type="textarea" value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Instruções de edição..." rows={2} />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
        <Btn onClick={() => onSave(form)}>{initial?.id ? 'Salvar' : 'Criar card'}</Btn>
      </div>
    </div>
  );
}

export function Kanban({ kanban, setKanban }) {
  const [editCard, setEditCard] = useState(null);
  const [editColId, setEditColId] = useState(null);
  const [addColId, setAddColId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [filterPilar, setFilterPilar] = useState('');

  const ensureCol = (kanban, colId) => ({ ...kanban, [colId]: kanban[colId] || [] });

  const getCards = (colId) => {
    const cards = (kanban[colId] || []);
    if (!filterPilar) return cards;
    return cards.filter(c => c.pilar === filterPilar);
  };

  const handleDrop = (e, toCol) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const fromCol = e.dataTransfer.getData('fromCol');
    if (!cardId || !fromCol || fromCol === toCol) { setDragOver(null); return; }

    setKanban(prev => {
      const fromCards = (prev[fromCol] || []);
      const card = fromCards.find(c => String(c.id) === cardId);
      if (!card) return prev;
      const updated = {
        ...prev,
        [fromCol]: fromCards.filter(c => String(c.id) !== cardId),
        [toCol]: [...(prev[toCol] || []), { ...card, movidoEm: new Date().toISOString() }],
      };
      return updated;
    });
    setDragOver(null);
    showToast('Card movido');
  };

  const handleSaveCard = (form, colId) => {
    if (editCard?.id) {
      setKanban(prev => ({
        ...prev,
        [colId]: (prev[colId] || []).map(c => c.id === editCard.id ? { ...c, ...form } : c),
      }));
      showToast('Card atualizado');
    } else {
      const newCard = { ...form, id: Date.now(), criadoEm: new Date().toISOString() };
      setKanban(prev => ({ ...prev, [colId]: [...(prev[colId] || []), newCard] }));
      showToast('Card criado');
    }
    setEditCard(null);
    setEditColId(null);
    setAddColId(null);
  };

  const handleDelete = (cardId, colId) => {
    setKanban(prev => ({ ...prev, [colId]: (prev[colId] || []).filter(c => c.id !== cardId) }));
    showToast('Card removido', 'info');
  };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <SectionHeader title="Kanban de Conteúdo" subtitle="Pipeline visual de produção" />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['', ...PILARES].map(p => (
            <button key={p || 'all'} onClick={() => setFilterPilar(p)}
              style={{
                padding: '5px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                background: filterPilar === p ? '#1A1209' : '#fff',
                color: filterPilar === p ? '#B8860B' : '#333',
                border: `1px solid ${filterPilar === p ? '#1A1209' : '#ddd'}`,
              }}>
              {p || 'Todos'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', overflowX: 'auto' }}>
        {COLUNAS.map(col => {
          const cards = getCards(col.id);
          const total = (kanban[col.id] || []).length;

          return (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              style={{
                background: dragOver === col.id ? '#FFF8E7' : col.color,
                borderRadius: '10px',
                border: `2px solid ${dragOver === col.id ? '#B8860B' : col.border}`,
                minHeight: '400px',
                transition: 'all 0.15s',
              }}
            >
              {/* Column header */}
              <div style={{ padding: '12px 14px 8px', borderBottom: `1px solid ${col.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1A1209', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {col.label}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#B8860B', background: '#fff', padding: '1px 7px', borderRadius: '10px' }}>
                    {total}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div style={{ padding: '10px' }}>
                {cards.map(card => (
                  <KanbanCardComp
                    key={card.id}
                    card={card}
                    colId={col.id}
                    onEdit={(c, cid) => { setEditCard(c); setEditColId(cid); }}
                    onDelete={handleDelete}
                    onDragStart={() => {}}
                    onDragEnd={() => setDragOver(null)}
                  />
                ))}

                {cards.length === 0 && !filterPilar && (
                  <p style={{ textAlign: 'center', color: '#bbb', fontSize: '12px', padding: '20px 0', fontStyle: 'italic' }}>
                    Nenhum card
                  </p>
                )}

                <button
                  onClick={() => { setAddColId(col.id); setEditCard(null); }}
                  style={{
                    width: '100%', padding: '8px', border: '1px dashed #ccc', borderRadius: '6px',
                    background: 'transparent', cursor: 'pointer', color: '#999', fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    marginTop: '4px',
                  }}
                >
                  <Plus size={12} /> Novo card
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!(editCard && editColId) || !!addColId}
        onClose={() => { setEditCard(null); setEditColId(null); setAddColId(null); }}
        title={editCard?.id ? 'Editar card' : 'Novo card'}
        width="560px"
      >
        <CardForm
          initial={editCard}
          colId={editColId || addColId}
          onSave={(form) => handleSaveCard(form, editColId || addColId)}
          onCancel={() => { setEditCard(null); setEditColId(null); setAddColId(null); }}
        />
      </Modal>
    </div>
  );
}
