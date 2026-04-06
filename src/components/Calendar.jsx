import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card, SectionHeader, Btn, Input } from './ui/Card';
import { Badge } from './ui/Badge';
import { showToast } from './ui/Toast';
import { CALENDAR_DEFAULT_WEEK, STORY_SLOTS } from '../data/calendarDefaults';

function getWeekDates(weekOffset = 0) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff + weekOffset * 7);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatWeekLabel(days) {
  const start = days[0];
  const end = days[6];
  const opts = { day: '2-digit', month: 'short' };
  return `${start.toLocaleDateString('pt-BR', opts)} — ${end.toLocaleDateString('pt-BR', opts)}`;
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

const STATUS_OPTS = ['Pauta', 'Gravado', 'Editando', 'Pronto', 'Publicado'];

const STATUS_COLORS = {
  Pauta: '#F5EDE0',
  Gravado: '#E3F2FD',
  Editando: '#FFF8E1',
  Pronto: '#E8F5E9',
  Publicado: '#FFF8E7',
};

export function Calendar({ calendarData, setCalendarData, storiesData, setStoriesData }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [expandedDay, setExpandedDay] = useState(null);
  const weekDays = getWeekDates(weekOffset);

  const getKey = (date) => formatDate(date);

  const getDayData = (date) => {
    const key = getKey(date);
    const def = CALENDAR_DEFAULT_WEEK[weekDays.indexOf(date)] || {};
    return calendarData[key] || {
      pilar: def.pilar || 'Livre',
      formato: def.formato || 'Reels',
      marca: def.marca || 'Diego',
      horario: def.horario || '19h',
      status: 'Pauta',
      pauta: '',
      copy: '',
      linkBruto: '',
      notas: '',
      publicado: false,
    };
  };

  const updateDay = (date, updates) => {
    const key = getKey(date);
    setCalendarData(prev => ({
      ...prev,
      [key]: { ...getDayData(date), ...updates },
    }));
    showToast('Salvo automaticamente', 'info');
  };

  const getStoryData = (date, slot) => {
    const key = `${getKey(date)}_${slot}`;
    return storiesData[key] || { texto: '', publicado: false };
  };

  const updateStory = (date, slot, updates) => {
    const key = `${getKey(date)}_${slot}`;
    setStoriesData(prev => ({ ...prev, [key]: { ...getStoryData(date, slot), ...updates } }));
  };

  const isToday = (date) => formatDate(date) === formatDate(new Date());
  const isCurrentWeek = weekOffset === 0;

  return (
    <div style={{ padding: '32px' }} className="animate-fade-in">
      {/* Header + navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <SectionHeader title="Calendário Semanal" subtitle={formatWeekLabel(weekDays)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Btn variant="secondary" size="sm" onClick={() => setWeekOffset(o => o - 1)}><ChevronLeft size={14} /></Btn>
          <Btn variant={isCurrentWeek ? 'primary' : 'ghost'} size="sm" onClick={() => setWeekOffset(0)}>Semana atual</Btn>
          <Btn variant="secondary" size="sm" onClick={() => setWeekOffset(o => o + 1)}><ChevronRight size={14} /></Btn>
        </div>
      </div>

      {/* Week grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '32px' }}>
        {weekDays.map((date, idx) => {
          const dayData = getDayData(date);
          const defDay = CALENDAR_DEFAULT_WEEK[idx];
          const isExpanded = expandedDay === getKey(date);

          return (
            <div key={idx}>
              <Card
                style={{
                  overflow: 'hidden',
                  border: isToday(date) ? '2px solid #B8860B' : '1px solid #F0E4D0',
                  cursor: 'pointer',
                }}
              >
                {/* Day header */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : getKey(date))}
                  style={{
                    padding: '10px 12px',
                    background: isToday(date) ? '#1A1209' : '#F5EDE0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: isToday(date) ? '#B8860B' : '#1A1209' }}>
                      {defDay?.dia || ['SEG','TER','QUA','QUI','SEX','SÁB','DOM'][idx]}
                    </span>
                    <span style={{ fontSize: '11px', color: isToday(date) ? '#B8860B80' : '#999' }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                  </div>
                  <Badge tipo="pilar" valor={dayData.pilar} size="sm" />
                  {dayData.publicado && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#2E7D32', fontSize: '11px' }}>
                      <Check size={10} /> Publicado
                    </div>
                  )}
                </div>

                {/* Quick info */}
                <div style={{ padding: '8px 12px', fontSize: '11px', color: '#666' }}>
                  <div>{dayData.formato} · {defDay?.horario || '19h'}</div>
                  <div style={{ marginTop: '2px', color: STATUS_COLORS[dayData.status] === STATUS_COLORS.Publicado ? '#2E7D32' : '#666', fontWeight: 600, fontSize: '10px' }}>
                    {dayData.status}
                  </div>
                </div>
              </Card>

              {/* Expanded card below */}
              {isExpanded && (
                <Card
                  style={{ marginTop: '4px', padding: '16px', border: '2px solid #B8860B', zIndex: 10 }}
                  className="animate-fade-in"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Input label="Pauta da semana" type="textarea" value={dayData.pauta} rows={2}
                      onChange={e => updateDay(date, { pauta: e.target.value })}
                      placeholder="Descreva a pauta..." />
                    <Input label="Copy" type="textarea" value={dayData.copy} rows={3}
                      onChange={e => updateDay(date, { copy: e.target.value })}
                      placeholder="Copy do post..." />
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Status</label>
                      <select value={dayData.status} onChange={e => updateDay(date, { status: e.target.value })}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', background: STATUS_COLORS[dayData.status] || '#fff', cursor: 'pointer' }}>
                        {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <Input label="Link bruto (Drive)" value={dayData.linkBruto}
                      onChange={e => updateDay(date, { linkBruto: e.target.value })}
                      placeholder="https://drive.google.com/..." />
                    <Input label="Notas" type="textarea" value={dayData.notas} rows={2}
                      onChange={e => updateDay(date, { notas: e.target.value })}
                      placeholder="Notas para o editor..." />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      <input type="checkbox" checked={dayData.publicado}
                        onChange={e => { updateDay(date, { publicado: e.target.checked, status: e.target.checked ? 'Publicado' : dayData.status }); }}
                        style={{ accentColor: '#B8860B' }} />
                      Marcar como publicado
                    </label>
                  </div>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      {/* Stories section */}
      <div>
        <h3 style={{ fontFamily: 'Georgia,serif', color: '#B8860B', fontWeight: 700, fontSize: '17px', margin: '0 0 16px' }}>
          Stories diários
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {weekDays.map((date, idx) => (
            <div key={idx}>
              <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#666', marginBottom: '6px', textTransform: 'uppercase' }}>
                {CALENDAR_DEFAULT_WEEK[idx]?.dia || ['SEG','TER','QUA','QUI','SEX','SÁB','DOM'][idx]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {STORY_SLOTS.map(slot => {
                  const data = getStoryData(date, slot.slot);
                  return (
                    <Card key={slot.slot} style={{ padding: '8px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#B8860B', marginBottom: '4px', textTransform: 'uppercase' }}>
                        {slot.slot}
                      </div>
                      <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>{slot.horario}</div>
                      <textarea
                        value={data.texto}
                        onChange={e => updateStory(date, slot.slot, { texto: e.target.value })}
                        placeholder="O que postar..."
                        rows={2}
                        style={{ width: '100%', fontSize: '11px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical', fontFamily: 'inherit' }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', cursor: 'pointer', marginTop: '4px' }}>
                        <input type="checkbox" checked={data.publicado}
                          onChange={e => updateStory(date, slot.slot, { publicado: e.target.checked })}
                          style={{ accentColor: '#B8860B' }} />
                        Publicado
                      </label>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
