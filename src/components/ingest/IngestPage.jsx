import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import FileDropzone from '../ui/FileDropzone';
import { 
  FileText, Type, ArrowRight, AlertCircle, 
  CheckCircle2, Loader2, Bold, Italic, 
  List, Link2, Code 
} from 'lucide-react';
import './IngestPage.css';
import { useLanguage } from '../../context/LanguageContext';

const IngestPage = () => {
  const { t } = useLanguage();
  const { state, dispatch } = useApp();
  const [processState, setProcessState] = useState('idle'); // idle, processing, success
  
  const handleFilesAdded = useCallback((filesList) => {
    // filesList is a FileList object, convert to array
    const newFiles = Array.from(filesList);
    newFiles.forEach(file => {
      dispatch({ type: 'ADD_FILE', payload: file });
    });
  }, [dispatch]);

  const handleRemoveFile = useCallback((fileId) => {
    dispatch({ type: 'REMOVE_FILE', payload: fileId });
  }, [dispatch]);

  const handleTextChange = useCallback((e) => {
    dispatch({ type: 'SET_RAW_TEXT', payload: e.target.value });
  }, [dispatch]);

  const navigate = useNavigate();

  const handleProcess = () => {
    setProcessState('processing');
    
    setTimeout(() => {
      setProcessState('success');
      
      setTimeout(() => {
        setProcessState('idle');
        navigate('/transform');
      }, 1500);
    }, 2000);
  };

  const hasFiles = state.ingestedFiles && state.ingestedFiles.length > 0;
  const hasText = state.rawTextInput && state.rawTextInput.trim().length > 0;
  const canProcess = hasFiles || hasText;

  const totalSize = state.ingestedFiles ? state.ingestedFiles.reduce((acc, file) => acc + file.size, 0) : 0;
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="ingest-page fade-in">
      <div className="ingest-header">
        <h1>{t("contentIngestion")}</h1>
        <p className="text-secondary">{t('ingestDesc1')}</p>
      </div>

      <div className="ingest-grid">
        {/* Left Column: File Upload */}
        <section className="ingest-section">
          <div className="section-header">
            <FileText className="section-icon" size={24} />
            <div>
              <h2 className="section-title">{t('documentUpload')}</h2>
              <p className="section-subtitle">{t('ingestSupport1')}</p>
            </div>
          </div>
          <div className="upload-area">
            <FileDropzone 
              files={state.ingestedFiles || []} 
              onFilesAdded={handleFilesAdded} 
              onRemoveFile={handleRemoveFile} 
            />
            
            {hasFiles && (
              <div className="file-stats">
                <span className="text-secondary">{state.ingestedFiles.length} file{state.ingestedFiles.length > 1 ? 's' : ''} added</span>
                <span className="text-secondary">•</span>
                <span className="text-secondary">{formatSize(totalSize)}</span>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Text Input */}
        <section className="ingest-section">
          <div className="section-header">
            <Type className="section-icon" size={24} />
            <div>
              <h2 className="section-title">{t('rawIntelInput')}</h2>
              <p className="section-subtitle">{t('ingestSupport2')}</p>
            </div>
          </div>
          
          <div className="text-input-area">
            <div className="formatting-toolbar">
              <button className="toolbar-btn" disabled title="Bold"><Bold size={16} /></button>
              <button className="toolbar-btn" disabled title="Italic"><Italic size={16} /></button>
              <button className="toolbar-btn" disabled title="List"><List size={16} /></button>
              <button className="toolbar-btn" disabled title="Link"><Link2 size={16} /></button>
              <button className="toolbar-btn" disabled title="Code"><Code size={16} /></button>
            </div>
            <textarea 
              className="text-area"
              placeholder="Paste raw intelligence content here...&#10;&#10;Supported formats:&#10;• Threat reports and advisories&#10;• Vulnerability assessments&#10;• Network traffic analysis&#10;• Incident response summaries"
              value={state.rawTextInput || ''}
              onChange={handleTextChange}
            />
            <div className="char-count">
              {state.rawTextInput ? state.rawTextInput.length : 0} characters
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="action-bar">
        <div className="action-info">
          <AlertCircle size={18} />
          <span>{t('ingestFooter')}</span>
        </div>
        
        <button 
          className={`process-btn ${processState !== 'idle' ? processState : ''}`}
          disabled={!canProcess || processState !== 'idle'}
          onClick={handleProcess}
        >
          {processState === 'idle' && (
            <>
              Process & Extract <ArrowRight size={18} className="btn-icon" />
            </>
          )}
          {processState === 'processing' && (
            <>
              Processing... <Loader2 size={18} className="btn-icon spin" />
            </>
          )}
          {processState === 'success' && (
            <>
              Extraction Complete! <CheckCircle2 size={18} className="btn-icon" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IngestPage;
