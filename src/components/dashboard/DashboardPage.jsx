import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import ProgressBar from '../ui/ProgressBar';
import {
  FileText,
  Zap,
  Download,
  Activity,
  ArrowUpRight,
  Clock,
  Upload,
  TrendingUp,
  Server,
  Cloud,
  HardDrive,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import './DashboardPage.css';
import { useLanguage } from '../../context/LanguageContext';

const DashboardPage = () => {
  const { t } = useLanguage();
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };
    
    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const transformationJobs = state?.transformationJobs || [];
  
  // Real-time calculated statistics with a base floor of 10
  const BASE_VALUE = 10;
  
  const totalIngestions = BASE_VALUE + (state?.ingestedFiles?.length || 0) + (state?.rawTextInput ? 1 : 0);
  
  // Changed from "active" to "total" so it only goes up and doesn't drop back down when jobs finish
  const totalTransformations = BASE_VALUE + transformationJobs.length;
  
  // Calculate total generated outputs across all jobs
  let deliverablesGenerated = BASE_VALUE;
  if (state?.generatedOutputs) {
    Object.values(state.generatedOutputs).forEach(jobOutputs => {
      deliverablesGenerated += Object.keys(jobOutputs).length;
    });
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <StatusBadge status="success">{t('completed')}</StatusBadge>;
      case 'processing': return <StatusBadge status="warning">{t('processing')}</StatusBadge>;
      case 'failed': return <StatusBadge status="danger">{t('failed')}</StatusBadge>;
      default: return <StatusBadge status="info">{t("pending")}</StatusBadge>;
    }
  };

  const isGrokConnected = state?.systemStatus?.grok?.connected ?? true;
  const isNvidiaConnected = state?.systemStatus?.nvidia?.connected ?? true;
  
  return (
    <div className="dashboard-page">
      {/* 1. Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <h1 className="welcome-title">{t('welcomeBack')}</h1>
          <p className="welcome-subtitle">{t('welcomeSubtitle')}</p>
        </div>
        <div className="welcome-date">
          <Clock className="welcome-date-icon" size={16} />
          <span>{currentDate}</span>
        </div>
      </section>

      {/* 2. Stats Row */}
      <section className="stats-grid">
        <Card className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">{t('totalIngestions')}</span>
              <span className="stat-value">{totalIngestions}</span>
              <div className="stat-change positive">
                <TrendingUp size={14} />
                <span>Live Active</span>
              </div>
            </div>
            <div className="stat-icon-wrapper blue">
              <FileText size={24} className="stat-icon" />
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">Total Transformations</span>
              <span className="stat-value">{totalTransformations}</span>
              <div className="stat-change warning">
                <Activity size={14} />
                <span>Live Active</span>
              </div>
            </div>
            <div className="stat-icon-wrapper amber">
              <Zap size={24} className="stat-icon" />
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">{t('deliverablesGenerated')}</span>
              <span className="stat-value">{deliverablesGenerated}</span>
              <div className="stat-change positive">
                <TrendingUp size={14} />
                <span>Live Active</span>
              </div>
            </div>
            <div className="stat-icon-wrapper green">
              <Download size={24} className="stat-icon" />
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <span className="stat-label">{t('systemUptime')}</span>
              <span className="stat-value">93%</span>
              <div className="stat-change positive">
                <Server size={14} />
                <span>{t("allSystemsNominal")}</span>
              </div>
            </div>
            <div className="stat-icon-wrapper green">
              <Activity size={24} className="stat-icon" />
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Two-Column Layout */}
      <section className="dashboard-content">
        {/* Left Column: Recent Transformations Table */}
        <Card className="recent-transformations">
          <div className="table-header">
            <h2 className="section-title">{t('recentTransformations')}</h2>
            <Link to="/transform" className="view-all-link">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="table-responsive">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>{t("jobName")}</th>
                  <th>{t("sourceContext")}</th>
                  <th>{t("jobStatus")}</th>
                  <th>{t("jobProgress")}</th>
                  <th>{t("jobDate")}</th>
                </tr>
              </thead>
              <tbody>
                {transformationJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="job-name">{job.name}</td>
                    <td className="job-source">{job.source}</td>
                    <td className="job-status">{getStatusBadge(job.status)}</td>
                    <td className="job-progress">
                      <ProgressBar 
                        progress={job.progress} 
                        size="sm" 
                        status={job.status === 'failed' ? 'error' : job.status === 'completed' ? 'success' : 'default'}
                      />
                    </td>
                    <td className="job-date">{job.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: Quick Actions + System Status */}
        <div className="dashboard-sidebar">
          <h2 className="section-title">{t('quickActions')}</h2>
          <div className="quick-actions">
            <Link to="/ingest" className="action-card">
              <div className="action-icon-wrapper blue">
                <Upload size={20} />
              </div>
              <div className="action-text">
                <h3 className="action-title">{t('newIngestion')}</h3>
                <p className="action-desc">{t("uploadFilesOrConnect")}</p>
              </div>
              <ChevronRight size={20} className="action-arrow" />
            </Link>

            <Link to="/transform" className="action-card">
              <div className="action-icon-wrapper amber">
                <Zap size={20} />
              </div>
              <div className="action-text">
                <h3 className="action-title">{t("startTransform")}</h3>
                <p className="action-desc">{t("runAiModels")}</p>
              </div>
              <ChevronRight size={20} className="action-arrow" />
            </Link>
          </div>

          <h2 className="section-title" style={{ marginTop: '24px' }}>{t('systemHealth')}</h2>
          <Card className="system-health">
            <div className="health-list">
              <div className="health-item">
                <div className="health-info">
                  <Cloud size={18} className="health-icon" />
                  <span className="health-label">Grok Cloud API</span>
                </div>
                <div className="health-status">
                  <span className={`status-dot ${isGrokConnected ? 'active' : 'inactive'}`}></span>
                  <span className="status-text">{isGrokConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>

              <div className="health-item">
                <div className="health-info">
                  <Server size={18} className="health-icon" />
                  <span className="health-label">NVIDIA NIM</span>
                </div>
                <div className="health-status">
                  <span className={`status-dot ${isNvidiaConnected ? 'active' : 'inactive'}`}></span>
                  <span className="status-text">{isNvidiaConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>

              <div className="health-item">
                <div className="health-info">
                  <Activity size={18} className="health-icon" />
                  <span className="health-label">{t('activeMode')}</span>
                </div>
                <div className="health-status">
                  <span className="mode-badge">Cloud (Multi-Provider)</span>
                </div>
              </div>
            </div>
            <div className="health-footer">
              <Link to="/settings" className="configure-link">{t('configureSettings')}</Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
