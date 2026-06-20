import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [historico, setHistorico] = useState([]);
  const [nomeCustomizado, setNomeCustomizado] = useState("");
  const [status, setStatus] = useState("");
  const [statusTipo, setStatusTipo] = useState("info");
  const [stackSelecionada, setStackSelecionada] = useState("React Boilerplate");
  
  const navigate = useNavigate();
  const idUsuario = localStorage.getItem('usuario_id');
  const nomeUsuario = localStorage.getItem('usuario_nome') || "Developer";
  const emailUsuario = localStorage.getItem('usuario_email') || "";

  const BACKEND_URL = "https://devlaunch-backend-uw21.onrender.com";

  const previewsDasStacks = {
    "React Boilerplate": {
      arquivos: ["src/main.jsx", "src/App.jsx", "src/index.css", "package.json"],
      arquivoAtivo: "src/App.jsx",
      codigo: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="container">\n      <h1>Environment Online</h1>\n      <p>React scaffold ready.</p>\n    </div>\n  );\n}`
    },
    "Node.js API": {
      arquivos: ["server.js", "routes/api.js", "package.json", ".env.example"],
      arquivoAtivo: "server.js",
      codigo: `const express = require('express');\nconst cors = require('cors');\nconst app = express();\n\napp.use(cors());\napp.use(express.json());\n\nconst PORT = process.env.PORT || 5000;\napp.listen(PORT, () => console.log('API active'));`
    },
    "Discord Bot": {
      arquivos: ["index.js", "commands/ping.js", "package.json"],
      arquivoAtivo: "index.js",
      codigo: `const { Client, GatewayIntentBits } = require('discord.js');\nconst client = new Client({ intents: [GatewayIntentBits.Guilds] });\n\nclient.once('ready', () => {\n  console.log('Bot is online');\n});\n\nclient.login(process.env.DISCORD_TOKEN);`
    }
  };

  useEffect(() => {
    if (!idUsuario) {
      navigate('/login');
    } else {
      carregarHistorico();
    }
  }, [idUsuario]);

  const carregarHistorico = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/projetos/lista/${idUsuario}`);
      if (res.ok) {
        const dados = await res.json();
        setHistorico(dados.projetos || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGerarProjeto = async () => {
    const nomeFinal = nomeCustomizado.trim() || `Project_${stackSelecionada.replace(/\s+/g, '_')}`;
    setStatus(`Compiling bundle for ${nomeFinal}...`);
    setStatusTipo("info");

    try {
      const res = await fetch(`${BACKEND_URL}/api/projetos/salvar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: idUsuario, 
          tipo_projeto: stackSelecionada,
          nome_projeto: nomeFinal
        })
      });

      if (!res.ok) {
        throw new Error("Generation pipeline failed. Check backend tables.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nomeFinal}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setStatus(`Success. Generated archive saved payload.`);
      setStatusTipo("success");
      setNomeCustomizado("");
      carregarHistorico(); 
    } catch (err) {
      setStatus(err.message);
      setStatusTipo("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-dark)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <div>
          <span style={{ fontWeight: "700", color: "#fff", fontSize: "15px" }}>DevLaunch Workspace</span>
          <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
            Active Session: <span style={{ color: "#fff" }}>{nomeUsuario}</span> ({emailUsuario})
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid var(--border-subtle)", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
          Sign Out
        </button>
      </header>

      {status && (
        <div style={{ 
          padding: "12px 40px", 
          backgroundColor: statusTipo === "error" ? "rgba(239, 68, 68, 0.1)" : statusTipo === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(124, 58, 237, 0.1)",
          borderBottom: "1px solid " + (statusTipo === "error" ? "#ef4444" : statusTipo === "success" ? "#10b981" : "#7c3aed"),
          color: statusTipo === "error" ? "#ef4444" : statusTipo === "success" ? "#10b981" : "#a78bfa",
          fontSize: "13px",
          fontFamily: "monospace"
        }}>
          {status}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", flex: 1 }}>
        <div style={{ padding: "40px", borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "28px" }}>
          <div>
            <h3 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>Select Stack</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["React Boilerplate", "Node.js API", "Discord Bot"].map((stack) => (
                <div 
                  key={stack}
                  onClick={() => setStackSelecionada(stack)}
                  style={{
                    padding: "14px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid " + (stackSelecionada === stack ? "var(--accent-purple)" : "var(--border-subtle)"),
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: stackSelecionada === stack ? "#fff" : "var(--text-muted)"
                  }}
                >
                  {stack}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>Naming Rules</h3>
            <input 
              type="text"
              placeholder="Project name prefix"
              value={nomeCustomizado}
              onChange={(e) => setNomeCustomizado(e.target.value)}
              className="input-premium"
            />
          </div>

          <button onClick={handleGerarProjeto} className="btn-premium">
            Generate Template Package
          </button>

          <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
            <h4 style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", margin: "0 0 12px 0" }}>Historic Runs ({historico.length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "140px", overflowY: "auto" }}>
              {historico.length === 0 ? (
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>No structural history row logged.</span>
              ) : (
                historico.map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ color: "#fff", fontFamily: "monospace" }}>{h.nome_projeto}</span>
                    <span style={{ color: "var(--text-muted)" }}>{h.tipo_projeto}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* COMPONENTE DE PREVIEW REAL DO CÓDIGO */}
        <div style={{ backgroundColor: "#050507", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--border-subtle)", fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
            LIVE SCANNER // targets: <span style={{ color: "#fff" }}>{stackSelecionada}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", flex: 1 }}>
            <div style={{ borderRight: "1px solid var(--border-subtle)", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Structure</span>
              {previewsDasStacks[stackSelecionada].arquivos.map((f) => (
                <div key={f} style={{ fontSize: "13px", fontFamily: "monospace", color: f === previewsDasStacks[stackSelecionada].arquivoAtivo ? "var(--accent-purple)" : "var(--text-muted)" }}>
                  {f === previewsDasStacks[stackSelecionada].arquivoAtivo ? "→ " : "  "} {f}
                </div>
              ))}
            </div>

            <div style={{ padding: "24px", overflow: "auto" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", fontFamily: "monospace" }}>
                {previewsDasStacks[stackSelecionada].arquivoAtivo}
              </div>
              <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "13px", lineHeight: "1.6", color: "#c084fc", whiteSpace: "pre-wrap" }}>
                {previewsDasStacks[stackSelecionada].codigo}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}