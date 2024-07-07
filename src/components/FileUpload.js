import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      const response = await axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      console.log('Files uploaded successfully:', response.data);
      setUploadProgress(0); // Reset progress after successful upload
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadProgress(0); // Reset progress on error
    }
  };

  return (
    <div className="file-upload">
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} className="upload-button">Upload Songs</button>
      {uploadProgress > 0 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
