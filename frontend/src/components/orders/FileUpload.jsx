// File: ./frontend/src/components/orders/FileUpload.jsx

import React, { useState, useRef } from 'react';
import { isValidImageFile, formatFileSize } from '../../utils/helpers';
import { MAX_FILE_SIZE } from '../../utils/constants';
import './FileUpload.css';

const FileUpload = ({ onFileSelect, error }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file
    if (!isValidImageFile(selectedFile, MAX_FILE_SIZE)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, GIF, WEBP) under 5MB');
      setFile(null);
      setPreview(null);
      onFileSelect(null);
      return;
    }

    setUploadError('');
    setFile(selectedFile);
    onFileSelect(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setUploadError('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <label className="file-upload-label">Upload Payment Screenshot *</label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="file-input-hidden"
      />

      {!file ? (
        <div className="upload-area" onClick={handleClick}>
          <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="upload-text">
            <span className="upload-link">Click to upload</span> or drag and drop
          </p>
          <p className="upload-hint">JPEG, PNG, GIF, WEBP (max. 5MB)</p>
        </div>
      ) : (
        <div className="file-preview">
          {preview && (
            <img src={preview} alt="Payment screenshot preview" className="preview-image" />
          )}
          <div className="file-info">
            <div className="file-details">
              <svg className="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="file-name">{file.name}</p>
                <p className="file-size">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button type="button" onClick={handleRemove} className="remove-button">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {(uploadError || error) && (
        <p className="upload-error">{uploadError || error}</p>
      )}

      <p className="upload-note">
        <svg className="note-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Please ensure the screenshot clearly shows the transaction details including amount and transaction ID.
      </p>
    </div>
  );
};

export default FileUpload;