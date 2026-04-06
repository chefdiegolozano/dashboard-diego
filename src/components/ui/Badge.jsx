import { classificarCor } from '../../utils/calculations';

const PILAR_COLORS = {
  Gestão: { bg: '#FFF3E0', text: '#E65100', border: '#E65100' },
  Técnica: { bg: '#F3E5F5', text: '#6A1B9A', border: '#6A1B9A' },
  Pessoal: { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' },
  Levena: { bg: '#FFF8E7', text: '#B8860B', border: '#B8860B' },
  ECDL: { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' },
  Livre: { bg: '#F5F5F5', text: '#666', border: '#999' },
};

export function Badge({ tipo, valor, size = 'sm' }) {
  const pad = size === 'sm' ? '2px 8px' : '4px 12px';
  const fs = size === 'sm' ? '11px' : '13px';

  if (tipo === 'pilar') {
    const c = PILAR_COLORS[valor] || PILAR_COLORS.Livre;
    return (
      <span style={{
        display: 'inline-block', padding: pad, borderRadius: '4px',
        fontSize: fs, fontWeight: 600,
        background: c.bg, color: c.text, border: `1px solid ${c.border}`,
        whiteSpace: 'nowrap',
      }}>{valor}</span>
    );
  }

  if (tipo === 'classificacao') {
    const c = classificarCor(valor);
    return (
      <span style={{
        display: 'inline-block', padding: pad, borderRadius: '4px',
        fontSize: fs, fontWeight: 700,
        background: c.bg, color: c.text, border: `1px solid ${c.border}`,
        whiteSpace: 'nowrap',
      }}>{valor}</span>
    );
  }

  return (
    <span style={{
      display: 'inline-block', padding: pad, borderRadius: '4px',
      fontSize: fs, fontWeight: 600,
      background: '#F5EDE0', color: '#B8860B', border: '1px solid #B8860B',
      whiteSpace: 'nowrap',
    }}>{valor}</span>
  );
}
