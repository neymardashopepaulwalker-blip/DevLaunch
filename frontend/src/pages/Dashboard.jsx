import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [historico, setHistorico] = useState([]);
  const [nomeCustomizado, setNomeCustomizado] = useState("");
  const [status, setStatus] = useState("");
  const [statusTipo, setStatusTipo] = useState("info"); // info, success, error
  const [stackSelecionada, setStackSelecionada] = useState("React Boilerplate");
  
  const navigate = useNavigate();
  const idUsuario = localStorage.getItem('usuario_id');
  const nomeUsuario = localStorage.getItem('usuario_nome') || "Developer";
  const emailUsuario = localStorage.getItem('usuario_email') || "";

  const BACKEND_URL = "https://devlaunch-backend-uw21.onrender.com";

  // Mapeamento estável de Strings para o Banco de dados
  const mapeamentoBackend = {
    "React Boilerplate": "REACT.js Module",
    "Node.js API": "Node.js REST API",
    "Discord Bot": "Discord Bot Base"
  };

  // Mock de arquivos estáticos para o Code Preview
  const previewsDasStacks = {
    "React Boilerplate": {
      arquivos: ["src/main.jsx", "src/App.jsx", "src/index.css", "package.json", "vite.config.js"],
      arquivoAtivo: "src/App.jsx",
      codigo: `import React from 'react';\nimport './index.css';\n\nexport default function App() {\n  return (\n    <div className="app-container">\n      <h1>Application Environment Online</h1>\n      <p>Boilerplate engine mounted successfully.</p>\n    </div>\n  );\n}`
    },
    "Node.js API": {
      arquivos: ["server.js", "routes/api.js", "middleware/auth.js", "package.json", ".env.example"],
      arquivoAtivo: "server.js",
      codigo: `const express = require('express');\nconst cors = require('cors');\nconst app = express();\n\napp.use(cors());\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.status(200).json({ status: 'healthy', timestamp: Date.now() });\n});\n\nconst PORT = process.env.PORT || 5000;\napp.listen(PORT, () => console.log(\`Server online on port \${PORT}\`));`
    },
    "Discord Bot": {
      arquivos: ["index.js", "commands/ping.js", "events/ready.js", "package.json", "config.json"],
      arquivoAtivo: "index.js",
      codigo: `const { Client, GatewayIntentBits } = require('discord.js');\nconst client = new Client({ intents: [GatewayIntentBits.Guilds] });\n\nclient.once('ready', () => {\n  console.log(\`Logged in securely as \${client.user.tag}\`);\n});\n\nclient.login(process.env.DISCORD_TOKEN);`
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
      console.error("Failed history synchronization:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGerarProjeto = async () => {
    const nomeFinal = nomeCustomizado.trim() || `Project_${stackSelecionada.replace(/\s+/g, '_')}`;
    setStatus(`Compiling production bundle matrix for ${nomeFinal}...`);
    setStatusTipo("info");

    try {
      const res = await fetch(`${BACKEND_URL}/api/projetos/salvar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: idUsuario, 
          tipo_projeto: mapeamentoBackend[stackSelecionada],
          nome_projeto: nomeFinal
        })
      });

      if (!res.ok) {
        const textoErro = await res.text();
        console.error("Detailed server payload response error:", textoErro);
        throw new Error(`Server returned status ${res.status}. Database schema constraint block.`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nomeFinal}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setStatus(`Success. ${nomeFinal}.zip successfully saved to local device storage.`);
      setStatusTipo("success");
      setNomeCustomizado("");
      carregarHistorico(); 
    } catch (err) {
      setStatus(`Generation Pipeline Error: ${err.message}`);
      setStatusTipo("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-dark-obsidian)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
      
      {/* HEADER DE ALTA ENGENHARIA */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-card-charcoal)" }}>
        <div>
          <span style={{ fontWeight: "700", letterSpacing: "1px", color: "#fff", fontSize: "16px" }}>DEVLAUNCH // WORKSPACE</span>
          <div style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
            Node Identifier: <span style={{ color: "var(--text-primary)" }}>{nomeUsuario}</span> — {emailUsuario}
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", padding: "8px 16px", cursor: "pointer", fontSize: "13px" }}>
          Disconnect
        </button>
      </header>

      {/* NOTIFICAÇÃO DO SISTEMA CORRIGIDA */}
      {status && (
        <div style={{ 
          padding: "16px 40px", 
          backgroundColor: statusTipo === "error" ? "rgba(239, 68, 68, 0.1)" : statusTipo === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(139, 92, 246, 0.1)",
          borderBottom: "1px solid " + (statusTipo === "error" ? "var(--color-error)" : statusTipo === "success" ? "var(--color-success)" : "var(--accent-premium)"),
          color: statusTipo === "error" ? "var(--color-error)" : statusTipo === "success" ? "var(--color-success)" : "var(--accent-premium)",
          fontSize: "13px",
          fontFamily: "monospace"
        }}>
          {status}
        </div>
      )}

      {/* PAINEL CENTRAL DUPLO */}
      <div style={{ display: "grid", gridTemplateColumns: "450px 1fr", flex: 1 }}>
        
        {/* COLUNA ESQUERDA: GERENCIAMENTO */}
        <div style={{ padding: "40px", borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <div>
            <h3 style={{ fontSize: "14px", color: "#fff", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px 0" }}>Select Core Stack</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["React Boilerplate", "Node.js API", "Discord Bot"].map((stack) => (
                <div 
                  key={stack}
                  onClick={() => setStackSelecionada(stack)}
                  style={{
                    padding: "16px",
                    backgroundColor: "var(--bg-card-charcoal)",
                    border: "1px solid " + (stackSelecionada === stack ? "var(--accent-premium)" : "var(--border-subtle)"),
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: stackSelecionada === stack ? "600" : "400",
                    color: stackSelecionada === stack ? "#fff" : "var(--text-secondary)",
                    transition: "all 0.15s ease"
                  }}
                >
                  {stack}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "14px", color: "#fff", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px 0" }}>Configuration</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Output Name Prefix</label>
              <input 
                type="text"
                placeholder="e.g. production-api-v1"
                value={nomeCustomizado}
                onChange={(e) => setNomeCustomizado(e.target.value)}
                style={{
                  width: "100%", padding: "12px", backgroundColor: "var(--bg-input-dark)", 
                  border: "1px solid var(--border-subtle)", color: "#fff", outline: "none", fontSize: "14px"
                }}
              />
            </div>
          </div>

          <button 
            onClick={handleGerarProjeto}
            style={{
              width: "100%", padding: "16px", backgroundColor: "var(--accent-premium)", border: "none",
              color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px"
            }}
          >
            Compile and Stream ZIP
          </button>

          {/* SESSÃO DE LOGS HISTÓRICOS */}
          <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)" }}>
            <h4 style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase", margin: "0 0 12px 0" }}>Historic Deployments ({historico.length})</h4>
            <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {historico.length === 0 ? (
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Registry system idle.</span>
              ) : (
                historico.map((proj, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)", padding: "4px 0" }}>
                    <span style={{ color: "var(--text-primary)", fontFamily: "monospace" }}>&gt; {proj.nome_projeto}</span>
                    <span style={{ color: "var(--text-muted)" }}>{proj.tipo_projeto}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: LIVE ARCHIVE PREVIEW */}
        <div style={{ backgroundColor: "#040306", display: "flex", flexDirection: "column" }}>
          
          {/* Subheader do Preview */}
          <div style={{ padding: "14px 30px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontFamily: "monospace", color: "var(--text-secondary)" }}>
              ARCHIVE_VIEWER // active_target: <span style={{ color: "var(--accent-premium)" }}>{stackSelecionada}</span>
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>STATUS: READ_ONLY</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", flex: 1 }}>
            
            {/* Mini Árvore de Arquivos */}
            <div style={{ borderRight: "1px solid var(--border-subtle)", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Manifest Tree</span>
              {previewsDasStacks[stackSelecionada].arquivos.map((file) => (
                <div 
                  key={file} 
                  style={{ 
                    fontSize: "13px", 
                    fontFamily: "monospace", 
                    color: file === previewsDasStacks[stackSelecionada].arquivoAtivo ? "var(--accent-premium)" : "var(--text-secondary)",
                    padding: "4px 0"
                  }}
                >
                  {file === previewsDasStacks[stackSelecionada].arquivoAtivo ? "• " : "  "} {file}
                </div>
              ))}
            </div>

            {/* Visualizador de Código */}
            <div style={{ padding: "24px 30px", overflow: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", fontFamily: "monospace", color: "var(--text-secondary)" }}>
                  {previewsDasStacks[stackSelecionada].arquivoAtivo}
                </span>
              </div>
              <pre style={{ 
                margin: 0, 
                fontFamily: "Consolas, 'Fira Code', Monaco, monospace", 
                fontSize: "13px", 
                lineHeight: "1.6", 
                color: "#a78bfa", 
                whiteSpace: "pre-wrap" 
              }}>
                {previewsDasStacks[stackSelecionada].codigo}
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}