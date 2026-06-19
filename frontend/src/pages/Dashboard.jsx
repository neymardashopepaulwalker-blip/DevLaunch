import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [historico, setHistorico] = useState([]);
  const [nomeCustomizado, setNomeCustomizado] = useState("");
  const [status, setStatus] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [msgConfig, setMsgConfig] = useState("");
  
  const navigate = useNavigate();

  // Legacy keys you trust
  const idUsuario = localStorage.getItem('usuario_id');
  const nomeUsuario = localStorage.getItem('usuario_nome') || "User";
  const emailUsuario = localStorage.getItem('usuario_email') || "";

  const BACKEND_URL = "https://devlaunch-backend-uw21.onrender.com";

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
      console.error("Error loading history:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleMudarSenha = async (e) => {
    e.preventDefault();
    if (!novaSenha) return setMsgConfig("❌ Type a new password.");
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/mudar-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: idUsuario, novaSenha })
      });
      if (res.ok) {
        setMsgConfig("✅ Password updated successfully!");
        setNovaSenha("");
      } else {
        setMsgConfig("❌ Error updating password.");
      }
    } catch (err) {
      setMsgConfig("❌ Connection error.");
    }
  };

  const handleGerarProjeto = async (tipo) => {
    const nomeFinal = nomeCustomizado.trim() || `My_${tipo.replace(/\s+/g, '_')}`;
    setStatus(`⏳ Generating ${nomeFinal}...`);

    try {
      const res = await fetch(`${BACKEND_URL}/api/projetos/salvar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: idUsuario, 
          tipo_projeto: tipo,
          nome_projeto: nomeFinal
        })
      });

      if (!res.ok) throw new Error("Server error.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nomeFinal}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setStatus(`✅ Downloaded successfully!`);
      setNomeCustomizado("");
      carregarHistorico(); 
    } catch (err) {
      setStatus("❌ Server Error generating ZIP.");
    }
  };

  return (
    <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      
      {/* 🟢 WORKBENCH HEADER: Simplified, Uppercase Utility */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px', borderBottom: '2px solid rgba(56, 189, 248, 0.1)', paddingBottom: '30px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.4rem' }}>DevLaunch Workbench</h1>
          <p style={{ color: '#fff', fontSize: '15px', margin: 0 }}>
            Session Active: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{nomeUsuario}</span> ({emailUsuario})
          </p>
        </div>
        <button onClick={handleLogout} className="btn-error" style={{ width: 'auto', padding: '10px 20px', fontWeight: 'bold', fontSize: '14px' }}>Sign Out</button>
      </div>

      {status && <div style={{ backgroundColor: '#0c0e18', padding: '15px', borderRadius: '0', marginBottom: '25px', border: '2px solid #38bdf8', color: '#38bdf8', fontWeight: 'bold' }}>{status}</div>}

      {/* WORKBENCH CORE: Grid Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        
        {/*LEFT PANEL: Project Generator */}
        <div className="workbench-panel">
          <h2 style={{ marginBottom: '25px', color: '#00ff66', letterSpacing: '2px' }}>Generate Project Module</h2>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', fontSize: '13px' }}>Project Prefix (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. neymardashopepaulwalker-blip" 
              value={nomeCustomizado} 
              onChange={(e) => setNomeCustomizado(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button onClick={() => handleGerarProjeto("React Boilerplate")}>REACT.js Module</button>
            <button onClick={() => handleGerarProjeto("Node.js API")}>Node.js REST API</button>
            <button onClick={() => handleGerarProjeto("Discord Bot")}>Discord Bot Base</button>
          </div>
        </div>

        {/* 📦 RIGHT PANEL: Log History & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="workbench-panel">
            <h3 style={{ marginBottom: '20px', color: '#fff', letterSpacing: '1px' }}>Project Logs ({historico.length})</h3>
            <div style={{ backgroundColor: '#0c0e18', border: '1px solid #1e293b', padding: '20px', maxHeight: '300px', overflowY: 'auto' }}>
              {historico.length === 0 ? (
                <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Log is currently empty.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {historico.map((p, i) => (
                    <li key={i} style={{ padding: '15px', backgroundColor: '#12122b', borderLeft: '3px solid #00ff66', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ maxWidth: '65%' }}>
                        <strong style={{ color: '#00ff66', fontSize: '15px', display: 'block', wordWrap: 'break-word' }}>{p.nome_projeto}</strong>
                        <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>TYPE: {p.tipo_projeto}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{p.criado_em ? new Date(p.criado_em).toLocaleDateString() : 'Active'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Account Integrity Section */}
          <div className="workbench-panel">
            <h3 style={{ marginBottom: '20px', color: '#fff', letterSpacing: '1px' }}>Account Settings</h3>
            <form onSubmit={handleMudarSenha} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="password" 
                placeholder="New Integrity Password" 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <button type="submit" style={{ padding: '10px 20px', border: '2px solid #334155', color: '#94a3b8' }}>Update Credentials</button>
            </form>
            {msgConfig && <p style={{ fontSize: '14px', marginTop: '15px', color: msgConfig.includes('❌') ? '#ff0033' : '#00ff66' }}>{msgConfig}</p>}
          </div>

        </div>

      </div>
    </div>
  );
}