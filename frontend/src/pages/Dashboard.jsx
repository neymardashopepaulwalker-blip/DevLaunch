import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [historico, setHistorico] = useState([]);
  const [nomeCustomizado, setNomeCustomizado] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const idUsuario = localStorage.getItem('usuario_id');
  const nomeUsuario = localStorage.getItem('usuario_nome') || "Active_User";
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
      console.error("Failed logs pipeline sync:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleGerarProjeto = async (tipo) => {
    const nomeFinal = nomeCustomizado.trim() || `Template_${tipo.replace(/\s+/g, '_')}`;
    setStatus(`>> INITIALIZING STORAGE ARCHIVE ENGINE FOR: ${nomeFinal}...`);

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

      if (!res.ok) {
        throw new Error(`HTTP structure verification failed with code ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nomeFinal}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setStatus(`>> SYSTEM: ${nomeFinal}.ZIP successfully piped to local device storage.`);
      setNomeCustomizado("");
      carregarHistorico(); 
    } catch (err) {
      setStatus(`>> SYSTEM_CRITICAL_ERROR: Stream compilation aborted.`);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* CONSOLE DESKTOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px' }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0", fontSize: "22px" }}>DEVELOPER_WORKSPACE_CONSOLE</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>IDENT_NODE: {nomeUsuario} // {emailUsuario}</span>
        </div>
        <button onClick={handleLogout} className="btn-terminal" style={{ borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>TERMINATE_SESSION</button>
      </div>

      {status && (
        <div style={{ border: '2px solid var(--accent-color)', background: '#090a0f', padding: '15px', marginBottom: '30px', color: 'var(--accent-color)', fontSize: '13px' }}>
          {status}
        </div>
      )}

      {/* CORE DISPLAY GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        
        {/* COMPILER MODULE */}
        <div className="box-terminal">
          <h3 style={{ marginBottom: '25px', color: 'var(--accent-color)' }}>[ COMPILER_STAGE ]</h3>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>SET_CUSTOM_OUTPUT_PREFIX</label>
            <input 
              type="text" 
              placeholder="e.g. customized_app_build" 
              value={nomeCustomizado} 
              onChange={(e) => setNomeCustomizado(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => handleGerarProjeto("React Boilerplate")} className="btn-terminal">BUILD: REACT_CLIENT_SPA</button>
            <button onClick={() => handleGerarProjeto("Node.js API")} className="btn-terminal">BUILD: NODEJS_EXPRESS_API</button>
            <button onClick={() => handleGerarProjeto("Discord Bot")} className="btn-terminal">BUILD: DISCORD_AUTOMATION_BASE</button>
          </div>
        </div>

        {/* LOG SYSTEM */}
        <div className="box-terminal">
          <h3 style={{ marginBottom: '20px' }}>[ LOCAL_REGISTRY_LOGS ]</h3>
          <div style={{ background: '#090a0f', border: '1px solid var(--border-color)', padding: '15px', maxHeight: '340px', overflowY: 'auto' }}>
            {historico.length === 0 ? (
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No execution entries found.</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {historico.map((p, i) => (
                  <div key={i} style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--accent-color)', display: 'block' }}>&gt; {p.nome_projeto}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>STACK: {p.tipo_projeto}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}