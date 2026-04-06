import { useState } from 'react';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { Card, SectionHeader, Btn } from './ui/Card';
import { ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';

export function Settings({ posts, pautas, calendarData, storiesData, drafts, checklists, kanban, triggers, onImport, onReset }) {
  const [showReset, setShowReset] = useState(false);
  const [showReset2, setShowReset2] = useState(false);

  const exportData = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      posts,
      pautas,
      calendarData,
      storiesData,
      drafts,
      checklists,
      kanban,
      triggers,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-diego-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dados exportados com sucesso');
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        onImport(data);
        showToast('Dados importados com sucesso');
      } catch {
        showToast('Arquivo inválido', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const countItems = () => ({
    posts: posts.length,
    pautas: pautas.length,
    drafts: drafts.length,
    checklists: checklists.length,
    triggers: triggers.length,
    kanbanCards: Object.values(kanban).reduce((a, col) => a + (col?.length || 0), 0),
  });

  const counts = countItems();

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Configurações" subtitle="Gerenciar dados, exportar e importar" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Export */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 12px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Exportar dados
          </h3>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: '0 0 16px' }}>
            Exporta todos os dados do dashboard em formato JSON. Use para backup ou para transferir para outro dispositivo.
          </p>
          <div style={{ background: '#F5EDE0', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#333', margin: '0 0 6px' }}>Dados atuais:</p>
            {Object.entries(counts).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', padding: '2px 0' }}>
                <span style={{ textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{v}</span>
              </div>
            ))}
          </div>
          <Btn onClick={exportData}><Download size={15} /> Exportar JSON</Btn>
        </Card>

        {/* Import */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 12px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={18} /> Importar dados
          </h3>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: '0 0 16px' }}>
            Importa dados de um arquivo JSON exportado anteriormente. Os dados atuais serão substituídos.
          </p>
          <div style={{ background: '#FFF8E1', border: '1px solid #F57F17', borderRadius: '6px', padding: '10px', marginBottom: '16px', fontSize: '12px', color: '#F57F17', fontWeight: 600 }}>
            Atenção: a importação substitui todos os dados atuais.
          </div>
          <label style={{ cursor: 'pointer' }}>
            <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 600,
              background: 'transparent', border: '1px solid #B8860B', color: '#B8860B',
              cursor: 'pointer',
            }}>
              <Upload size={15} /> Importar JSON
            </span>
          </label>
        </Card>

        {/* Reset */}
        <Card style={{ padding: '24px', border: '1px solid #FFCDD2' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#C62828', margin: '0 0 12px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={18} /> Resetar dados
          </h3>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: '0 0 16px' }}>
            Remove todos os dados do dashboard e restaura os dados iniciais (pautas pré-carregadas, triggers ManyChat). Esta ação não pode ser desfeita.
          </p>
          <Btn variant="danger" onClick={() => setShowReset(true)}><Trash2 size={15} /> Resetar tudo</Btn>
        </Card>

        {/* About */}
        <Card style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 12px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} /> Sobre o sistema
          </h3>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F0E4D0' }}>
              <span>Versão</span><span style={{ fontWeight: 600, color: '#333' }}>1.0.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F0E4D0' }}>
              <span>Sistema</span><span style={{ fontWeight: 600, color: '#333' }}>Dashboard de Conteúdo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F0E4D0' }}>
              <span>Persistência</span><span style={{ fontWeight: 600, color: '#333' }}>localStorage</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #F0E4D0' }}>
              <span>Stack</span><span style={{ fontWeight: 600, color: '#333' }}>React + Recharts + Tailwind</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span>Marcas</span><span style={{ fontWeight: 600, color: '#333' }}>Levena · ECDL · Pastry Club</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirm reset step 1 */}
      <ConfirmModal
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={() => { setShowReset(false); setShowReset2(true); }}
        title="Resetar dados"
        message="Esta ação irá apagar TODOS os seus posts, pautas adicionadas, calendário, kanban e rascunhos. Você tem certeza?"
      />

      {/* Confirm reset step 2 */}
      <ConfirmModal
        isOpen={showReset2}
        onClose={() => setShowReset2(false)}
        onConfirm={() => { onReset(); setShowReset2(false); showToast('Dados resetados', 'info'); }}
        title="Confirmação final"
        message="ÚLTIMA CHANCE: todos os dados serão apagados permanentemente. Exportou o backup? Confirmar reset?"
      />
    </div>
  );
}
