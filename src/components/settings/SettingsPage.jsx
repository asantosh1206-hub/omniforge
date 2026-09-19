import React, { useState } from 'react';
// Note: useApp and these UI components might not exist exactly like this, 
// but using them as specified in the prompt.
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
// import Card from '../ui/Card';
// import ToggleSwitch from '../ui/ToggleSwitch';
import { 
  Cloud, Server, Cpu, Key, Eye, EyeOff, Shield, 
  Zap, Settings, Save, RotateCcw, Globe, Monitor, 
  ChevronDown, CheckCircle 
} from 'lucide-react';
import './SettingsPage.css';

// Fallback for ToggleSwitch if not available
const FallbackToggle = ({ checked, onChange }) => (
  <input 
    type="checkbox" 
    className="native-toggle"
    checked={checked} 
    onChange={(e) => onChange(e.target.checked)} 
  />
);

const SettingsPage = () => {
  const { state, dispatch } = useApp();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  // Section 1 State
  const [primaryProvider, setPrimaryProvider] = useState(state.apiConfig?.primaryProvider || 'grok');
  
  const [grokApiKey, setGrokApiKey] = useState(state.apiConfig?.grokApiKey || '');
  const [showGrokKey, setShowGrokKey] = useState(false);
  const [grokModel, setGrokModel] = useState(state.apiConfig?.grokModel || 'grok-3');
  
  const [nvApiKey, setNvApiKey] = useState(state.apiConfig?.nvidiaApiKey || '');
  const [showNvKey, setShowNvKey] = useState(false);
  const [nvModel, setNvModel] = useState(state.apiConfig?.nvidiaModel || 'llama-3.1-70b-instruct');

  // Section 2 State
  const [outputQuality, setOutputQuality] = useState('standard');
  const [autoGenerateOutputs, setAutoGenerateOutputs] = useState(true);
  const [includeMarkings, setIncludeMarkings] = useState(true);

  // Section 3 State
  const [themePreference, setThemePreference] = useState(theme === 'dark' ? t('dark') : t('light'));
  const [sidebarDefault, setSidebarDefault] = useState(state.sidebarCollapsed ? t('collapsed') : t('expanded'));
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);

  // Section 4 State
  const [classificationLevel, setClassificationLevel] = useState(t('restricted'));
  const [auditLogging, setAuditLogging] = useState(true);
  const [dataRetention, setDataRetention] = useState(t('thirtyDays'));

  // UI State
  const [toastStatus, setToastStatus] = useState(null); // 'showing', 'hiding', null

  const handleSave = () => {
    dispatch({
      type: 'SET_API_CONFIG',
      payload: {
        primaryProvider,
        grokApiKey,
        grokModel,
        nvidiaApiKey: nvApiKey,
        nvidiaModel: nvModel
      }
    });
    setToastStatus('showing');
    setTimeout(() => {
      setToastStatus('hiding');
      setTimeout(() => setToastStatus(null), 300);
    }, 2000);
  };

  const handleReset = () => {
    setPrimaryProvider('grok');
    setGrokModel('grok-3');
    setNvModel('llama-3.1-70b-instruct');
    setOutputQuality('standard');
    setLanguage('en');
    setAutoGenerateOutputs(true);
    setIncludeMarkings(true);
    setThemePreference(t('dark'));
    setTheme('dark');
    setSidebarDefault(t('expanded'));
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: false });
    setEnableNotifications(true);
    setAutoSaveDrafts(true);
    setClassificationLevel(t('restricted'));
    setAuditLogging(true);
    setDataRetention(t('thirtyDays'));
  };

  const clearCache = () => {
    if (window.confirm("Are you sure you want to clear all cached data? This cannot be undone.")) {
      // Mock clear cache
      console.log("Cache cleared");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>{t('systemConfiguration')}</h1>
        <p>{t('manageSettingsDesc')}</p>
      </div>

      <div className="settings-grid">
        
        {/* Section 1: LLM Provider Configuration */}
        <div className="settings-section">
          <div className="section-header">
            <Cpu className="section-icon" size={24} />
            <h3>{t('llmProviders')}</h3>
          </div>
          <div className="section-body">
            <div className="provider-cards">
              {/* Auto-Route Card */}
              <div 
                className={`provider-card ${primaryProvider === 'auto' ? 'active' : ''}`}
                onClick={() => setPrimaryProvider('auto')}
                style={{ position: 'relative' }}
              >
                {primaryProvider === 'auto' && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                )}
                {primaryProvider !== 'auto' && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-secondary)' }} />
                )}
                <div className="provider-header">
                  <div className="provider-info">
                    <div className="provider-icon">
                      <Zap size={24} />
                    </div>
                    <div className="provider-name-group">
                      <span className="provider-name">Auto-Route</span>
                      <span className="provider-desc">Uses fastest API</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grok Card */}
              <div 
                className={`provider-card ${primaryProvider === 'grok' ? 'active' : ''}`}
                onClick={() => setPrimaryProvider('grok')}
                style={{ position: 'relative' }}
              >
                {primaryProvider === 'grok' && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                )}
                {primaryProvider !== 'grok' && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-secondary)' }} />
                )}
                <div className="provider-header">
                  <div className="provider-info">
                    <div className="provider-icon">
                      <Cloud size={24} />
                    </div>
                    <div className="provider-name-group">
                      <span className="provider-name">{t('grokCloud')}</span>
                      <span className="provider-desc">{t('primaryCloudInference')}</span>
                    </div>
                  </div>
                  <span className="connection-badge connected">{t("connected")}</span>
                </div>
                
                <div className="form-group" onClick={e => e.stopPropagation()}>
                  <label className="form-label">{t('apiKey')}</label>
                  <div className="api-key-field">
                    <input 
                      type={showGrokKey ? "text" : "password"} 
                      className="form-input" 
                      value={grokApiKey}
                      onChange={(e) => setGrokApiKey(e.target.value)}
                    />
                    <button 
                      className="toggle-visibility"
                      onClick={() => setShowGrokKey(!showGrokKey)}
                      title={showGrokKey ? "Hide API Key" : "Show API Key"}
                    >
                      {showGrokKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" onClick={e => e.stopPropagation()}>
                  <label className="form-label">{t('modelSelection')}</label>
                  <select 
                    className="form-select"
                    value={grokModel}
                    onChange={(e) => setGrokModel(e.target.value)}
                  >
                    <option value="grok-3">grok-3</option>
                    <option value="grok-3-mini">grok-3-mini</option>
                    <option value="grok-2">grok-2</option>
                  </select>
                </div>
              </div>

              {/* NVIDIA NIM Card */}
              <div 
                className={`provider-card ${primaryProvider === 'nvidia' ? 'active' : ''}`}
                onClick={() => setPrimaryProvider('nvidia')}
                style={{ position: 'relative' }}
              >
                {primaryProvider === 'nvidia' && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                )}
                {primaryProvider !== 'nvidia' && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--text-secondary)' }} />
                )}
                <div className="provider-header">
                  <div className="provider-info">
                    <div className="provider-icon">
                      <Server size={24} />
                    </div>
                    <div className="provider-name-group">
                      <span className="provider-name">{t('nvidiaNim')}</span>
                      <span className="provider-desc">{t('gpuAcceleratedInference')}</span>
                    </div>
                  </div>
                  <span className="connection-badge connected">{t("connected")}</span>
                </div>
                
                <div className="form-group" onClick={e => e.stopPropagation()}>
                  <label className="form-label">{t('apiKey')}</label>
                  <div className="api-key-field">
                    <input 
                      type={showNvKey ? "text" : "password"} 
                      className="form-input" 
                      value={nvApiKey}
                      onChange={(e) => setNvApiKey(e.target.value)}
                    />
                    <button 
                      className="toggle-visibility"
                      onClick={() => setShowNvKey(!showNvKey)}
                      title={showNvKey ? "Hide API Key" : "Show API Key"}
                    >
                      {showNvKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group" onClick={e => e.stopPropagation()}>
                  <label className="form-label">{t('modelSelection')}</label>
                  <select 
                    className="form-select"
                    value={nvModel}
                    onChange={(e) => setNvModel(e.target.value)}
                  >
                    <option value="llama-3.1-70b-instruct">llama-3.1-70b-instruct</option>
                    <option value="mixtral-8x22b">mixtral-8x22b</option>
                    <option value="gemma-2-27b">gemma-2-27b</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Output Configuration */}
        <div className="settings-section">
          <div className="section-header">
            <Zap className="section-icon" size={24} />
            <h3>{t('outputConfig')}</h3>
          </div>
          <div className="section-body">
            
            <div className="form-group">
              <label className="form-label">{t('outputQualityPreset')}</label>
              <div className="quality-presets">
                <div 
                  className={`quality-card ${outputQuality === 'draft' ? 'selected' : ''}`}
                  onClick={() => setOutputQuality('draft')}
                >
                  <Zap className="quality-icon" size={24} />
                  <span className="quality-name">{t('draft')}</span>
                  <span className="quality-desc">{t('fastLowerQuality')}</span>
                </div>
                <div 
                  className={`quality-card ${outputQuality === 'standard' ? 'selected' : ''}`}
                  onClick={() => setOutputQuality('standard')}
                >
                  <Settings className="quality-icon" size={24} />
                  <span className="quality-name">{t('standard')}</span>
                  <span className="quality-desc">{t('balancedOutput')}</span>
                </div>
                <div 
                  className={`quality-card ${outputQuality === 'high' ? 'selected' : ''}`}
                  onClick={() => setOutputQuality('high')}
                >
                  <CheckCircle className="quality-icon" size={24} />
                  <span className="quality-name">{t('highFidelity')}</span>
                  <span className="quality-desc">{t('slowerBestQuality')}</span>
                </div>
              </div>
            </div>

            <div className="preference-grid">
              <div className="form-group">
                <label className="form-label">{t('defaultLanguage')}</label>
                <select 
                  className="form-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="or">Odia (ଓଡ଼ିଆ)</option>
                </select>
              </div>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-label">{t('autoGenerateOutputsLabel')}</span>
                <span className="toggle-desc">{t('autoGenerateOutputsDesc')}</span>
              </div>
              <FallbackToggle checked={autoGenerateOutputs} onChange={setAutoGenerateOutputs} />
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-label">{t('includeClassMarkings')}</span>
                <span className="toggle-desc">{t('includeClassMarkingsDesc')}</span>
              </div>
              <FallbackToggle checked={includeMarkings} onChange={setIncludeMarkings} />
            </div>

          </div>
        </div>

        {/* Section 3: System Preferences */}
        <div className="settings-section">
          <div className="section-header">
            <Monitor className="section-icon" size={24} />
            <h3>{t('systemPreferences')}</h3>
          </div>
          <div className="section-body">
            
            <div className="preference-grid">
              <div className="form-group">
                <label className="form-label">{t('themePreference')}</label>
                <select 
                  className="form-select"
                  value={themePreference}
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    setThemePreference(newTheme);
                    if (newTheme === t('dark')) setTheme('dark');
                    if (newTheme === t('light')) setTheme('light');
                  }}
                >
                  <option value="Dark">{t('dark')}</option>
                  <option value="Light">{t('light')}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('sidebarDefaultState')}</label>
                <select 
                  className="form-select"
                  value={sidebarDefault}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setSidebarDefault(newState);
                    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: newState === t('collapsed') });
                  }}
                >
                  <option value="Expanded">{t('expanded')}</option>
                  <option value="Collapsed">{t('collapsed')}</option>
                </select>
              </div>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-label">{t('enableNotificationsLabel')}</span>
                <span className="toggle-desc">{t('enableNotificationsDesc')}</span>
              </div>
              <FallbackToggle checked={enableNotifications} onChange={setEnableNotifications} />
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-label">{t('autoSaveDraftsLabel')}</span>
                <span className="toggle-desc">{t('autoSaveDraftsDesc')}</span>
              </div>
              <FallbackToggle checked={autoSaveDrafts} onChange={setAutoSaveDrafts} />
            </div>

          </div>
        </div>

        {/* Section 4: Security & Compliance */}
        <div className="settings-section">
          <div className="section-header">
            <Shield className="section-icon" size={24} />
            <h3>{t('securityCompliance')}</h3>
          </div>
          <div className="section-body">
            
            <div className="preference-grid">
              <div className="form-group">
                <label className="form-label">{t('defaultClassLevel')}</label>
                <select 
                  className="form-select"
                  value={classificationLevel}
                  onChange={(e) => setClassificationLevel(e.target.value)}
                >
                  <option value="UNCLASSIFIED">{t('unclassified')}</option>
                  <option value="RESTRICTED">{t('restricted')}</option>
                  <option value="CONFIDENTIAL">{t('confidential')}</option>
                  <option value="SECRET">{t('secret')}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('dataRetentionPeriod')}</label>
                <select 
                  className="form-select"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                >
                  <option value="7 days">{t('sevenDays')}</option>
                  <option value="30 days">{t('thirtyDays')}</option>
                  <option value="90 days">{t('ninetyDays')}</option>
                  <option value="1 year">{t('oneYear')}</option>
                </select>
              </div>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-label">{t('auditLoggingLabel')}</span>
                <span className="toggle-desc">{t('auditLoggingDesc')}</span>
              </div>
              <FallbackToggle checked={auditLogging} onChange={setAuditLogging} />
            </div>

            <div className="danger-zone">
              <div className="danger-info">
                <h4>{t('clearCachedData')}</h4>
                <p>{t('clearCachedDataDesc')}</p>
              </div>
              <button className="danger-btn" onClick={clearCache}>
                Clear All Data
              </button>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="settings-actions">
          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={18} />
            {t('resetDefaults')}
          </button>
          <button className="save-btn" onClick={handleSave}>
            <Save size={18} />
            {t('saveChanges')}
          </button>
        </div>

      </div>

      {/* Toast Notification */}
      {toastStatus && (
        <div className={`save-toast ${toastStatus === 'hiding' ? 'hiding' : ''}`}>
          <CheckCircle size={20} />
          <span>{t('settingsSavedSuccess')}</span>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
