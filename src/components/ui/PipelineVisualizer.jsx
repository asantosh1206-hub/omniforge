import React, { useState, useEffect } from 'react';
import { Upload, FileSearch, Brain, Cog, Package, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './PipelineVisualizer.css';

const stages = [
  { id: 'ingest', icon: Upload },
  { id: 'parse', icon: FileSearch },
  { id: 'llm', icon: Brain },
  { id: 'generate', icon: Cog },
  { id: 'package', icon: Package }
];

export default function PipelineVisualizer({ isActive, activeStage, onComplete }) {
  const { t } = useLanguage();
  const [currentStage, setCurrentStage] = useState(-1);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setCurrentStage(-1);
      setElapsedTime(0);
      return;
    }

    if (activeStage !== undefined) {
      setCurrentStage(activeStage);
      if (activeStage >= stages.length && onComplete) {
        onComplete();
      }
    }
  }, [isActive, activeStage, onComplete]);

  const getStageStatus = (index) => {
    if (currentStage > index) return 'completed';
    if (currentStage === index) return 'active';
    return 'pending';
  };

  const getProgressPercentage = () => {
    if (currentStage < 0) return 0;
    if (currentStage >= stages.length) return 100;
    return Math.floor((currentStage / stages.length) * 100);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="pipeline-visualizer">
      <div className="pipeline-header">
        <div className="pipeline-title">Processing Pipeline</div>
        <div className="pipeline-timer">{formatTime(elapsedTime)}</div>
      </div>
      
      <div className="pipeline-progress-bar">
        <div 
          className="pipeline-progress-fill" 
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <div className="pipeline-stages">
        {stages.map((stage, index) => {
          const status = getStageStatus(index);
          const Icon = stage.icon;
          
          return (
            <React.Fragment key={stage.id}>
              <div className={`pipeline-stage ${status}`}>
                <div className={`stage-node ${status}`}>
                  <Icon size={24} className="stage-icon" />
                  
                  {status === 'active' && (
                    <div className="stage-overlay">
                      <Loader2 size={32} className="stage-spinner" />
                    </div>
                  )}
                  
                  {status === 'completed' && (
                    <div className="stage-overlay">
                      <CheckCircle2 size={32} className="stage-check" />
                    </div>
                  )}
                </div>
                
                <div className={`stage-label ${status}`}>{t(`pipeline_${stage.id}`)}</div>
                <div className="stage-sublabel">{t(`pipeline_${stage.id}_sub`)}</div>
              </div>
              
              {index < stages.length - 1 && (
                <div className={`pipeline-connector ${status}`}>
                  <div className="connector-fill" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
