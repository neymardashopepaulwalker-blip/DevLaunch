import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [historico, setHistorico] = useState([]);
  const [nomeCustomizado, setNomeCustomizado] = useState("");
  const [status, setStatus] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [msgConfig, setMsgConfig] = useState("");
  
  const navigate = useNavigate();

  // Chaves originais que você usava
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
          usuario_id: idUsuario, // Garante que o ID vai pro Supabase não dar erro!
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
      carregarHistorico(); // Atualiza a sua lista na hora
    } catch (err) {
      setStatus("❌ Server Error generating ZIP.");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#090d16', minHeight: '100vh' }}>
      
      {/* HEADER ANTIGO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <div>
          <h2>DevLaunch Workspace 🚀</h2>
          <p style={{ color: '#94a3b8' }}>Welcome back, <b>{nomeUsuario}</b> ({emailUsuario})</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sign Out</button>
      </div>

      {status && <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #38bdf8', color: '#38bdf8', fontWeight: 'bold' }}>{status}</div>}

      {/* RENDERIZADOR DE EVENTOS / GERADOR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* LADO ESQUERDO: GERAR PROJETOS */}
        <div>
          <h3 style={{ marginBottom: '20px' }}>Generate New Project</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Project Name (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. MyAmazingApp" 
              value={nomeCustomizado} 
              onChange={(e) => setNomeCustomizado(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => handleGerarProjeto("React Boilerplate")} style={{ padding: '15px', backgroundColor: '#38bdf8', color: '#090d16', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>⚛️ React Boilerplate</button>
            <button onClick={() => handleGerarProjeto("Node.js API")} style={{ padding: '15px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>🌐 Node.js REST API</button>
            <button onClick={() => handleGerarProjeto("Discord Bot")} style={{ padding: '15px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>🤖 Discord Bot Base</button>
          </div>
        </div>

        {/* LADO DIREITO: HISTÓRICO ANTIGO */}
        <div>
          <h3 style={{ marginBottom: '20px' }}>Project History ({historico.length})</h3>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px', maxHeight: '300px', overflowY: 'auto' }}>
            {historico.length === 0 ? (
              <p style={{ color: '#64748b', margin: 0 }}>No projects generated yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {historico.map((p, i) => (
                  <li key={i} style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#38bdf8' }}>{p.nome_projeto}</strong>
                      <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>{p.tipo_projeto}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{p.criado_em ? new Date(p.criado_em).toLocaleDateString() : 'Ready'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* AJUSTE DE SENHA DO SEU LAYOUT ANTIGO */}
          <div style={{ marginTop: '40px', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
            <h3>Account Settings</h3>
            <form onSubmit={handleMudarSenha} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <input 
                type="password" 
                placeholder="New Password" 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff' }}
              />
              <button type="submit" style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Update</button>
            </form>
            {msgConfig && <p style={{ fontSize: '14px', marginTop: '10px' }}>{msgConfig}</p>}
          </div>

        </div>

      </div>
    </div>
  );
}