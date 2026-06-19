import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IconSet = ({ icon }) => {
  const styles = { width: "20px", height: "20px", marginRight: "12px", fill: "currentColor" };
  const viewbox = "0 0 24 24";

  if (icon === "home") return (
    <svg style={styles} viewBox={viewbox}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
  );
  if (icon === "settings") return (
    <svg style={styles} viewBox={viewbox}><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.13,5.91,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.81,11.68,4.81,12c0,0.32,0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.5c-1.93,0-3.5-1.57-3.5-3.5 s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.93,15.5,12,15.5z"/></svg>
  );
  if (icon === "rocket") return (
    <svg style={styles} viewBox={viewbox}><path d="M12.6,3C11.5,4.7,11,6.8,11,9l-5,5H3v1.6l2.1,1.5l2.1-2.1c0.7,0.7,1.5,1.4,2.4,1.8l-2.1,2.1h1.6V16l5-5c2.2,0,4.3-0.5,6-1.6c0.9-0.6,1.4-1.5,1.4-2.4c0-1.8-1.3-3-2.6-3C13.4,2,13,2.4,12.6,3 M9,11C8.4,11,8,10.6,8,10c0-0.6,0.4-1,1-1s1,0.4,1,1C10,10.6,9.6,11,9,11"/></svg>
  );
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("home"); 
  const [temaDark, setTemaDark] = useState(true);
  const [status, setStatus] = useState("");
  const [historico, setHistorico] = useState([]);
  const [nomeCustomizado, setNomeCustomizado] = useState("");

  const [novaSenha, setNovaSenha] = useState("");
  const [msgConfig, setMsgConfig] = useState("");

  const nomeUsuario = localStorage.getItem("usuario_nome") || "User";
  const emailUsuario = localStorage.getItem("usuario_email") || "No email provided";
  const idUsuario = localStorage.getItem("usuario_id");

  const BACKEND_URL = "https://devlaunch-backend-uw21.onrender.com";

  useEffect(() => {
    if (!idUsuario) {
      navigate("/login");
    } else {
      carregarHistorico();
    }
  }, [idUsuario]);

  const carregarHistorico = async () => {
    if (!idUsuario) return;
    try {
      const resposta = await fetch(`${BACKEND_URL}/api/projetos/lista/${idUsuario}`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setHistorico(dados.projetos || []);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAlterarSenha = async () => {
    if (!novaSenha) {
      setMsgConfig("❌ Please, type your new password.");
      return;
    }
    
    try {
      const resposta = await fetch(`${BACKEND_URL}/api/auth/mudar-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: idUsuario, novaSenha }),
      });

      if (!resposta.ok) throw new Error("Failed to change password.");

      setMsgConfig("✅ Password changed successfully!");
      setNovaSenha("");
      setTimeout(() => setMsgConfig(""), 4000);
    } catch (err) {
      setMsgConfig(`❌ Error: ${err.message}`);
    }
  };

  const handleGerarProjeto = async (tipo) => {
    const nomeFinal = nomeCustomizado.trim() || `My_${tipo.replace(/\s+/g, '_')}`;
    setStatus(`⏳ Generating and downloading ${nomeFinal}...`);

    try {
      const resposta = await fetch(`${BACKEND_URL}/api/projetos/salvar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: idUsuario,
          tipo_projeto: tipo,
          nome_projeto: nomeFinal
        }),
      });

      if (!resposta.ok) throw new Error("Server error generating file.");

      const blob = await resposta.blob();
      const urlLink = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlLink;
      link.setAttribute('download', `${nomeFinal}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove(); 

      setStatus(`✅ Success! ${nomeFinal} downloaded!`);
      setNomeCustomizado("");
      carregarHistorico();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  const templatesPreview = {
    "React Boilerplate": { icon: "⚛️", desc: "SPA structure with clean routing and ready-to-use App component." },
    "Discord Bot": { icon: "🤖", desc: "Robust Node.js template using discord.js v14." },
    "Node.js API": { icon: "🌐", desc: "Structured REST architecture with Express and CORS enabled." }
  };

  const colors = {
    bg: temaDark ? "#090d16" : "#f8fafc",
    sidebar: temaDark ? "#0f172a" : "#ffffff",
    card: temaDark ? "#0f172a" : "#ffffff",
    texto: temaDark ? "#f8fafc" : "#0f172a",
    subtitle: temaDark ? "#64748b" : "#94a3b8",
    borda: temaDark ? "#1e293b" : "#e2e8f0"
  };

  return (
    <div style={{ ...styles.container, backgroundColor: colors.bg, color: colors.texto }}>
      <aside style={{ ...styles.sidebar, backgroundColor: colors.sidebar, borderColor: colors.borda }}>
        <div style={styles.logoContainer}>DevLaunch <IconSet icon="rocket" /></div>
        <nav style={styles.nav}>
          <button onClick={() => setActiveTab("home")} style={{ ...styles.navLink, ...(activeTab === "home" ? styles.navLinkActive : styles.navLinkInactive) }}><IconSet icon="home" /> Main Dashboard</button>
          <button onClick={() => setActiveTab("settings")} style={{ ...styles.navLink, ...(activeTab === "settings" ? styles.navLinkActive : styles.navLinkInactive) }}><IconSet icon="settings" /> Settings</button>
        </nav>
        <div style={styles.sidebarFooter}>
          <button onClick={() => setTemaDark(!temaDark)} style={styles.themeBtn}>{temaDark ? "☀️ Light Mode" : "🌙 Dark Mode"}</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
        </div>
      </aside>

      <main style={styles.main}>
        {status && <div style={styles.statusBox}>{status}</div>}

        {activeTab === "home" && (
          <div style={styles.contentFade}>
            <header style={styles.mainHeader}>
              <h1 style={styles.title}>Hello, <span style={styles.nameHighlight}>{nomeUsuario}</span>! 👋</h1>
              <p style={{ ...styles.subtitle, color: colors.subtitle }}>What are we coding today? Total generated: {historico.length}</p>
            </header>
            <div style={styles.inputCustomName}>
              <label style={styles.inputLabel}>Custom Project Name (Optional)</label>
              <input type="text" placeholder="e.g. MyAwesomeBot..." value={nomeCustomizado} onChange={(e) => setNomeCustomizado(e.target.value)} style={{ ...styles.customInput, backgroundColor: colors.bg, borderColor: colors.borda, color: colors.texto }} />
            </div>
            <div style={styles.gridTemplates}>
              {Object.keys(templatesPreview).map(tipo => (
                <div key={tipo} style={{ ...styles.templateCard, backgroundColor: colors.card, borderColor: colors.borda }}>
                  <div style={styles.cardHeader}>
                    <span style={styles.templateIcon}>{templatesPreview[tipo].icon}</span>
                    <h3 style={styles.cardTitle}>{tipo}</h3>
                  </div>
                  <p style={{ ...styles.cardDesc, color: colors.subtitle }}>{templatesPreview[tipo].desc}</p>
                  <button onClick={() => handleGerarProjeto(tipo)} style={styles.downloadBtn}>Download .ZIP</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div style={styles.contentFade}>
            <header style={styles.mainHeader}>
              <h1 style={styles.title}>Account Settings ⚙️</h1>
              <p style={{ ...styles.subtitle, color: colors.subtitle }}>Manage your profile data and access security.</p>
            </header>
            <div style={{ ...styles.settingsCardContainer, backgroundColor: colors.card, borderColor: colors.borda }}>
              <div style={styles.settingsGroup}>
                <div style={styles.settingsDataRow}><label style={styles.settingsDataLabel}>Full Name:</label><span style={styles.settingsDataValue}>{nomeUsuario}</span></div>
                <div style={styles.settingsDataRow}><label style={styles.settingsDataLabel}>Registered Email:</label><span style={styles.settingsDataValue}>{emailUsuario}</span></div>
              </div>
              <div style={{ ...styles.settingsSeparator, borderColor: colors.borda }} />
              <div style={styles.mudarSenhaArea}>
                <h3 style={styles.settingsSectionTitle}>Change Password</h3>
                <div style={styles.formMudarSenhaColumn}>
                  <input type="password" placeholder="New secret password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} style={styles.settingsInput} />
                  <button onClick={handleAlterarSenha} style={styles.savePasswordBtn}>Save New Password</button>
                </div>
                {msgConfig && <div style={styles.settingsAlert}>{msgConfig}</div>}
              </div>
              <div style={{ ...styles.settingsSeparator, borderColor: colors.borda }} />
              <div style={styles.finalActionsSettings}>
                <button onClick={handleLogout} style={styles.logoutSettingsBtn}>Sign Out</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  sidebar: { width: "270px", display: "flex", flexDirection: "column", padding: "30px 20px", borderRight: "1px solid", position: "fixed", top: 0, left: 0, height: "100vh" },
  logoContainer: { fontSize: "20px", fontWeight: "900", color: "#38bdf8", marginBottom: "40px", display: "flex", alignItems: "center" },
  nav: { display: "flex", flexDirection: "column", gap: "12px", flex: 1 },
  navLink: { backgroundColor: "transparent", border: "none", display: "flex", alignItems: "center", padding: "12px", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" },
  navLinkInactive: { color: "#64748b" },
  navLinkActive: { color: "#38bdf8", backgroundColor: "#0f172a", boxShadow: "0 0 10px rgba(56, 189, 248, 0.1)" },
  sidebarFooter: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" },
  themeBtn: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #1e293b", cursor: "pointer", backgroundColor: "transparent", color: "inherit" },
  logoutBtn: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ef4444", backgroundColor: "transparent", color: "#ef4444", fontWeight: "bold", cursor: "pointer" },
  main: { flex: 1, padding: "50px", marginLeft: "270px" },
  contentFade: { animation: "fadeIn 0.3s ease-in-out" },
  mainHeader: { marginBottom: "40px", textAlign: "left" },
  title: { fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "8px" },
  subtitle: { fontSize: "15px", margin: 0 },
  statusBox: { position: "fixed", bottom: "30px", right: "30px", backgroundColor: "#0f172a", color: "#38bdf8", border: "1px solid #38bdf8", padding: "15px 30px", borderRadius: "10px", fontWeight: "bold", zIndex: 1000 },
  nameHighlight: { color: "#38bdf8" },
  inputCustomName: { marginBottom: "30px", textAlign: "left", maxWidth: "400px" },
  inputLabel: { display: "block", fontSize: "13px", fontWeight: "700", color: "#94a3b8", marginBottom: "8px" },
  customInput: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid", outline: "none" },
  gridTemplates: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" },
  templateCard: { padding: "30px", borderRadius: "12px", border: "1px solid", textAlign: "left", display: "flex", flexDirection: "column" },
  cardHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  templateIcon: { fontSize: "28px" },
  cardTitle: { fontSize: "18px", fontWeight: "700", margin: 0 },
  cardDesc: { fontSize: "14px", lineHeight: "1.6", flex: 1, marginBottom: "20px" },
  downloadBtn: { width: "100%", backgroundColor: "#38bdf8", color: "#090d16", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" },
  settingsCardContainer: { maxWidth: "600px", padding: "40px", borderRadius: "15px", border: "1px solid", textAlign: "left" },
  settingsGroup: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" },
  settingsDataRow: { display: "flex", gap: "10px", fontSize: "15px" },
  settingsDataLabel: { color: "#64748b", fontWeight: "500", minWidth: "140px" },
  settingsDataValue: { color: "#38bdf8", fontWeight: "600" },
  settingsSeparator: { borderTop: "1px solid", margin: "20px 0" },
  mudarSenhaArea: { marginTop: "30px", marginBottom: "30px" },
  settingsSectionTitle: { fontSize: "18px", fontWeight: "800", color: "#fff", marginBottom: "20px" },
  formMudarSenhaColumn: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "350px" },
  settingsInput: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", outline: "none", fontSize: "14px", backgroundColor: "#090d16", color: "#fff" },
  savePasswordBtn: { backgroundColor: "#38bdf8", color: "#090d16", border: "none", padding: "12px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },
  settingsAlert: { backgroundColor: "#1e293b", padding: "10px", borderRadius: "6px", color: "#38bdf8", fontSize: "13px", marginTop: "10px", border: "1px solid #38bdf8" },
  finalActionsSettings: { display: "flex", justifyContent: "flex-end", marginTop: "20px" },
  logoutSettingsBtn: { backgroundColor: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" },
};