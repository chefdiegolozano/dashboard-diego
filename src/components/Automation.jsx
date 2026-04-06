import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';
import { FERRAMENTAS } from '../data/workflowData';

const TABS = ['Ferramentas', 'ManyChat'];
const TIPOS = ['DM', 'Comentário', 'Story reply'];

export function Automation({ triggers, setTriggers }) {
  const [tab, setTab] = useState(0);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ keyword: '', tipo: 'DM', mensagem: '', status: 'Ativo' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveForm = () => {
    if (!form.keyword || !form.mensagem) { showToast('Keyword e mensagem obrigatórios', 'error'); return; }
    if (editId) {
      setTriggers(prev => prev.map(t => t.id === editId ? { ...t, ...form, ultimaAtualizacao: new Date().toISOString().split('T')[0] } : t));
      showToast('Trigger atualizado');
    } else {
      setTriggers(prev => [...prev, { id: Date.now(), ...form, ultimaAtualizacao: new Date().toISOString().split('T')[0] }]);
      showToast('Trigger adicionado');
    }
    setEditId(null);
    setShowAdd(false);
    setForm({ keyword: '', tipo: 'DM', mensagem: '', status: 'Ativo' });
  };

  const startEdit = (t) => {
    setEditId(t.id);
    setForm({ keyword: t.keyword, tipo: t.tipo, mensagem: t.mensagem, status: t.status });
    setShowAdd(true);
  };

  const toggleStatus = (id) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Ativo' ? 'Inativo' : 'Ativo' } : t));
    showToast('Status alterado');
  };

  const deleteTrigger = (id) => {
    setTriggers(prev => prev.filter(t => t.id !== id));
    showToast('Trigger removido', 'info');
  };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Automação & Ferramentas" subtitle="Stack e fluxos ManyChat" />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
            background: tab === i ? '#1A1209' : '#fff',
            color: tab === i ? '#B8860B' : '#333',
            border: `1px solid ${tab === i ? '#1A1209' : '#ddd'}`,
          }}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '16px' }}>Stack de Ferramentas</h3>
          <Card>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#1A1209' }}>
                    {['FERRAMENTA', 'FUNÇÃO', 'CUSTO'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#B8860B', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FERRAMENTAS.map((f, i) => (
                    <tr key={i} className="zebra-row" style={{ borderBottom: '1px solid #F0E4D0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1A1209' }}>{f.ferramenta}</td>
                      <td style={{ padding: '12px 16px', color: '#333' }}>{f.funcao}</td>
                      <td style={{ padding: '12px 16px', color: '#B8860B', fontWeight: 600 }}>{f.custo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === 1 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: 0, fontSize: '16px' }}>
              Fluxos ManyChat ({triggers.length} triggers)
            </h3>
            <Btn onClick={() => { setShowAdd(true); setEditId(null); setForm({ keyword: '', tipo: 'DM', mensagem: '', status: 'Ativo' }); }}>
              <Plus size={15} /> Novo trigger
            </Btn>
          </div>

          {showAdd && (
            <Card style={{ padding: '20px', marginBottom: '16px', border: '2px solid #B8860B' }} className="animate-fade-in">
              <h4 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '14px' }}>
                {editId ? 'Editar trigger' : 'Novo trigger'}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <Input label="Keyword" value={form.keyword} onChange={e => set('keyword', e.target.value)} placeholder="Ex: LINK, CURSO..." required />
                <Select label="Tipo" value={form.tipo} onChange={e => set('tipo', e.target.value)} options={TIPOS} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Input label="Mensagem automática" type="textarea" value={form.mensagem} onChange={e => set('mensagem', e.target.value)} placeholder="Mensagem enviada automaticamente..." rows={3} required />
              </div>
              <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)} options={['Ativo', 'Inativo']} style={{ width: '150px', marginBottom: '12px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Btn onClick={saveForm}><Save size={14} /> Salvar</Btn>
                <Btn variant="ghost" onClick={() => { setShowAdd(false); setEditId(null); }}><X size={14} /> Cancelar</Btn>
              </div>
            </Card>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {triggers.map(t => (
              <Card key={t.id} style={{ padding: '16px', border: t.status === 'Inativo' ? '1px solid #ddd' : '1px solid #F0E4D0', opacity: t.status === 'Inativo' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#B8860B', fontFamily: 'Georgia,serif' }}>
                        {t.keyword}
                      </span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 600,
                        background: t.tipo === 'DM' ? '#E3F2FD' : '#FFF3E0',
                        color: t.tipo === 'DM' ? '#1565C0' : '#E65100',
                      }}>{t.tipo}</span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 600,
                        background: t.status === 'Ativo' ? '#E8F5E9' : '#F5F5F5',
                        color: t.status === 'Ativo' ? '#2E7D32' : '#999',
                      }}>{t.status}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#333', margin: '0 0 4px', lineHeight: 1.5 }}>{t.mensagem}</p>
                    <span style={{ fontSize: '11px', color: '#999' }}>Atualizado: {t.ultimaAtualizacao}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => toggleStatus(t.id)} style={{
                      padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                      background: 'transparent', border: `1px solid ${t.status === 'Ativo' ? '#F57F17' : '#2E7D32'}`,
                      color: t.status === 'Ativo' ? '#F57F17' : '#2E7D32',
                    }}>
                      {t.status === 'Ativo' ? 'Pausar' : 'Ativar'}
                    </button>
                    <button onClick={() => startEdit(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B8860B' }}><Edit2 size={15} /></button>
                    <button onClick={() => setDeleteId(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828' }}><Trash2 size={15} /></button>
                  </div>
                </div>
              </Card>
            ))}
            {triggers.length === 0 && (
              <Card style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#999', fontSize: '14px' }}>Nenhum trigger configurado.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteTrigger(deleteId)}
        title="Remover trigger" message="Remover este trigger do ManyChat?" />
    </div>
  );
}
