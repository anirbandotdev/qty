import { useState } from "react";
import "./SenderPage.css";

function SenderPage({ onBack }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setQrCode(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleGenerateQR = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setIsGenerating(true);

    // Placeholder for actual QR code generation logic
    // This will be implemented with qrcode library
    setTimeout(() => {
      console.log("Generating QR code for file:", selectedFile.name);
      setQrCode({
        data: "placeholder-qr-data",
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="sender-page">
      <div className="sender-container">
        <button className="back-btn" onClick={onBack}>
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>

        <div className="sender-header">
          <span className="sender-header-icon">📤</span>
          <h1>Send Files</h1>
          <p>Select a file and generate a QR code to share it</p>
        </div>

        <div className="upload-section">
          <div className={`upload-area${selectedFile ? " has-file" : ""}`}>
            <input
              type="file"
              id="file-input"
              className="file-input"
              onChange={handleFileChange}
            />
            <label htmlFor="file-input" className="file-label">
              <svg className="upload-icon-svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="upload-text">
                {selectedFile ? selectedFile.name : "Click to select a file"}
              </span>
              {!selectedFile && (
                <span className="upload-hint">Any file type supported</span>
              )}
            </label>
          </div>

          {selectedFile && (
            <div className="file-info">
              <div className="file-detail">
                <span className="file-detail-label">Filename</span>
                <span className="file-detail-value">{selectedFile.name}</span>
              </div>
              <div className="file-detail">
                <span className="file-detail-label">Size</span>
                <span className="file-detail-value">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
              <div className="file-detail">
                <span className="file-detail-label">Type</span>
                <span className="file-detail-value">
                  {selectedFile.type || "Unknown"}
                </span>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleGenerateQR}
            disabled={!selectedFile || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner" />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </button>
        </div>

        {qrCode && (
          <div className="qr-section">
            <h2>Your QR Code</h2>
            <div className="qr-code-display">
              <p className="qr-placeholder-text">QR Code will appear here</p>
              <p className="qr-filename">{qrCode.fileName}</p>
            </div>
            <p className="qr-note">Share this QR code with the receiver</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SenderPage;
