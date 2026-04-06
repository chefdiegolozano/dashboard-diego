import { useState } from 'react';
import { Download, Upload, Trash2, Info, Sparkles, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Card, SectionHeader, Btn } from './ui/Card';
import { ConfirmModal } from './ui/Modal';
import { showToast } from './ui/Toast';

const SEC_API = import.meta.env.VITE_SEC_API_URL || 'https://secretaria.diegolozano.com.br';

export function Settings({ posts, pautas, calendarData, storiesData, drafts, checklists, kanban, triggers, onImport, onReset, apiKey, setApiKey, setPosts }) {
  const [showReset, setShowReset] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncDays, setSyncDays] = useState(90);
  const [showReset2, setShowReset2] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);

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

  const saveKey = () => {
    setApiKey(keyInput.trim());
    showToast(keyInput.trim() ? 'Chave de API salva' : 'Chave removida', keyInput.trim() ? 'success' : 'info');
  };

  const syncInstagram = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${SEC_API}/sec/instagram/dashboard?days=${syncDays}&limit=500`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erro desconhecido');

      // Merge: keep manual posts, add/update posts from API by id
      const apiIds = new Set(data.posts.map(p => String(p.id)));
      const manualPosts = posts.filter(p => !apiIds.has(String(p.id)) && p.fonte !== 'instagram_api');
      const merged = [...data.posts, ...manualPosts];
      setPosts(merged);

      showToast(`${data.posts.length} posts sincronizados (${syncDays} dias) · ${data.profile?.followers?.toLocaleString('pt-BR') || '—'} seguidores`);
    } catch (err) {
      showToast(`Erro ao sincronizar: ${err.message}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Configurações" subtitle="Gerenciar dados, exportar e importar" />

      {/* API Key Card — destaque no topo */}
      <Card style={{ padding: '24px', marginBottom: '20px', border: '2px solid #B8860B' }}>
        <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 8px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} /> IA — Chave de API Anthropic
        </h3>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: '0 0 16px' }}>
          Necessária para gerar copies com Claude diretamente do dashboard. Obtenha em <strong>console.anthropic.com/keys</strong>. A chave fica salva só no seu navegador.
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Chave API
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="sk-ant-api03-..."
                onKeyDown={e => e.key === 'Enter' && saveKey()}
                style={{ width: '100%', padding: '9px 40px 9px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontFamily: 'monospace', background: '#fff', boxSizing: 'border-box' }}
              />
              <button onClick={() => setShowKey(s => !s)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <Btn onClick={saveKey}>Salvar chave</Btn>
        </div>
        {apiKey && (
          <p style={{ fontSize: '12px', color: '#2E7D32', margin: '8px 0 0', fontWeight: 600 }}>
            Chave configurada — geração de copy ativa
          </p>
        )}
      </Card>

      {/* Instagram Sync Card */}
      <Card style={{ padding: '24px', marginBottom: '20px', border: '1px solid #E1BEE7', background: '#FAF5FF' }}>
        <h3 style={{ fontFamily: 'Georgia,serif', color: '#6A1B9A', margin: '0 0 8px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={18} /> Sincronizar com Instagram
        </h3>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: '0 0 16px' }}>
          Importa automaticamente todos os posts coletados pela secretaria — <strong>{posts.filter(p => p.fonte === 'instagram_api').length} posts do Instagram</strong> no dashboard atualmente.
          Roda diariamente via cron, mas você pode forçar uma atualização manual aqui.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>Últimos</label>
            <select value={syncDays} onChange={e => setSyncDays(Number(e.target.value))}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', cursor: 'pointer' }}>
              <option value={30}>30 dias</option>
              <option value={90}>90 dias</option>
              <option value={180}>180 dias</option>
              <option value={365}>1 ano</option>
              <option value={9999}>Todos (desde 2021)</option>
            </select>
          </div>
          <Btn onClick={syncInstagram} disabled={syncing} style={{ background: '#6A1B9A', color: '#fff', border: 'none' }}>
            {syncing
              ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Sincronizando...</>
              : <><RefreshCw size={14} /> Sincronizar agora</>
            }
          </Btn>
        </div>
        <p style={{ fontSize: '11px', color: '#999', margin: '10px 0 0' }}>
          API: {SEC_API} · Coleta diária automática às 08h (briefing) e 09h (suggest)
        </p>
      </Card>

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
