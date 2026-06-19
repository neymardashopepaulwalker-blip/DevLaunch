import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // --- ESTADOS DE NAVEGAÇÃO E TEMA ---
  const [abaAtiva, setAbaAtiva] = useState("gerador"); // gerador, historico, configs
  const [temaDark, setTemaDark] = useState(true);
  
  // --- ESTADOS DO APP ---
  const [status, setStatus] = useState("");
  const [projetoSelecionado, setProjetoSelecionado] = useState("React Boilerplate");
  const [arquivoAtivo, setArquivoAtivo] = useState("App.jsx");
  const [historico, setHistorico] = useState([]);
  const [nomeCustomizado, setNomeCustomizado] = useState("");
  
  // --- ESTADOS DE CONFIGURAÇÃO ---
  const [novaSenha, setNovaSenha] = useState("");
  const [msgConfig, setMsgConfig] = useState("");

  const nomeUsuario = localStorage.getItem("usuario_nome") || "Desenvolvedor";
  const emailUsuario = "alan.george@exemplo.com"; // Simulação, poderia vir do login
  const idUsuario = localStorage.getItem("usuario_id");

  useEffect(() => {
    if (!idUsuario) navigate("/login");
    else carregarHistorico();
  }, [idUsuario]);

  const carregarHistorico = async () => {
    try {
      const resposta = await fetch(`https://devlaunch-backend-uw21.onrender.com/api/projetos/lista/${idUsuario}`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setHistorico(dados.projetos || []);
      }
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const alternarSenha = async () => {
    if (!novaSenha) return;
    const resp = await fetch("https://devlaunch-backend-uw21.onrender.com/api/auth/mudar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: idUsuario, novaSenha })
    });
    if (resp.ok) {
      setMsgConfig("✅ Senha alterada!");
      setNovaSenha("");
    }
  };

  const handleGerarProjeto = async (tipo) => {
    const nomeFinal = nomeCustomizado.trim() || `Meu_${tipo.replace(/\s+/g, '_')}`;
    setStatus(`⏳ Baixando ${nomeFinal}...`);
    try {
      const resposta = await fetch("https://devlaunch-backend-uw21.onrender.com/api/projetos/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: idUsuario, tipo_projeto: tipo, nome_projeto: nomeFinal }),
      });
      const blob = await resposta.blob();
      const urlLink = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlLink;
      link.setAttribute('download', `${nomeFinal}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus(`✅ Download concluído!`);
      setNomeCustomizado("");
      carregarHistorico();
      setTimeout(() => setStatus(""), 3000);
    } catch (err) { setStatus("❌ Erro no download"); }
  };

  const templatesPreview = {
    "React Boilerplate": {
      "App.jsx": `export default function App() {\n  return <h1>DevLaunch React! 🚀</h1>\n}`,
      "package.json": `{\n  "name": "react-app",\n  "version": "1.0.0"\n}`
    },
    "Bot de Discord": {
      "index.js": `const { Client } = require('discord.js');\nconsole.log('Bot Online!');`,
      "package.json": `{\n  "name": "discord-bot",\n  "version": "1.0.0"\n}`
    },
    "API Node.js": {
      "server.js": `const express = require('express');\nconst app = express();\napp.listen(5000);`,
      "package.json": `{\n  "name": "node-api",\n  "version": "1.0.0"\n}`
    }
  };

  // --- CORES DINÂMICAS (TEMA) ---
  const cores = {
    bg: temaDark ? "#090d16" : "#f8fafc",
    sidebar: temaDark ? "#0f172a" : "#ffffff",
    texto: temaDark ? "#f8fafc" : "#0f172a",
    borda: temaDark ? "#1e293b" : "#e2e8f0",
    card: temaDark ? "#0f172a" : "#ffffff",
    input: temaDark ? "#090d16" : "#f1f5f9"
  };

  return (
    <div style={{ ...styles.container, backgroundColor: cores.bg, color: cores.texto }}>
      
      {/* 🟢 SIDEBAR (BARRA LATERAL) */}
      <aside style={{ ...styles.sidebar, backgroundColor: cores.sidebar, borderColor: cores.borda }}>
        <div style={styles.logo}>DevLaunch 🚀</div>
        <nav style={styles.nav}>
          <button onClick={() => setAbaAtiva("gerador")} style={{ ...styles.navItem, color: abaAtiva === "gerador" ? "#38bdf8" : "#64748b" }}>🏠 Início</button>
          <button onClick={() => setAbaAtiva("historico")} style={{ ...styles.navItem, color: abaAtiva === "historico" ? "#38bdf8" : "#64748b" }}>📜 Histórico</button>
          <button onClick={() => setAbaAtiva("configuracoes")} style={{ ...styles.navItem, color: abaAtiva === "configuracoes" ? "#38bdf8" : "#64748b" }}>⚙️ Ajustes</button>
        </nav>
        
        <div style={styles.sidebarFooter}>
          <button onClick={() => setTemaDark(!temaDark)} style={styles.themeBtn}>
            {temaDark ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
          </button>
        </div>
      </aside>

      {/* 🔵 CONTEÚDO PRINCIPAL */}
      <main style={styles.mainContent}>
        <header style={styles.topHeader}>
          <span>Painel / <strong>{abaAtiva.toUpperCase()}</strong></span>
          <div style={styles.userBadge}>{nomeUsuario[0]}</div>
        </header>

        {status && <div style={styles.statusToast}>{status}</div>}

        {/* --- ABA: GERADOR --- */}
        {abaAtiva === "gerador" && (
          <div style={styles.fadeAnim}>
            <div style={styles.gridGerador}>
              <section style={styles.colCards}>
                <h2 style={styles.title}>Templates ⚡</h2>
                <input 
                  style={{ ...styles.input, backgroundColor: cores.input, borderColor: cores.borda, color: cores.texto }}
                  placeholder="Nome do seu projeto..."
                  value={nomeCustomizado}
                  onChange={(e) => setNomeCustomizado(e.target.value)}
                />
                {Object.keys(templatesPreview).map(tipo => (
                  <div key={tipo} onClick={() => { setProjetoSelecionado(tipo); setArquivoAtivo(Object.keys(templatesPreview[tipo])[0]) }} 
                    style={{ ...styles.card, backgroundColor: cores.card, borderColor: projetoSelecionado === tipo ? "#38bdf8" : cores.borda }}>
                    <span>{tipo}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleGerarProjeto(tipo); }} style={styles.miniBtn}>Baixar</button>
                  </div>
                ))}
              </section>

              <section style={styles.colPreview}>
                <div style={styles.editor}>
                  <div style={styles.editorTabs}>
                    {Object.keys(templatesPreview[projetoSelecionado]).map(arq => (
                      <button key={arq} onClick={() => setArquivoAtivo(arq)} 
                        style={{ ...styles.editorTab, borderBottom: arquivoAtivo === arq ? "2px solid #38bdf8" : "none" }}>{arq}</button>
                    ))}
                  </div>
                  <pre style={styles.pre}><code>{templatesPreview[projetoSelecionado][arquivoAtivo]}</code></pre>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* --- ABA: HISTÓRICO --- */}
        {abaAtiva === "historico" && (
          <div style={styles.fadeAnim}>
            <h2 style={styles.title}>Seu Histórico 📦</h2>
            <div style={styles.listContainer}>
              {historico.map(p => (
                <div key={p.id} style={{ ...styles.histItem, backgroundColor: cores.card, borderColor: cores.borda }}>
                  <div><strong>{p.nome_projeto}</strong> <br/> <small>{p.tipo_projeto}</small></div>
                  <span>{new Date(p.criado_em).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ABA: CONFIGURAÇÕES --- */}
        {abaAtiva === "configuracoes" && (
          <div style={styles.fadeAnim}>
            <h2 style={styles.title}>Configurações da Conta ⚙️</h2>
            <div style={{ ...styles.configCard, backgroundColor: cores.card, borderColor: cores.borda }}>
              <p><strong>Nome:</strong> {nomeUsuario}</p>
              <p><strong>E-mail:</strong> {emailUsuario}</p>
              <hr style={{ borderColor: cores.borda, margin: "20px 0" }}/>
              
              <h3>Mudar Senha</h3>
              <input 
                type="password" 
                style={{ ...styles.input, backgroundColor: cores.input, borderColor: cores.borda, color: cores.texto }}
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <button onClick={alternarSenha} style={styles.saveBtn}>Salvar Nova Senha</button>
              {msgConfig && <p style={{ color: "#34d399", fontSize: "14px", marginTop: "10px" }}>{msgConfig}</p>}

              <hr style={{ borderColor: cores.borda, margin: "20px 0" }}/>
              <button onClick={handleLogout} style={styles.logoutBtnFull}>Encerrar Sessão (Sair)</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", transition: "0.3s" },
  sidebar: { width: "260px", borderRight: "1px solid", display: "flex", flexDirection: "column", padding: "30px 20px" },
  logo: { fontSize: "22px", fontWeight: "bold", marginBottom: "40px" },
  nav: { display: "flex", flexDirection: "column", gap: "10px", flex: 1 },
  navItem: { backgroundColor: "transparent", border: "none", textAlign: "left", fontSize: "16px", padding: "12px", cursor: "pointer", fontWeight: "600" },
  sidebarFooter: { marginTop: "auto" },
  themeBtn: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #334155", cursor: "pointer", backgroundColor: "transparent", color: "inherit" },
  
  mainContent: { flex: 1, padding: "40px", overflowY: "auto" },
  topHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", color: "#64748b" },
  userBadge: { width: "35px", height: "35px", backgroundColor: "#38bdf8", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  
  title: { fontSize: "28px", fontWeight: "800", marginBottom: "20px" },
  statusToast: { position: "fixed", top: "20px", right: "20px", backgroundColor: "#38bdf8", color: "#000", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", zIndex: 2000 },
  
  gridGerador: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px" },
  colCards: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid", outline: "none", marginBottom: "10px" },
  card: { padding: "20px", borderRadius: "12px", border: "1px solid", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
  miniBtn: { backgroundColor: "#38bdf8", border: "none", color: "#000", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" },
  
  colPreview: { display: "flex", flexDirection: "column" },
  editor: { backgroundColor: "#030712", borderRadius: "12px", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #1e293b" },
  editorTabs: { display: "flex", backgroundColor: "#0f172a", padding: "0 10px" },
  editorTab: { backgroundColor: "transparent", border: "none", color: "#64748b", padding: "10px 15px", cursor: "pointer", fontSize: "12px" },
  pre: { padding: "20px", color: "#38bdf8", fontSize: "14px", overflow: "auto", margin: 0 },

  listContainer: { display: "flex", flexDirection: "column", gap: "10px" },
  histItem: { padding: "15px 20px", borderRadius: "10px", border: "1px solid", display: "flex", justifyContent: "space-between", alignItems: "center" },
  
  configCard: { padding: "30px", borderRadius: "15px", border: "1px solid", maxWidth: "500px" },
  saveBtn: { backgroundColor: "#38bdf8", color: "#000", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  logoutBtnFull: { width: "100%", backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },

  fadeAnim: { animation: "fadeIn 0.3s ease-in-out" }
};