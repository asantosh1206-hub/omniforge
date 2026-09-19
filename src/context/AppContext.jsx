import React, { createContext, useContext, useReducer, useEffect } from 'react';

const savedJobs = JSON.parse(localStorage.getItem('omniforge_jobs') || '[]');

const initialState = {
  sidebarCollapsed: false,
  ingestedFiles: [],
  rawTextInput: '',
  selectedOutputs: [],
  generatedOutputs: {}, // { jobId: { outputType: content } }
  apiConfig: {
    primaryProvider: 'grok', // 'auto', 'grok' or 'nvidia'
    grokApiKey: import.meta.env.VITE_GROK_API_KEY || '',
    grokModel: 'grok-3',
    nvidiaApiKey: import.meta.env.VITE_NVIDIA_API_KEY || '',
    nvidiaModel: 'nvidia/llama-3.1-nemotron-70b-instruct',
    audience: 'Professional', // 'Executive', 'Professional', 'General', 'Technical'
    tone: 'Objective', // 'Objective', 'Urgent', 'Authoritative', 'Accessible'
    detailLevel: 'Comprehensive' // 'High-Level', 'Brief', 'Comprehensive'
  },
  transformationJobs: savedJobs,
  systemStatus: {
    grok: { connected: true, label: 'Grok Cloud', mode: 'cloud' },
    nvidia: { connected: true, label: 'NVIDIA NIM', mode: 'cloud' }
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    case 'ADD_FILE':
      return { ...state, ingestedFiles: [...state.ingestedFiles, action.payload] };
    case 'REMOVE_FILE':
      return {
        ...state,
        ingestedFiles: state.ingestedFiles.filter((_, idx) => idx !== action.payload)
      };
    case 'SET_RAW_TEXT':
      return { ...state, rawTextInput: action.payload };
    case 'SET_SELECTED_OUTPUTS':
      return { ...state, selectedOutputs: action.payload };
    case 'TOGGLE_OUTPUT':
      return {
        ...state,
        selectedOutputs: state.selectedOutputs.includes(action.payload)
          ? state.selectedOutputs.filter((o) => o !== action.payload)
          : [...state.selectedOutputs, action.payload]
      };
    case 'CLEAR_SELECTIONS':
      return { ...state, ingestedFiles: [], rawTextInput: '', selectedOutputs: [] };
    case 'ADD_JOB':
      return { ...state, transformationJobs: [action.payload, ...state.transformationJobs].slice(0, 10) };
    case 'UPDATE_JOB_STATUS':
      return {
        ...state,
        transformationJobs: state.transformationJobs.map((job) =>
          job.id === action.payload.id ? { ...job, ...action.payload.updates } : job
        )
      };
    case 'SET_ACTIVE_JOB_ID':
      return { ...state, activeJobId: action.payload };
    case 'SET_API_CONFIG':
      return { ...state, apiConfig: { ...state.apiConfig, ...action.payload } };
    case 'ADD_GENERATED_OUTPUT':
      return {
        ...state,
        generatedOutputs: {
          ...state.generatedOutputs,
          [action.payload.jobId]: {
            ...state.generatedOutputs[action.payload.jobId],
            [action.payload.outputType]: action.payload.content
          }
        }
      };
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    localStorage.setItem('omniforge_jobs', JSON.stringify(state.transformationJobs));
  }, [state.transformationJobs]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
