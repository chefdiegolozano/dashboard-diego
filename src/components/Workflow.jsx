import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Card, SectionHeader, Btn } from './ui/Card';
import { showToast } from './ui/Toast';
import { FLUXO_SEMANAL, BATCH_SCHEDULE, REGRAS_BATCH, FERRAMENTAS, BRIEFING_TEMPLATE } from '../data/workflowData';

const TABS = ['Fluxo Semanal', 'Batch'];

export function Workflow() {
  const [tab, setTab] = useState(0);

  const copyBriefing = () => {
    navigator.clipboard.writeText(BRIEFING_TEMPLATE).then(() => showToast('Briefing copiado para o clipboard'));
  };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Workflow & Batch" subtitle="Referência de operação semanal" />

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
          <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '16px' }}>Fluxo Semanal</h3>
          <Card>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#1A1209' }}>
                    {['DIA', 'DIEGO', 'EDITOR', 'CLAUDE'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#B8860B', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FLUXO_SEMANAL.map((row, i) => (
                    <tr key={i} className="zebra-row" style={{ borderBottom: '1px solid #F0E4D0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#B8860B', whiteSpace: 'nowrap' }}>{row.dia}</td>
                      <td style={{ padding: '12px 16px', color: '#333', lineHeight: 1.5 }}>{row.diego}</td>
                      <td style={{ padding: '12px 16px', color: row.editor === '—' ? '#ccc' : '#333', lineHeight: 1.5 }}>{row.editor}</td>
                      <td style={{ padding: '12px 16px', color: row.claude === '—' ? '#ccc' : '#333', lineHeight: 1.5 }}>{row.claude}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '16px' }}>Cronograma do Dia de Gravação</h3>
            <Card>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#1A1209' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', color: '#B8860B', fontWeight: 700, width: '120px' }}>BLOCO</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', color: '#B8860B', fontWeight: 700 }}>O QUE GRAVAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BATCH_SCHEDULE.map((row, i) => (
                      <tr key={i} className="zebra-row" style={{ borderBottom: '1px solid #F0E4D0' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#B8860B', whiteSpace: 'nowrap' }}>{row.bloco}</td>
                        <td style={{ padding: '12px 16px', color: '#333', lineHeight: 1.5 }}>{row.atividade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div>
            <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 12px', fontSize: '16px' }}>Regras de Batch</h3>
            <Card style={{ padding: '20px' }}>
              <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REGRAS_BATCH.map((r, i) => (
                  <li key={i} style={{ fontSize: '14px', color: '#333', lineHeight: 1.5 }}>
                    <strong style={{ color: '#B8860B' }}>•</strong> {r}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div>
            <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 12px', fontSize: '16px' }}>Briefing para o Editor</h3>
            <Card style={{ padding: '20px' }}>
              <pre style={{
                background: '#F5EDE0', borderRadius: '8px', padding: '16px',
                fontSize: '13px', lineHeight: 1.7, color: '#333',
                whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '0 0 12px',
              }}>
                {BRIEFING_TEMPLATE}
              </pre>
              <Btn onClick={copyBriefing} variant="secondary"><Copy size={14} /> Copiar briefing</Btn>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
