import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '../../context/AppContext';
import './MainLayout.css';

export function MainLayout() {
  const { state } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isCollapsed = state.sidebarCollapsed;

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className={`sidebar-overlay ${mobileMenuOpen ? 'visible' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`main-area ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
