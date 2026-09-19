import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Zap, 
  FileOutput, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import './Sidebar.css';

const navItems = [
  { path: '/', labelKey: 'dashboard', icon: LayoutDashboard },
  { path: '/ingest', labelKey: 'ingest', icon: Upload },
  { path: '/transform', labelKey: 'transform', icon: Zap },
  { path: '/output', labelKey: 'output', icon: FileOutput },
];

export function Sidebar({ mobileOpen, onClose }) {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const isCollapsed = state.sidebarCollapsed;
  const { t } = useLanguage();

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <Shield className="logo-icon" size={28} />
          {!isCollapsed && <span className="logo-text">OmniForge</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
              data-tooltip={t(item.labelKey)}
              onClick={handleNavClick}
            >
              <div className="nav-icon">
                <Icon size={20} />
              </div>
              <span className="nav-label">{t(item.labelKey)}</span>
            </Link>
          );
        })}

        <div className="sidebar-divider" />

        <Link 
          to="/settings" 
          className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
          data-tooltip={t('settings')}
          onClick={handleNavClick}
        >
          <div className="nav-icon">
            <Settings size={20} />
          </div>
          <span className="nav-label">{t('settings')}</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && <div className="version-text">OmniForge v1.0</div>}
      </div>

      <div className="sidebar-toggle">
        <button onClick={toggleSidebar} className="toggle-btn" aria-label="Toggle Sidebar">
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
