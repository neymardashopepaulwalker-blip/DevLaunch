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

  const BACKEND_URL = "https://devlaunch-backend-uw21.onrender.com";

  const mapeamentoBackend = {
    "React Boilerplate": "REACT.js Module",
    "Node.js API": "Node.js REST API",
    "Discord Bot": "Discord Bot Base"
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
      console.error("Erro ao sincronizar histórico:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGerarProjeto = async () => {
    const nomeFinal = nomeCustomizado.trim() || `Project_${stackSelecionada.replace(/\s+/g, '_')}`;
    setStatus(`Compilando os arquivos do projeto ${nomeFinal}...`);
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

      if (!res.ok) throw new Error("Erro na geração do build no servidor.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nomeFinal}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setStatus(`Pronto! O arquivo ${nomeFinal}.zip foi baixado com sucesso.`);
      setStatusTipo("success");
      setNomeCustomizado("");
      carregarHistorico(); 
    } catch (err) {
      setStatus(`Erro no pipeline de download: ${err.message}`);
      setStatusTipo("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* NAVBAR CLEAN */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid var(--border-glow)", backgroundColor: "var(--bg-card)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--accent)" }}></div>
          <span style={{ fontWeight: "700", fontSize: "15px", letterSpacing: "0.5px" }}>DEVLAUNCH</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Olá, <strong style={{ color: "#fff" }}>{nomeUsuario}</strong></span>
          <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid var(--border-glow)", color: "var(--text-main)", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
            Sair
          </button>
        </div>
      </nav>

      {/* BANNER DE STATUS DISCRETO */}
      {status && (
        <div style={{ 
          padding: "12px 40px", 
          backgroundColor: statusTipo === "error" ? "rgba(239, 68, 68, 0.08)" : statusTipo === "success" ? "rgba(16, 185, 129, 0.08)" : "rgba(124, 58, 237, 0.08)",
          borderBottom: "1px solid " + (statusTipo === "error" ? "#ef4444" : statusTipo === "success" ? "#10b981" : "var(--accent)"),
          color: statusTipo === "error" ? "#f87171" : statusTipo === "success" ? "#34d399" : "#a78bfa",
          fontSize: "13px", textAlign: "center"
        }}>
          {status}
        </div>
      )}

      {/* ÁREA CENTRAL - DESIGN DE GRID COMPACTO */}
      <div style={{ maxWidth: "1000px", width: "100%", margin: "40px auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: "32px" }}>
        
        {/* SESSÃO 1: SELEÇÃO DA STACK EM CARDS */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>1. Escolha a Infraestrutura Base</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[
              { id: "React Boilerplate", desc: "Ambiente React estruturado via Vite com gerenciamento de rotas básico.", tag: "FRONTEND" },
              { id: "Node.js API", desc: "Motor Express estruturado com tratamento de CORS e rotas modulares.", tag: "BACKEND" },
              { id: "Discord Bot", desc: "Arquitetura base isolada para bots de Discord integrada ao Discord.js.", tag: "AUTOMATION" }
            ].map((stack) => (
              <div 
                key={stack.id}
                onClick={() => setStackSelecionada(stack.id)}
                style={{
                  padding: "24px",
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "10px",
                  border: "2px solid " + (stackSelecionada === stack.id ? "var(--accent)" : "var(--border-glow)"),
                  cursor: "pointer",
                  boxShadow: stackSelecionada === stack.id ? "0 0 20px rgba(124, 58, 237, 0.15)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--accent)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>{stack.tag}</span>
                <h3 style={{ fontSize: "16px", margin: "0 0 8px 0", color: "#fff" }}>{stack.id}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: "1.4" }}>{stack.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SESSÃO 2: CONFIGURAÇÃO E ENVIO */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", alignItems: "start" }}>
          
          {/* Card Principal de Setup */}
          <div style={{ backgroundColor: "var(--bg-card)", padding: "32px", borderRadius: "10px", border: "1px solid var(--border-glow)" }}>
            <h3 style={{ fontSize: "16px", margin: "0 0 20px 0" }}>2. Customização do Arquivo</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>Nome do Projeto (Opcional)</label>
              <input 
                type="text"
                placeholder={`Ex: meu-projeto-${stackSelecionada.toLowerCase().replace(/\s+/g, '-')}`}
                value={nomeCustomizado}
                onChange={(e) => setNomeCustomizado(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", backgroundColor: "var(--bg-input)", 
                  border: "1px solid var(--border-glow)", borderRadius: "8px", color: "#fff", outline: "none", fontSize: "14px"
                }}
              />
            </div>

            <button 
              onClick={handleGerarProjeto}
              style={{
                width: "100%", padding: "14px", backgroundColor: "var(--accent)", border: "none",
                borderRadius: "8px", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)", transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "var(--accent-hover)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "var(--accent)"}
            >
              Compilar e Baixar ZIP do Projeto
            </button>
          </div>

          {/* Card Lateral de Histórico */}
          <div style={{ backgroundColor: "var(--bg-card)", padding: "24px", borderRadius: "10px", border: "1px solid var(--border-glow)", minHeight: "220px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "14px", margin: "0 0 16px 0", color: "#fff" }}>Downloads Recentes</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", maxThight: "160px" }}>
              {historico.length === 0 ? (
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>Nenhum download registrado.</span>
              ) : (
                historico.map((proj, idx) => (
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