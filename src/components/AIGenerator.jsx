import { useState } from 'react';
import { Sparkles, RotateCcw, Copy, Check, AlertCircle, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { Btn, Select } from './ui/Card';
import { useClaudeAPI } from '../hooks/useClaudeAPI';
import { buildUserPrompt, buildCorrectionPrompt } from '../data/aiPrompt';
import { showToast } from './ui/Toast';

const PILARES = ['Gestão', 'Técnica', 'Pessoal', 'Levena', 'ECDL'];
const FORMATOS = ['Reels', 'Carrossel', 'Post foto'];
const MARCAS = ['Diego pessoal', 'Levena', 'ECDL', 'Pastry Club'];

// Suggestions per pilar to help Diego write the descricao
const SUGESTOES = {
  Gestão: 'Ex: "descobri que 3 produtos do cardápio davam prejuízo. Levou 8 meses para perceber."',
  Técnica: 'Ex: "por que o macaron racha — não é o forno, é a merengue italiana mal feita"',
  Pessoal: 'Ex: "primeiro sábado sem trabalhar. Fui ao mercado com a Laura e percebi que não sabia o que fazer com o tempo"',
  Levena: 'Ex: "a escadaria do Levena — as pedras vieram de Portugal, cada uma escolhida manualmente"',
  ECDL: 'Ex: "turma do Master Confeiteiro em março — aluno que chegou fazendo croissant de borracha e saiu com laminação perfeita"',
};

export function AIGenerator({ apiKey, posts, onApply, defaultPilar = 'Gestão', defaultFormato = 'Reels', defaultMarca = 'Diego pessoal' }) {
  const [open, setOpen] = useState(false);
  const [pilar, setPilar] = useState(defaultPilar);
  const [formato, setFormato] = useState(defaultFormato);
  const [marca, setMarca] = useState(defaultMarca);
  const [descricao, setDescricao] = useState('');
  const [correcao, setCorrecao] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  const { generate, correct, reset, loading, error, streamText, hasHistory } = useClaudeAPI(apiKey, posts);

  const currentText = loading ? streamText : result;

  const handleGenerate = async () => {
    if (!descricao.trim()) { showToast('Descreva o que Diego quer contar', 'error'); return; }
    reset();
    setResult('');
    setShowCorrection(false);
    setCorrecao('');
    const prompt = buildUserPrompt({ pilar, formato, marca, descricao });
    const text = await generate(prompt);
    if (text) setResult(text);
  };

  const handleCorrect = async () => {
    if (!correcao.trim()) { showToast('Descreva o que ajustar', 'error'); return; }
    const prompt = buildCorrectionPrompt(correcao);
    const text = await correct(prompt);
    if (text) { setResult(text); setCorrecao(''); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      showToast('Copy copiada');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleApply = () => {
    if (onApply) onApply(result, { pilar, formato, marca });
    showToast('Copy aplicada ao formulário');
  };

  const handleReset = () => {
    reset();
    setResult('');
    setDescricao('');
    setCorrecao('');
    setShowCorrection(false);
  };

  if (!apiKey) {
    return (
      <div style={{
        background: '#FFF8E7', border: '1px solid #B8860B', borderRadius: '8px',
        padding: '12px 16px', fontSize: '13px', color: '#B8860B', display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Sparkles size={15} />
        <span>Configure sua chave de API em <strong>Config → IA</strong> para gerar copies com Claude.</span>
      </div>
    );
  }

  return (
    <div style={{
      border: open ? '2px solid #B8860B' : '1px dashed #B8860B',
      borderRadius: '10px', overflow: 'hidden',
      background: open ? '#FFFDF7' : 'transparent',
      transition: 'all 0.2s',
    }}>
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
          background: open ? '#1A1209' : 'transparent', border: 'none', cursor: 'pointer',
          color: open ? '#B8860B' : '#B8860B',
        }}
      >
        <Sparkles size={16} />
        <span style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'Georgia,serif' }}>
          Gerar copy com IA
        </span>
        <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '4px' }}>
          {hasHistory && !loading ? '· copy gerada' : '· Claude Opus'}
        </span>
        <span style={{ marginLeft: 'auto' }}>{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
      </button>

      {open && (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">

          {/* Context fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Pilar</label>
              <select value={pilar} onChange={e => setPilar(e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontFamily: 'inherit', background: '#fff' }}>
                {PILARES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Formato</label>
              <select value={formato} onChange={e => setFormato(e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontFamily: 'inherit', background: '#fff' }}>
                {FORMATOS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Marca</label>
              <select value={marca} onChange={e => setMarca(e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontFamily: 'inherit', background: '#fff' }}>
                {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Descricao */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#B8860B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              O que Diego quer contar? *
            </label>
            <p style={{ fontSize: '11px', color: '#999', margin: '0 0 6px', fontStyle: 'italic' }}>
              {SUGESTOES[pilar]}
            </p>
            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descreva em texto livre — o episódio, a descoberta, a história. Quanto mais específico, melhor a copy."
              rows={4}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '6px',
                border: '1px solid #ddd', fontSize: '13px', resize: 'vertical',
                fontFamily: 'inherit', lineHeight: 1.6, color: '#333',
              }}
            />
          </div>

          <Btn onClick={handleGenerate} disabled={loading || !descricao.trim()} style={{ alignSelf: 'flex-start' }}>
            {loading
              ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Gerando...</>
              : <><Sparkles size={14} /> {hasHistory ? 'Gerar nova versão' : 'Gerar copy'}</>
            }
          </Btn>

          {/* Error */}
          {error && (
            <div style={{ background: '#FFEBEE', border: '1px solid #C62828', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', color: '#C62828', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              {error}
            </div>
          )}

          {/* Result */}
          {(loading || result) && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {loading ? 'Gerando...' : 'Copy gerada'}
                </label>
                {result && !loading && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleReset} title="Recomeçar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '2px 4px', fontSize: '11px' }}>
                      <RotateCcw size={13} />
                    </button>
                    <button onClick={handleCopy} style={{
                      display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px',
                      borderRadius: '4px', border: '1px solid #ddd', background: copied ? '#E8F5E9' : '#fff',
                      cursor: 'pointer', fontSize: '11px', color: copied ? '#2E7D32' : '#333', fontWeight: 600,
                    }}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                )}
              </div>
              <div style={{
                background: '#fff', border: '1px solid #E8F5E9', borderRadius: '8px',
                padding: '14px 16px', fontSize: '13px', lineHeight: 1.8, color: '#1A1209',
                whiteSpace: 'pre-wrap', fontFamily: 'inherit', minHeight: '80px',
                borderLeft: '3px solid #2E7D32',
              }}>
                {currentText || <span style={{ color: '#ccc' }}>●●●</span>}
              </div>
            </div>
          )}

          {/* Actions after generation */}
          {result && !loading && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              {/* Apply button */}
              {onApply && (
                <Btn onClick={handleApply} variant="dark" style={{ alignSelf: 'flex-start' }}>
                  <Check size={14} /> Aplicar ao formulário
                </Btn>
              )}

              {/* Correction section */}
              <div style={{ borderTop: '1px solid #F0E4D0', paddingTop: '10px' }}>
                <button
                  onClick={() => setShowCorrection(s => !s)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B8860B', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
                >
                  {showCorrection ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  Precisa ajustar algo?
                </button>

                {showCorrection && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }} className="animate-fade-in">
                    <p style={{ fontSize: '11px', color: '#999', margin: 0, fontStyle: 'italic' }}>
                      Ex: "gancho mais agressivo" · "mais curto" · "tirar a parte do CMV" · "tom mais pessoal"
                    </p>
                    <textarea
                      value={correcao}
                      onChange={e => setCorrecao(e.target.value)}
                      placeholder="O que ajustar na copy?"
                      rows={2}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit' }}
                      onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleCorrect(); }}
                    />
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Btn onClick={handleCorrect} disabled={loading || !correcao.trim()} size="sm">
                        {loading ? <><Loader size={12} /> Ajustando...</> : <><Sparkles size={12} /> Ajustar copy</>}
                      </Btn>
                      <span style={{ fontSize: '11px', color: '#999' }}>ou ⌘+Enter</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
