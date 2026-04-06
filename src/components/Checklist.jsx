import { useState } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, SectionHeader, Btn } from './ui/Card';
import { showToast } from './ui/Toast';

const PERGUNTAS = [
  { id: 1, texto: 'Soa como o Diego falando pro amigo ou como lançamento digital?', orientacao: 'Deve soar como conversa entre amigos, não copy de lançamento.' },
  { id: 2, texto: 'Qualquer outro chef poderia ter postado isso? (Se sim, reescrever)', orientacao: 'O conteúdo precisa ser único e identificável com o Diego.' },
  { id: 3, texto: 'Tem vulnerabilidade com número, ano e contexto específico?', orientacao: '"Perdi R$500k em 2019 no Levena" > "Passei por dificuldades".' },
  { id: 4, texto: 'Tom de constatação ou de conselho?', orientacao: 'Constatação: "Percebi que...". Conselho: "Você deveria..." — evitar.' },
  { id: 5, texto: 'Parece mais com Ovos Quadrados ou Aforismo Frio?', orientacao: 'Ovos Quadrados = conteúdo único e envolvente. Aforismo Frio = genérico.' },
  { id: 6, texto: 'O Master Context do PC seria violado?', orientacao: 'Verificar se não usa palavras ou formatos proibidos no contexto Pastry Club.' },
  { id: 7, texto: 'Usa palavras proibidas? (mentoria, curso, acompanhamento — contexto PC)', orientacao: 'No contexto Pastry Club essas palavras são proibidas. Verificar antes.' },
  { id: 8, texto: 'Tem gancho contraintuitivo na primeira frase?', orientacao: 'A primeira frase precisa parar o scroll. Deve ser surpreendente ou provocadora.' },
  { id: 9, texto: 'O CTA é conversacional (pergunta reflexiva) ou mecânico?', orientacao: 'CTA bom: "O que você faria no meu lugar?". Ruim: "Salva esse post!".' },
  { id: 10, texto: 'Responde: "Por que o Diego está falando isso HOJE?"', orientacao: 'Urgência e contexto temporal são fundamentais. O post precisa ter razão de existir hoje.' },
];

export function Checklist({ checklists, setChecklists }) {
  const [answers, setAnswers] = useState({});
  const [postRef, setPostRef] = useState('');
  const [saved, setSaved] = useState([]);

  const score = Object.values(answers).filter(Boolean).length;
  const total = PERGUNTAS.length;

  const toggle = (id) => setAnswers(prev => ({ ...prev, [id]: !prev[id] }));

  const reset = () => { setAnswers({}); setPostRef(''); showToast('Checklist resetado', 'info'); };

  const salvar = () => {
    if (!postRef) { showToast('Adicione uma referência do post', 'error'); return; }
    const entry = {
      id: Date.now(),
      postRef,
      score,
      total,
      answers: { ...answers },
      data: new Date().toISOString().split('T')[0],
    };
    setChecklists(prev => [entry, ...prev]);
    showToast(`Checklist salvo: ${score}/10`);
    reset();
  };

  const getScoreColor = (s) => {
    if (s >= 8) return '#2E7D32';
    if (s >= 5) return '#F57F17';
    return '#C62828';
  };

  const getScoreLabel = (s) => {
    if (s >= 8) return 'Pronto para publicar';
    if (s >= 5) return 'Revisar antes';
    return 'Precisa de revisão';
  };

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <SectionHeader title="Checklist Pré-Publicação" subtitle="10 perguntas para validar o conteúdo antes de postar" />
        <Btn variant="ghost" onClick={reset}><RotateCcw size={15} /> Resetar</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Questions */}
        <div>
          <div style={{ marginBottom: '12px' }}>
            <input
              value={postRef} onChange={e => setPostRef(e.target.value)}
              placeholder="Referência do post (ex: Reels Gestão — CMV, 06/04)"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PERGUNTAS.map((p, i) => (
              <Card key={p.id} style={{ padding: '14px 16px', border: answers[p.id] ? '1px solid #2E7D32' : '1px solid #F0E4D0', background: answers[p.id] ? '#E8F5E9' : '#fff', transition: 'all 0.15s' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', marginTop: '1px' }}>
                    <input
                      type="checkbox"
                      checked={!!answers[p.id]}
                      onChange={() => toggle(p.id)}
                      style={{ width: '18px', height: '18px', accentColor: '#B8860B', cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#B8860B', minWidth: '20px' }}>{i + 1}.</span>
                      <span style={{ fontSize: '14px', fontWeight: answers[p.id] ? 600 : 500, color: answers[p.id] ? '#2E7D32' : '#333', lineHeight: 1.4 }}>
                        {p.texto}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0 20px', fontStyle: 'italic', lineHeight: 1.4 }}>{p.orientacao}</p>
                  </div>
                </label>
              </Card>
            ))}
          </div>
        </div>

        {/* Score panel */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <Card style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia,serif', color: '#666', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Score
            </div>

            {/* Big score */}
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              border: `6px solid ${getScoreColor(score)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', background: getScoreColor(score) + '12',
            }}>
              <span style={{ fontSize: '36px', fontWeight: 700, color: getScoreColor(score), fontVariantNumeric: 'tabular-nums' }}>
                {score}/{total}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              {score >= 8 ? <CheckCircle size={16} color="#2E7D32" /> : <AlertTriangle size={16} color={getScoreColor(score)} />}
              <span style={{ fontWeight: 700, fontSize: '13px', color: getScoreColor(score) }}>{getScoreLabel(score)}</span>
            </div>

            {score < 7 && (
              <div style={{ background: '#FFEBEE', border: '1px solid #C62828', borderRadius: '6px', padding: '10px', marginBottom: '12px', fontSize: '12px', color: '#C62828', fontWeight: 600 }}>
                Revise antes de publicar
              </div>
            )}

            {/* Progress bar */}
            <div style={{ background: '#F0E4D0', borderRadius: '4px', height: '8px', marginBottom: '16px', overflow: 'hidden' }}>
              <div style={{
                width: `${(score / total) * 100}%`, height: '100%',
                background: getScoreColor(score), borderRadius: '4px', transition: 'width 0.3s',
              }} />
            </div>

            <Btn style={{ width: '100%', justifyContent: 'center' }} onClick={salvar}>
              Salvar checklist
            </Btn>
          </Card>

          {/* Histórico */}
          {checklists.length > 0 && (
            <Card style={{ padding: '16px', marginTop: '12px' }}>
              <h4 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', margin: '0 0 12px', fontSize: '14px' }}>
                Histórico ({checklists.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {checklists.slice(0, 10).map(c => (
                  <div key={c.id} style={{ padding: '8px', background: '#F5EDE0', borderRadius: '6px', fontSize: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#333', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.postRef}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: getScoreColor(c.score), fontWeight: 700 }}>{c.score}/{c.total}</span>
                      <span style={{ color: '#999' }}>{c.data}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
