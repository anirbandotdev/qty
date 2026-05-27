import "./HomePage.css";

function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-container">
        <span className="home-logo">⚡</span>
        <h1>QTY</h1>
        <p className="subtitle">Transfer files instantly with QR codes</p>

        <div className="button-group">
          <button
            className="role-btn role-btn-sender"
            onClick={() => onNavigate("sender")}
          >
            <span className="btn-icon">📤</span>
            <span className="btn-text">Send Files</span>
            <span className="btn-desc">Generate a QR code</span>
          </button>

          <button
            className="role-btn role-btn-receiver"
            onClick={() => onNavigate("receiver")}
          >
            <span className="btn-icon">📥</span>
            <span className="btn-text">Receive Files</span>
            <span className="btn-desc">Scan a QR code</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
