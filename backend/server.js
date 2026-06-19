const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.send('🚀 Backend do DevLaunch Rodando Liso!');
});

// ==========================================
// 🔐 ROTA DE CADASTRO
// ==========================================
app.post('/api/auth/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: "Campos incompletos." });

  try {
    const { data, error } = await supabase.from('usuarios').insert([{ nome, email, senha }]).select();
    if (error) return res.status(400).json({ erro: error.message });
    res.json({ mensagem: "Sucesso!", user: data[0] });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno." });
  }
});

// ==========================================
// 🔑 ROTA DE LOGIN
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { data: usuario, error } = await supabase.from('usuarios').select('*').eq('email', email).single();
    if (error || !usuario || usuario.senha !== senha) {
      return res.status(400).json({ erro: "E-mail ou senha incorretos." });
    }
    res.json({ mensagem: "Sucesso!", user: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno." });
  }
});

// ==========================================
// 📜 ROTA PARA BUSCAR HISTÓRICO
// ==========================================
app.get('/api/projetos/lista/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const { data: projetos, error } = await supabase
      .from('projetos')
      .select('*')
      .eq('usuario_id', usuario_id)
      .order('criado_em', { ascending: false });

    if (error) return res.status(400).json({ erro: error.message });
    res.json({ projetos });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno." });
  }
});

// ==========================================
// 📁 ROTA PARA SALVAR NO BANCO E GERAR O ZIP
// ==========================================
app.post('/api/projetos/salvar', async (req, res) => {
  const { usuario_id, tipo_projeto, nome_projeto } = req.body;

  if (!usuario_id || !tipo_projeto) {
    return res.status(400).json({ erro: "Dados incompletos." });
  }

  try {
    // 1. Salva o registro histórico no Supabase
    const { error } = await supabase
      .from('projetos')
      .insert([{ usuario_id, tipo_projeto, nome_projeto }]);

    if (error) return res.status(400).json({ erro: error.message });

    // 2. Configura os Headers corretos para transferência de arquivo binário na nuvem sem travar
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${nome_projeto}.zip`);

    // 3. Compactador ZIP rodando direto na memória RAM do Render (Sem gravar arquivo físico no disco)
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    // 4. Monta os arquivos internos baseado no tipo (Mantendo a sua lógica exata)
    if (tipo_projeto === "Bot de Discord") {
      archive.append(`const { Client } = require('discord.js');\nconsole.log('Bot ${nome_projeto} Online!');`, { name: 'index.js' });
      archive.append(`DISCORD_TOKEN=seu_token`, { name: '.env' });
      archive.append(`{\n  "name": "${nome_projeto.toLowerCase()}",\n  "version": "1.0.0"\n}`, { name: 'package.json' });
    } 
    else if (tipo_projeto === "API Node.js") {
      archive.append(`const express = require('express');\nconst app = express();\napp.listen(5000, () => console.log('API ${nome_projeto} no ar!'));`, { name: 'server.js' });
      archive.append(`PORT=5000`, { name: '.env' });
      archive.append(`{\n  "name": "${nome_projeto.toLowerCase()}",\n  "version": "1.0.0"\n}`, { name: 'package.json' });
    } 
    else { 
      archive.append(`import React from 'react';\nexport default function App() { return <h1>${nome_projeto} 🚀</h1> }`, { name: 'src/App.jsx' });
      archive.append(`{\n  "name": "${nome_projeto.toLowerCase()}",\n  "version": "1.0.0"\n}`, { name: 'package.json' });
    }

    await archive.finalize();

  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ erro: "Erro ao gerar zip." });
  }
});

// ==========================================
// 🔐 ROTA PARA ALTERAR SENHA
// ==========================================
app.post('/api/auth/mudar-senha', async (req, res) => {
  const { usuario_id, novaSenha } = req.body;

  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ senha: novaSenha })
      .eq('id', usuario_id);

    if (error) return res.status(400).json({ erro: error.message });
    res.json({ mensagem: "Senha alteredada com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao mudar senha." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor na porta ${PORT}`));