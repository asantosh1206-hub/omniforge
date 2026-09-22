import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { generateIntelligence } from '../../services/llmService';
import Card from '../ui/Card';
import PipelineVisualizer from '../ui/PipelineVisualizer';
import { 
  FileText, 
  Presentation, 
  Headphones, 
  Share2, 
  Hash, 
  GitBranch, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  FileBarChart,
  Check
} from 'lucide-react';
import './TransformPage.css';
import { useLanguage } from '../../context/LanguageContext';


export default function TransformPage() {
  const { t, language } = useLanguage();
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(-1);

  const selectedOutputs = state?.selectedOutputs || [];
  const files = state?.ingestedFiles || [];
  const rawTextInput = state?.rawTextInput || '';

  const hasFiles = files.length > 0;
  const hasText = rawTextInput.trim().length > 0;
  const hasSource = hasFiles || hasText;

  const handleToggleOutput = (id) => {
    dispatch({ type: 'TOGGLE_OUTPUT', payload: id });
  };

  const handleClearSelections = () => {
    dispatch({ type: 'CLEAR_SELECTIONS' });
  };

  const handleSelectAll = () => {
    const allIds = outputCategories.flatMap(cat => cat.items.map(item => item.id));
    dispatch({ type: 'SET_SELECTED_OUTPUTS', payload: allIds });
  };

  const outputCategories = [
  {
    title: t('documents'),
    icon: FileText,
    color: 'var(--accent-primary)',
    items: [
      { id: 'exec-summary', name: t('execSummary'), description: t('execSummaryDesc'), icon: FileBarChart, time: '~30s' },
      { id: 'threat-advisory', name: t('threatAdvisory'), description: t('threatAdvisoryDesc'), icon: FileText, time: '~45s' }
    ]
  },
  {
    title: t('multimedia'),
    icon: Presentation,
    color: 'var(--status-info)',
    items: [
      { id: 'pptx-deck', name: t('presentationDeck'), description: t('presentationDeckDesc'), icon: Presentation, time: '~60s' },
      { id: 'audio-briefing', name: t('audioBriefing'), description: t('audioBriefingDesc'), icon: Headphones, time: '~40s' },
      { 
        id: 'video-script', 
        name: t('videoScript', 'Video Script & Storyboard'), 
        description: t('videoScriptDesc', 'Complete video package with visual recommendations'), 
        icon: FileText, 
        time: '45s' 
      }
    ]
  },
  {
    title: t('social'),
    icon: Share2,
    color: 'var(--status-success)',
    items: [
      { id: 'linkedin-post', name: t('linkedinPost'), description: t('linkedinPostDesc'), icon: Share2, time: '~15s' },
      { id: 'twitter-thread', name: t('twitterThread'), description: t('twitterThreadDesc'), icon: Hash, time: '~15s' }
    ]
  },
  {
    title: t('visual'),
    icon: GitBranch,
    color: 'var(--status-warning)',
    items: [
      { id: 'flowchart', name: t('flowchartKillChain'), description: t('flowchartKillChainDesc'), icon: GitBranch, time: '~25s' },
      { id: 'arch-diagram', name: t('architectureDiagram'), description: t('architectureDiagramDesc'), icon: BarChart3, time: '~25s' },
      { 
        id: 'infographic', 
        name: t('infographicLayout', 'Infographic Layout'), 
        description: t('infographicDesc', 'Layout recommendations and key messaging points'), 
        icon: BarChart3, 
        time: '15s' 
      }
    ]
  }
];

  const handleGenerate = async () => {
    if (selectedOutputs.length > 0) {
      setIsGenerating(true);
      setPipelineStage(0); // Ingest
      
      const jobId = 'job-' + Date.now();
      const sourceName = (files && files.length > 0) ? files[0].name : (rawTextInput ? 'Raw Text Input' : 'No Source');
      
      dispatch({
        type: 'ADD_JOB',
        payload: {
          id: jobId,
          name: `Transformation Job ${jobId.slice(-4)}`,
          source: sourceName,
          outputs: selectedOutputs,
          status: 'processing',
          progress: 10,
          createdAt: new Date().toLocaleTimeString(),
          completedAt: null
        }
      });
      
      // Combine text from files and raw input for the prompt
      let combinedText = rawTextInput || '';
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            const text = await file.text();
            combinedText += `\n\n--- Content of ${file.name} ---\n${text.slice(0, 2000)}`;
          } catch (e) {
            console.error("Could not read file", e);
          }
        }
      }
      
      try {
        setPipelineStage(1); // Extract
        await new Promise(r => setTimeout(r, 1500)); // Small pause for UX
        
        setPipelineStage(2); // AI Process
        
                // Smart split: text outputs concurrent (fast 11B), diagrams sequential (heavy 120B)
        const diagramTypes = ['infographic', 'arch-diagram', 'flowchart'];
        const textOutputs = selectedOutputs.filter(t => !diagramTypes.includes(t));
        const diagramOutputs = selectedOutputs.filter(t => diagramTypes.includes(t));

        // Fire all text outputs concurrently (llama-11B handles this easily)
        await Promise.all(textOutputs.map(async (outputType) => {
          try {
            const content = await generateIntelligence(combinedText, outputType, state.apiConfig, language);
            dispatch({ type: 'ADD_GENERATED_OUTPUT', payload: { jobId, outputType, content } });
          } catch (err) {
            console.error(`Generation failed for ${outputType}:`, err);
            dispatch({ type: 'ADD_GENERATED_OUTPUT', payload: { jobId, outputType, content: `Error generating content: ${err.message}` } });
          }
        }));

        // Process diagrams one at a time (nemotron-120B overloads with concurrent requests)
        for (const outputType of diagramOutputs) {
          try {
            const content = await generateIntelligence(combinedText, outputType, state.apiConfig, language);
            dispatch({ type: 'ADD_GENERATED_OUTPUT', payload: { jobId, outputType, content } });
          } catch (err) {
            console.error(`Generation failed for ${outputType}:`, err);
            dispatch({ type: 'ADD_GENERATED_OUTPUT', payload: { jobId, outputType, content: `Error generating content: ${err.message}` } });
          }
        }
        
        setPipelineStage(3); // Generate outputs
        await new Promise(r => setTimeout(r, 1000));
        
        setPipelineStage(4); // Package
        await new Promise(r => setTimeout(r, 1000));
        
        setPipelineStage(5); // Complete
        
        dispatch({
          type: 'UPDATE_JOB_STATUS',
          payload: {
            id: jobId,
            updates: { status: 'completed', progress: 100, date: 'Just now' }
          }
        });
        
        // We'll store the latest jobId in AppContext so OutputPage knows what to render
        dispatch({ type: 'SET_ACTIVE_JOB_ID', payload: jobId });
        
        setIsGenerating(false);
        navigate('/output');
        
      } catch (err) {
        console.error("Global generation error:", err);
        setIsGenerating(false);
      }
    }
  };

  const renderSourceContext = () => {
    if (!hasSource) {
      return (
        <div className="source-context empty">
          <AlertCircle size={24} className="context-icon warning" />
          <div className="context-content">
            <h3>{t('noSourceLoaded')}</h3>
            <p>{t('needToIngest')}</p>
            <Link to="/ingest" className="ingest-link">
              Go to Ingestion <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="source-context">
        <CheckCircle2 size={24} className="context-icon success" />
        <div className="context-content">
          <h3>Source Content Ready</h3>
          <div className="source-details">
            {hasFiles && (
              <p>Loaded {files.length} file(s): {files.map(f => f.name).join(', ')}</p>
            )}
            {hasText && (
              <p>Manual text input ({rawTextInput.length} characters)</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="transform-page fade-in">
      <div className="transform-header">
        <h1>{t('transformSelector')}</h1>
        <p className="page-subtitle">{t('transformDesc')}</p>
      </div>

      {renderSourceContext()}
      
      <div className={`generation-params-panel fade-in ${!hasSource ? 'disabled' : ''}`} style={{ 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '32px' 
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Generation Controls</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          
          <div className="param-group">
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Target Audience</label>
            <select 
              value={state.apiConfig.audience} 
              onChange={(e) => dispatch({ type: 'UPDATE_API_CONFIG', payload: { audience: e.target.value } })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="Executive">Executive / C-Suite</option>
              <option value="Professional">Professional (Default)</option>
              <option value="Technical">Technical / Engineering</option>
              <option value="General">General Public</option>
            </select>
          </div>

          <div className="param-group">
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Tone</label>
            <select 
              value={state.apiConfig.tone} 
              onChange={(e) => dispatch({ type: 'UPDATE_API_CONFIG', payload: { tone: e.target.value } })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="Objective">Objective / Neutral</option>
              <option value="Urgent">Urgent / Action-Oriented</option>
              <option value="Authoritative">Authoritative / Firm</option>
              <option value="Accessible">Accessible / Conversational</option>
            </select>
          </div>

          <div className="param-group">
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Level of Detail</label>
            <select 
              value={state.apiConfig.detailLevel} 
              onChange={(e) => dispatch({ type: 'UPDATE_API_CONFIG', payload: { detailLevel: e.target.value } })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="High-Level">High-Level Overview</option>
              <option value="Brief">Brief / Bullet Points</option>
              <option value="Comprehensive">Comprehensive Analysis</option>
            </select>
          </div>

        </div>
      </div>

      <div className={`categories-grid ${!hasSource ? 'disabled' : ''}`}>
        {outputCategories.map((category) => (
          <div key={category.title} className="category-section">
            <div className="category-header">
              <div 
                className="category-icon" 
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${category.color} 10%, transparent)`,
                  color: category.color 
                }}
              >
                <category.icon size={20} />
              </div>
              <h2>{category.title}</h2>
            </div>
            
            <div className="output-items">
              {category.items.map((item) => {
                const isSelected = selectedOutputs.includes(item.id);
                const ItemIcon = item.icon;
                
                return (
                  <div 
                    key={item.id}
                    className={`output-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => hasSource && handleToggleOutput(item.id)}
                  >
                    <div className="card-checkbox">
                      {isSelected && <Check size={14} className="check-icon" />}
                    </div>
                    <div className="card-content">
                      <div className="card-name">{item.name}</div>
                      <div className="card-description">{item.description}</div>
                      <div className="card-time">
                        <Clock size={12} />
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <ItemIcon size={24} className="card-icon" style={{ color: category.color }} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="transform-actions">
        <div className="actions-left">
          <div className="selected-count">
            <span>{selectedOutputs.length}</span> {t('outputsSelected')}
          </div>
          <button className="clear-btn" style={{ marginLeft: '12px' }} onClick={handleSelectAll}>
            Select All
          </button>
          {selectedOutputs.length > 0 && (
            <button className="clear-btn" style={{ marginLeft: '12px' }} onClick={handleClearSelections}>
              Clear All
            </button>
          )}
        </div>
        
        <button 
          className="generate-btn"
          disabled={selectedOutputs.length === 0 || !hasSource || isGenerating}
          onClick={handleGenerate}
        >
          <Zap size={18} />
          {isGenerating ? 'Generating...' : 'Generate Selected'}
        </button>
      </div>

      {isGenerating && (
        <div className="pipeline-section">
          <PipelineVisualizer 
            isActive={isGenerating} 
            activeStage={pipelineStage}
          />
        </div>
      )}
    </div>
  );
}
