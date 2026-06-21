import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [customName, setCustomName] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [selectedStack, setSelectedStack] = useState("React Boilerplate");
  
  const navigate = useNavigate();
  const userId = localStorage.getItem('usuario_id');
  const userName = localStorage.getItem('usuario_nome') || "Developer";

  const BACKEND_URL = "https://devlaunch-backend-uw21.onrender.com";

  // Strict mapping to match your backend expectations perfectly
  const backendMapping = {
    "React Boilerplate": "REACT.js Module",
    "Node.js API": "Node.js REST API",
    "Discord Bot": "Discord Bot Base"
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      loadHistory();
    }
  }, [userId]);

  const loadHistory = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/projetos/lista/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.projetos || []);
      }
    } catch (err) {
      console.error("Error syncing history data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGenerateProject = async () => {
    const finalName = customName.trim() || `Project_${selectedStack.replace(/\s+/g, '_')}`;
    setStatus(`Compiling production files for ${finalName}...`);
    setStatusType("info");

    try {
      const res = await fetch(`${BACKEND_URL}/api/projetos/salvar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: userId, 
          tipo_projeto: backendMapping[selectedStack],
          nome_projeto: finalName
        })
      });

      if (!res.ok) throw new Error("Server build generation pipeline failed.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${finalName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setStatus(`Success! ${finalName}.zip downloaded successfully.`);
      setStatusType("success");
      setCustomName("");
      loadHistory(); 
    } catch (err) {
      setStatus(`Download pipeline failed: ${err.message}`);
      setStatusType("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid var(--border-glow)", backgroundColor: "var(--bg-card)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--accent)" }}></div>
          <span style={{ fontWeight: "700", fontSize: "15px", letterSpacing: "0.5px" }}>DEVLAUNCH</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Welcome back, <strong style={{ color: "#fff" }}>{userName}</strong></span>
          <button onClick={handleLogout} className="secondary-button" style={{ padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* NOTIFICATION BANNER */}
      {status && (
        <div style={{ 
          padding: "12px 40px", 
          backgroundColor: statusType === "error" ? "rgba(239, 68, 68, 0.08)" : statusType === "success" ? "rgba(16, 185, 129, 0.08)" : "rgba(124, 58, 237, 0.08)",
          borderBottom: "1px solid " + (statusType === "error" ? "#ef4444" : statusType === "success" ? "#10b981" : "var(--accent)"),
          color: statusType === "error" ? "#f87171" : statusType === "success" ? "#34d399" : "#a78bfa",
          fontSize: "13px", textAlign: "center", fontWeight: "500"
        }}>
          {status}
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: "1000px", width: "100%", margin: "40px auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: "32px" }}>
        
        {/* SECTION 1: STACK CARDS */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>1. Select Base Infrastructure</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[
              { id: "React Boilerplate", desc: "Vite-powered environment ready with fundamental structural routing rules.", tag: "FRONTEND" },
              { id: "Node.js API", desc: "Modular Express engine pre-configured with CORS and structured systems.", tag: "BACKEND" },
              { id: "Discord Bot", desc: "Isolated modular baseline architecture leveraging the Discord.js framework.", tag: "AUTOMATION" }
            ].map((stack) => (
              <div 
                key={stack.id}
                onClick={() => setSelectedStack(stack.id)}
                className="interactive-card"
                style={{
                  padding: "24px",
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "10px",
                  border: "2px solid " + (selectedStack === stack.id ? "var(--accent)" : "var(--border-glow)"),
                  cursor: "pointer",
                  boxShadow: selectedStack === stack.id ? "0 0 20px rgba(124, 58, 237, 0.15)" : "none"
                }}
              >
                <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--accent)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>{stack.tag}</span>
                <h3 style={{ fontSize: "16px", margin: "0 0 8px 0", color: "#fff" }}>{stack.id}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.4" }}>{stack.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: ACTIONS & LOGS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "start" }}>
          
          {/* Setup Card */}
          <div style={{ backgroundColor: "var(--bg-card)", padding: "32px", borderRadius: "10px", border: "1px solid var(--border-glow)" }}>
            <h3 style={{ fontSize: "16px", margin: "0 0 20px 0", color: "#fff" }}>2. File Customization</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>Project Name (Optional)</label>
              <input 
                type="text"
                placeholder={`e.g., my-custom-${selectedStack.toLowerCase().replace(/\s+/g, '-')}`}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", backgroundColor: "var(--bg-input)", 
                  border: "1px solid var(--border-glow)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "14px"
                }}
              />
            </div>

            <button 
              onClick={handleGenerateProject}
              className="primary-button"
              style={{
                width: "100%", padding: "14px", border: "none",
                borderRadius: "8px", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)"
              }}
            >
              Compile and Download Project ZIP
            </button>
          </div>

          {/* History Panel */}
          <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "10px", border: "1px solid var(--border-glow)", minHeight: "220px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "14px", margin: "0 0 16px 0", color: "#fff" }}>Recent Downloads</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", maxHeight: "160px" }}>
              {history.length === 0 ? (
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>No download history recorded.</span>
              ) : (
                history.map((proj, idx) => (
                  <div key={idx} style={{ paddingBottom: "10px", borderBottom: "1px solid #1f1f23", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "13px", color: "#fff", fontWeight: "500" }}>{proj.nome_projeto}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{proj.tipo_projeto}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}