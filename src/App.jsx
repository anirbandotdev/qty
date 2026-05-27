import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import SenderPage from "./pages/SenderPage";
import ReceiverPage from "./pages/ReceiverPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="app-container">
      {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
      {currentPage === "sender" && (
        <SenderPage onBack={() => setCurrentPage("home")} />
      )}
      {currentPage === "receiver" && (
        <ReceiverPage onBack={() => setCurrentPage("home")} />
      )}
    </div>
  );
}

export default App;
