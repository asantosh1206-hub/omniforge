import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { MainLayout } from './components/layout/MainLayout';
import DashboardPage from './components/dashboard/DashboardPage';
import IngestPage from './components/ingest/IngestPage';
import TransformPage from './components/transform/TransformPage';
import OutputPage from './components/output/OutputPage';
import SettingsPage from './components/settings/SettingsPage';
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/ingest" element={<IngestPage />} />
                <Route path="/transform" element={<TransformPage />} />
                <Route path="/output" element={<OutputPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
