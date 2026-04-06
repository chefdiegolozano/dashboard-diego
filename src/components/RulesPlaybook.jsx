import { useState } from 'react';
import { Star, TrendingUp, AlertTriangle, Gem, Clock, Heart, MessageSquare, Wrench, BarChart2, User, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Card, SectionHeader } from './ui/Card';
import { REGRAS, TOM_PODE, TOM_NAO_PODE, PALAVRAS_PROIBIDAS, PLAYBOOKS } from '../data/rules';

const ICON_MAP = { Star, TrendingUp, AlertTriangle, Gem, Clock, Heart, MessageSquare, Tool: Wrench, BarChart2, User };
const TABS = ['10 Regras', 'Tom de Voz', 'Playbook de Stories'];

export function RulesPlaybook() {
  const [tab, setTab] = useState(0);
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <SectionHeader title="Regras & Playbook" subtitle="Referência permanente de estratégia de conteúdo" />

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {REGRAS.map(regra => {
            const Icon = ICON_MAP[regra.icone] || Star;
            const isExpanded = expanded === regra.id;
            return (
              <Card key={regra.id} style={{ padding: '16px', cursor: 'pointer', transition: 'all 0.15s', border: isExpanded ? '1px solid #B8860B' : '1px solid #F0E4D0' }}
                onClick={() => setExpanded(isExpanded ? null : regra.id)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ background: '#1A1209', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
                    <Icon size={16} color="#B8860B" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#B8860B' }}>Regra #{regra.numero}</span>
                        <h4 style={{ fontFamily: 'Georgia,serif', fontWeight: 700, color: '#1A1209', fontSize: '14px', margin: '2px 0 0' }}>
                          {regra.titulo}
                        </h4>
                      </div>
                      {isExpanded ? <ChevronUp size={14} color="#999" /> : <ChevronDown size={14} color="#999" />}
                    </div>
                    {isExpanded && (
                      <p style={{ fontSize: '13px', color: '#333', margin: '8px 0 0', lineHeight: 1.6 }} className="animate-fade-in">
                        {regra.descricao}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* PODE */}
          <Card style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', color: '#2E7D32', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={18} color="#2E7D32" /> PODE
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {TOM_PODE.map((item, i) => (
                <div key={i} style={{ padding: '12px 14px', background: '#E8F5E9', borderRadius: '6px', borderLeft: '3px solid #2E7D32', fontSize: '13px', color: '#333', lineHeight: 1.5 }}>
                  {item.texto}
                </div>
              ))}
            </div>
          </Card>

          {/* NÃO PODE */}
          <Card style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', color: '#C62828', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <X size={18} color="#C62828" /> NÃO PODE
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {TOM_NAO_PODE.map((item, i) => (
                <div key={i} style={{ padding: '12px 14px', background: '#FFEBEE', borderRadius: '6px', borderLeft: '3px solid #C62828', fontSize: '13px', color: '#333', lineHeight: 1.5 }}>
                  {item.texto}
                </div>
              ))}
            </div>
          </Card>

          {/* Palavras proibidas */}
          <Card style={{ padding: '24px', gridColumn: '1/-1' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', color: '#C62828', margin: '0 0 12px', fontSize: '15px' }}>
              Palavras proibidas (contexto Pastry Club)
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PALAVRAS_PROIBIDAS.map(w => (
                <span key={w} style={{
                  padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
                  background: '#FFEBEE', color: '#C62828', border: '1px solid #C62828',
                }}>
                  {w}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {PLAYBOOKS.map(pb => (
            <Card key={pb.id} style={{ padding: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 16px', fontSize: '15px', borderBottom: '1px solid #F0E4D0', paddingBottom: '8px' }}>
                {pb.nome}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pb.stories.map(story => (
                  <div key={story.ordem} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: '#1A1209', color: '#B8860B',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, flexShrink: 0,
                    }}>
                      {story.ordem}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#B8860B', textTransform: 'uppercase' }}>{story.horario}</span>
                        <span style={{ fontSize: '11px', color: '#999' }}>• {story.tipo}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#333', lineHeight: 1.4 }}>{story.descricao}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>{story.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
