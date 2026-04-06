import { useState } from 'react';
import { Copy, Save, Plus, Trash2 } from 'lucide-react';
import { Card, SectionHeader, Btn, Input, Select } from './ui/Card';
import { Modal, ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';
import { TEMPLATES_INICIAIS } from '../data/templates';
import { AIGenerator } from './AIGenerator';

const PILARES = ['Gestão', 'Técnica', 'Pessoal', 'Levena', 'ECDL'];

function buildCopy(template, values) {
  let result = '';
  template.campos.forEach(campo => {
    if (values[campo.key]) {
      result += `[${campo.label}]\n${values[campo.key]}\n\n`;
    }
  });
  if (template.sufixo) result += template.sufixo;
  return result.trim();
}

export function Templates({ drafts, setDrafts, apiKey }) {
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [values, setValues] = useState({});
  const [draftTitle, setDraftTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ nome: '', pilar: 'Gestão' });

  const template = TEMPLATES_INICIAIS[activeTemplate];

  const setVal = (k, v) => setValues(prev => ({ ...prev, [k]: v }));

  const copyToClipboard = () => {
    const copy = values.ai_generated || buildCopy(template, values);
    if (!copy) { showToast('Preencha ao menos um campo ou gere com IA', 'error'); return; }
    navigator.clipboard.writeText(copy).then(() => showToast('Copy copiada para o clipboard'));
  };

  const saveDraft = () => {
    const copy = values.ai_generated || buildCopy(template, values);
    if (!copy) { showToast('Preencha ao menos um campo ou gere com IA', 'error'); return; }
    if (!draftTitle) { showToast('Digite um título para o rascunho', 'error'); return; }
    const draft = {
      id: Date.now(),
      titulo: draftTitle,
      template: template.nome,
      copy,
      data: new Date().toISOString().split('T')[0],
    };
    setDrafts(prev => [draft, ...prev]);
    setDraftTitle('');
    setShowSaveModal(false);
    showToast('Rascunho salvo');
  };

  const deleteDraft = (id) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    showToast('Rascunho removido', 'info');
  };

  const copyCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => showToast('Copy copiada'));
  };

  // When AI applies copy, populate the free-text preview directly
  const handleAIApply = (copy) => {
    // Put the full copy into a synthetic "ai_copy" field shown in the preview
    setValues({ ai_generated: copy });
    showToast('Copy aplicada — aparece no preview à direita');
  };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Templates de Copy" subtitle="5 templates pré-carregados" />

      {/* AI Generator — always visible at top */}
      <div style={{ marginBottom: '24px' }}>
        <AIGenerator
          apiKey={apiKey}
          defaultPilar={TEMPLATES_INICIAIS[activeTemplate]?.pilar || 'Gestão'}
          onApply={handleAIApply}
        />
      </div>

      {/* Template tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TEMPLATES_INICIAIS.map((t, i) => (
          <button key={t.id} onClick={() => { setActiveTemplate(i); setValues({}); }}
            style={{
              padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              background: activeTemplate === i ? '#1A1209' : '#fff',
              color: activeTemplate === i ? '#B8860B' : '#333',
              border: `1px solid ${activeTemplate === i ? '#1A1209' : '#ddd'}`,
              transition: 'all 0.15s',
            }}>
            {t.nome}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Form */}
        <Card style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '15px' }}>
            {template.nome}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {template.campos.map(campo => (
              <div key={campo.key}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#B8860B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  {campo.label}
                </label>
                <p style={{ fontSize: '11px', color: '#999', margin: '0 0 6px', fontStyle: 'italic' }}>{campo.placeholder}</p>
                <textarea
                  value={values[campo.key] || ''}
                  onChange={e => setVal(campo.key, e.target.value)}
                  rows={campo.rows || 3}
                  placeholder={`Preencha: ${campo.placeholder}`}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <Btn onClick={copyToClipboard}><Copy size={14} /> Copiar copy</Btn>
            <Btn variant="secondary" onClick={() => setShowSaveModal(true)}><Save size={14} /> Salvar rascunho</Btn>
          </div>
        </Card>

        {/* Preview */}
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: 0, fontSize: '15px' }}>Preview</h3>
            {values.ai_generated && (
              <span style={{ fontSize: '11px', background: '#E8F5E9', color: '#2E7D32', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                Gerada por IA
              </span>
            )}
          </div>
          <div style={{
            background: '#F5EDE0', borderRadius: '8px', padding: '16px',
            minHeight: '200px', fontSize: '13px', lineHeight: 1.7, color: '#333',
            whiteSpace: 'pre-wrap', fontFamily: 'inherit',
            borderLeft: values.ai_generated ? '3px solid #2E7D32' : 'none',
          }}>
            {values.ai_generated || buildCopy(template, values) || (
              <span style={{ color: '#999', fontStyle: 'italic' }}>Preencha os campos ao lado ou use "Gerar copy com IA" acima...</span>
            )}
          </div>
          {template.sufixo && (
            <p style={{ fontSize: '12px', color: '#B8860B', fontWeight: 600, margin: '8px 0 0' }}>
              Sufixo fixo: {template.sufixo}
            </p>
          )}
        </Card>
      </div>

      {/* Rascunhos */}
      <div>
        <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '17px' }}>
          Rascunhos salvos ({drafts.length})
        </h3>
        {drafts.length === 0 ? (
          <Card style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: '14px' }}>Nenhum rascunho salvo. Preencha um template e clique em "Salvar rascunho".</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {drafts.map(d => (
              <Card key={d.id} style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#1A1209' }}>{d.titulo}</span>
                      <span style={{ fontSize: '11px', color: '#999' }}>{d.template}</span>
                      <span style={{ fontSize: '11px', color: '#999' }}>{d.data}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#666', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.copy.substring(0, 120)}...
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Btn size="sm" variant="secondary" onClick={() => copyCopy(d.copy)}><Copy size={13} /> Copiar</Btn>
                    <button onClick={() => setDeleteId(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C62828' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Save Modal */}
      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} title="Salvar rascunho" width="380px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Título do rascunho" value={draftTitle} onChange={e => setDraftTitle(e.target.value)} placeholder="Ex: Rascunho gestão — CMV" required />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setShowSaveModal(false)}>Cancelar</Btn>
            <Btn onClick={saveDraft}><Save size={14} /> Salvar</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteDraft(deleteId); setDeleteId(null); }}
        title="Remover rascunho" message="Remover este rascunho definitivamente?" />
    </div>
  );
}
