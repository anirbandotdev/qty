import { useState, useRef, useCallback, useEffect } from "react";
import "./ReceiverPage.css";

function ReceiverPage({ onBack }) {
  const [cameraState, setCameraState] = useState("idle"); // idle | starting | active | error
  const [scannedData, setScannedData] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState("idle");
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setCameraState("starting");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      // Store the stream ref so cleanup always works
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video metadata to load before playing
        await new Promise((resolve, reject) => {
          const video = videoRef.current;
          if (!video) {
            reject(new Error("Video element lost"));
            return;
          }

          const onLoaded = () => {
            video.removeEventListener("loadedmetadata", onLoaded);
            video.removeEventListener("error", onError);
            resolve();
          };
          const onError = (e) => {
            video.removeEventListener("loadedmetadata", onLoaded);
            video.removeEventListener("error", onError);
            reject(e);
          };

          // If metadata is already loaded (can happen with cached streams)
          if (video.readyState >= 1) {
            resolve();
            return;
          }

          video.addEventListener("loadedmetadata", onLoaded);
          video.addEventListener("error", onError);
        });

        await videoRef.current.play();
        setCameraState("active");
      } else {
        // Component unmounted while awaiting — clean up
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    } catch (error) {
      // Clean up any stream that was acquired
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      let message = "Unable to access camera.";
      if (error.name === "NotAllowedError") {
        message = "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError") {
        message = "No camera found on this device.";
      } else if (error.name === "NotReadableError") {
        message = "Camera is in use by another application.";
      } else if (error.name === "OverconstrainedError") {
        message = "Camera doesn't meet the required constraints. Trying again...";
      }

      setCameraError(message);
      setCameraState("error");
      console.error("Camera access error:", error);
    }
  }, []);

  const handleScan = () => {
    // Placeholder for actual QR code scanning logic
    // This will be implemented with html5-qr library
    console.log("Scanning QR code...");
    setScannedData({
      code: "scanned-qr-data",
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const resetScanner = () => {
    setScannedData(null);
  };

  // Cleanup on unmount — uses ref so no stale closure
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const isActive = cameraState === "active" || cameraState === "starting";

  return (
    <div className="receiver-page">
      <div className="receiver-container">
        <button className="back-btn" onClick={() => { stopCamera(); onBack(); }}>
          <span className="back-arrow">←</span>
          <span>Back</span>
        </button>

        <div className="page-header">
          <span className="page-icon">📷</span>
          <h1>Receive Files</h1>
          <p className="page-desc">Point your camera at a QR code to receive files</p>
        </div>

        <div className="camera-section">
          {!isActive ? (
            <div className="camera-placeholder">
              <div className="camera-placeholder-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p className="placeholder-text">Camera is ready to scan</p>
              <button
                className="btn btn-primary btn-glow"
                onClick={startCamera}
                disabled={cameraState === "starting"}
              >
                {cameraState === "starting" ? (
                  <>
                    <span className="spinner" />
                    Starting Camera...
                  </>
                ) : (
                  "Start Camera"
                )}
              </button>
            </div>
          ) : (
            <div className="camera-live">
              <div className="camera-viewport">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="video-stream"
                />
                <div className="scan-overlay">
                  <div className="scan-frame">
                    <span className="corner corner-tl" />
                    <span className="corner corner-tr" />
                    <span className="corner corner-bl" />
                    <span className="corner corner-br" />
                    <div className="scan-line" />
                  </div>
                </div>
                <div className="camera-badge">
                  <span className="live-dot" />
                  LIVE
                </div>
              </div>

              <div className="camera-controls">
                <button className="btn btn-primary scan-btn" onClick={handleScan}>
                  Scan QR Code
                </button>
                <button className="btn btn-ghost" onClick={stopCamera}>
                  Stop Camera
                </button>
              </div>
            </div>
          )}
        </div>

        {cameraError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div>
              <p className="error-text">{cameraError}</p>
              <button className="btn btn-link" onClick={startCamera}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {scannedData && (
          <div className="scan-result">
            <div className="result-header">
              <span className="result-icon">✅</span>
              <h2>QR Code Detected</h2>
            </div>
            <div className="result-content">
              <div className="result-row">
                <span className="result-label">Data</span>
                <span className="result-value">{scannedData.code}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Time</span>
                <span className="result-value">{scannedData.timestamp}</span>
              </div>
            </div>
            <button className="btn btn-secondary full-width" onClick={resetScanner}>
              Scan Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiverPage;
