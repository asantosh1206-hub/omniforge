import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Wifi, WifiOff, Bell, Search, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

export function Header({ onMobileMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { state } = useApp();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  // Derive title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path === '/ingest') return 'ingest';
    if (path === '/transform') return 'transform';
    if (path === '/output') return 'output';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  };



  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMobileMenuToggle} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <h1 className="header-title">{t(getPageTitle())}</h1>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder={t('searchPlaceholder')} aria-label="Search" />
        </div>

        <div className="system-indicator">
          <div className={`status-dot ${state.systemStatus?.grok?.connected ? 'connected' : 'disconnected'}`} />
          <span>Grok Cloud</span>
          {state.systemStatus?.grok?.connected ? <Wifi size={14} /> : <WifiOff size={14} />}
        </div>

        <div className="system-indicator">
          <div className={`status-dot ${state.systemStatus?.nvidia?.connected ? 'connected' : 'disconnected'}`} />
          <span>NVIDIA</span>
          {state.systemStatus?.nvidia?.connected ? <Wifi size={14} /> : <WifiOff size={14} />}
        </div>

        <button className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="lang-toggle" style={{ padding: '0 8px' }}>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ 
              background: 'transparent', 
              color: 'var(--text-primary)', 
              border: 'none', 
              outline: 'none', 
              cursor: 'pointer', 
              fontWeight: 600, 
              fontSize: '0.8125rem',
              padding: '4px'
            }}
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="bn">BN</option>
            <option value="mr">MR</option>
            <option value="te">TE</option>
            <option value="ta">TA</option>
            <option value="gu">GU</option>
            <option value="ur">UR</option>
            <option value="kn">KN</option>
            <option value="or">OR</option>
          </select>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="user-avatar" title="Santosh Kumar">
          AK
        </div>
      </div>
    </header>
  );
}
