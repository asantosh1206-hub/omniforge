import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import './ui.css';

const FileDropzone = ({ 
  onFilesAdded, 
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt'], 
  files = [], 
  onRemoveFile 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(e.target.files);
    }
    // Reset so same file can be selected again if removed
    e.target.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="dropzone-container">
      <div 
        className={`dropzone ${isDragActive ? 'dropzone--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileInput} 
          className="dropzone-input" 
          multiple
          accept={acceptedTypes.join(',')}
        />
        
        <div className="dropzone-content">
          <Upload className="dropzone-icon" size={40} />
          <p className="dropzone-text">
            <strong>Drag & drop your intelligence files here</strong>
          </p>
          <p className="dropzone-subtext">or click to browse</p>
          
          <div className="dropzone-badges">
            {acceptedTypes.map(type => (
              <span key={type} className="dropzone-badge">{type}</span>
            ))}
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="file-item">
              <div className="file-item-info">
                <FileText className="file-item-icon" size={20} />
                <div className="file-item-details">
                  <span className="file-item-name">{file.name}</span>
                  <span className="file-item-size">{formatFileSize(file.size)}</span>
                </div>
              </div>
              {onRemoveFile && (
                <button 
                  className="file-item-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
