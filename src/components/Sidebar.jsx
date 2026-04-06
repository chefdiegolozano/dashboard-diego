import { useState } from 'react';
import {
  LayoutDashboard, Calendar, BarChart3, Lightbulb, FileText,
  CheckSquare, Columns3, GitBranch, Zap, BookOpen, Settings,
  Menu, X, ChevronRight, LogOut,
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'operacional' },
  { id: 'calendario', label: 'Calendário', icon: Calendar, group: 'operacional' },
  { id: 'metricas', label: 'Métricas', icon: BarChart3, group: 'operacional' },
  { id: 'pautas', label: 'Pautas', icon: Lightbulb, group: 'operacional' },
  { id: 'templates', label: 'Templates', icon: FileText, group: 'operacional' },
  { id: 'checklist', label: 'Checklist', icon: CheckSquare, group: 'operacional' },
  { id: 'kanban', label: 'Kanban', icon: Columns3, group: 'operacional' },
  { id: 'workflow', label: 'Workflow', icon: GitBranch, group: 'referencia' },
  { id: 'automacao', label: 'Automação', icon: Zap, group: 'referencia' },
  { id: 'regras', label: 'Regras', icon: BookOpen, group: 'referencia' },
  { id: 'config', label: 'Config', icon: Settings, group: 'referencia' },
];

export function Sidebar({ active, onNavigate, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(184,134,11,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: '#B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '18px', color: '#1A1209',
          }}>DL</div>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#B8860B', fontSize: '14px', lineHeight: 1.2 }}>Diego Lozano</div>
            <div style={{ color: 'rgba(184,134,11,0.6)', fontSize: '11px' }}>Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {/* Operacional */}
        <div style={{ padding: '4px 20px 8px', color: 'rgba(184,134,11,0.5)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Operacional
        </div>
        {MENU_ITEMS.filter(m => m.group === 'operacional').map(item => (
          <NavItem key={item.id} item={item} active={active} onNavigate={(id) => { onNavigate(id); setMobileOpen(false); }} />
        ))}

        {/* Divisor */}
        <div style={{ margin: '12px 20px', borderTop: '1px solid rgba(184,134,11,0.15)' }} />

        {/* Referência */}
        <div style={{ padding: '4px 20px 8px', color: 'rgba(184,134,11,0.5)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Referência
        </div>
        {MENU_ITEMS.filter(m => m.group === 'referencia').map(item => (
          <NavItem key={item.id} item={item} active={active} onNavigate={(id) => { onNavigate(id); setMobileOpen(false); }} />
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(184,134,11,0.2)' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%', padding: '12px 20px', border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(245,237,224,0.4)',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '13px', fontWeight: 400, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(198,40,40,0.12)'; e.currentTarget.style.color = '#EF9A9A'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(245,237,224,0.4)'; }}
        >
          <LogOut size={15} />
          Sair
        </button>
        <div style={{ padding: '8px 20px 14px', fontSize: '11px', color: 'rgba(184,134,11,0.3)' }}>
          v1.0 — Sistema de Conteúdo
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed', top: '16px', left: '16px', zIndex: 200,
          background: '#1A1209', border: 'none', borderRadius: '8px',
          padding: '10px', cursor: 'pointer', color: '#B8860B',
        }}
        className="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside style={{
        width: '220px', minWidth: '220px', height: '100vh',
        background: '#1A1209', position: 'sticky', top: 0,
        overflowY: 'auto',
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.6)',
        }} onClick={() => setMobileOpen(false)}>
          <aside style={{
            width: '240px', height: '100vh', background: '#1A1209',
            position: 'relative',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', color: '#B8860B', cursor: 'pointer',
            }}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function NavItem({ item, active, onNavigate }) {
  const Icon = item.icon;
  const isActive = active === item.id;
  return (
    <button
      onClick={() => onNavigate(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '9px 20px', border: 'none', cursor: 'pointer',
        background: isActive ? 'rgba(184,134,11,0.15)' : 'transparent',
        color: isActive ? '#B8860B' : 'rgba(245,237,224,0.6)',
        fontSize: '13px', fontWeight: isActive ? 600 : 400,
        borderLeft: isActive ? '3px solid #B8860B' : '3px solid transparent',
        transition: 'all 0.15s', textAlign: 'left',
      }}
      onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(184,134,11,0.07)')}
      onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
    >
      <Icon size={16} />
      <span>{item.label}</span>
      {isActive && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
    </button>
  );
}
