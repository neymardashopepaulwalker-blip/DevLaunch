import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function Dashboard() {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Node.js REST API');
  const [userId, setUserId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Recupera o ID do usuário logado (Ajuste caso use Context API em vez de localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
      } catch (e) {
        console.error("Error reading user from localStorage", e);
      }
    }
  }, []);

  const compileAndDownloadProject = async () => {
    setIsGenerating(true);
    
    // Tratamento de segurança para o nome do projeto
    const safeName = projectName ? projectName.trim() : 'devlaunch_project';
    const typeLower = projectType ? projectType.toLowerCase() : '';

    try {
      // 1. Manda pro Backend APENAS para salvar no histórico do Supabase
      // Enviamos as chaves em português porque o seu backend espera exatamente esses nomes!
      if (userId) {
        fetch('https://devlaunch-backend-uw21.onrender.com/api/projetos/salvar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            usuario_id: userId, 
            tipo_projeto: projectType, 
            nome_projeto: safeName 
          })
        }).catch(err => console.error("Error saving to history:", err));
      }

      // 2. Monta o ZIP na memória do navegador (Instantâneo)
      const zip = new JSZip();

      if (typeLower.includes('discord')) {
        zip.file("index.js", `const { Client } = require('discord.js');\nconsole.log('Bot ${safeName} Online!');`);
        zip.file(".env", "DISCORD_TOKEN=your_token_here");
        zip.file("package.json", `{\n  "name": "${safeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}",\n  "version": "1.0.0"\n}`);
      } 
      else if (typeLower.includes('node') || typeLower.includes('api')) {
        zip.file("server.js", `const express = require('express');\nconst app = express();\napp.listen(5000, () => console.log('API ${safeName} online!'));`);
        zip.file(".env", "PORT=5000");
        zip.file("package.json", `{\n  "name": "${safeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}",\n  "version": "1.0.0"\n}`);
      } 
      else { 
        // Boilerplate React
        zip.folder("src").file("App.jsx", `import React from 'react';\nexport default function App() { return <h1>${safeName} 🚀</h1> }`);
        zip.file("package.json", `{\n  "name": "${safeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}",\n  "version": "1.0.0"\n}`);
      }

      // 3. Força o download imediatamente para o usuário
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${safeName}.zip`);

    } catch (error) {
      console.error("Fatal error generating ZIP:", error);
      alert("Failed to generate the project file. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>🚀 DevLaunch Dashboard</h2>
      <p>Configure your new project and download the boilerplate instantly.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px' }}>
        
        {/* Project Name Input */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Project Name
          </label>
          <input 
            type="text" 
            placeholder="e.g., my-awesome-app" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Project Type Selector */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Project Type
          </label>
          <select 
            value={projectType} 
            onChange={(e) => setProjectType(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="Node.js REST API">Node.js REST API</option>
            <option value="Discord Bot Base">Discord Bot Base</option>
            <option value="REACT.js Module">REACT.js Module</option>
          </select>
        </div>

        {/* Compile & Download Button */}
        <button 
          onClick={compileAndDownloadProject} 
          disabled={isGenerating}
          style={{ 
            marginTop: '15px',
            padding: '12px', 
            backgroundColor: isGenerating ? '#9ca3af' : '#6366f1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isGenerating ? 'not-allowed' : 'pointer' 
          }}
        >
          {isGenerating ? 'Generating Pipeline...' : 'Compile & Download ZIP'}
        </button>

      </div>
    </div>
  );
}