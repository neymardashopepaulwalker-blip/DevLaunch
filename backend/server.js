const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.send('🚀 DevLaunch Backend (Modo Leve) Running!');
});

// ==========================================
// 🔐 ROTAS DE AUTH (Mantidas Iguais)
// ==========================================
app.post('/api/auth/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: "Incomplete fields." });
  try {
    const { data, error } = await supabase.from('usuarios').insert([{ nome, email, senha }]).select();
    if (error) return res.status(400).json({ erro: error.message });
    res.json({ mensagem: "Sucesso!", user: data[0] });
  } catch (err) {
    res.status(500).json({ erro: "Internal server error." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { data: usuario, error } = await supabase.from('usuarios').select('*').eq('email', email).single();
    if (error || !usuario || usuario.senha !== senha) return res.status(400).json({ erro: "Incorrect credentials." });
    res.json({ mensagem: "Sucesso!", user: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ erro: "Internal server error." });
  }
});

app.get('/api/projetos/lista/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const { data: projetos, error } = await supabase.from('projetos').select('*').eq('usuario_id', usuario_id).order('criado_em', { ascending: false });
    if (error) return res.status(400).json({ erro: error.message });
    res.json({ projetos });
  } catch (err) {
    res.status(500).json({ erro: "Internal server error." });
  }
});

app.post('/api/auth/mudar-senha', async (req, res) => {
  const { usuario_id, novaSenha } = req.body;
  try {
    const { error } = await supabase.from('usuarios').update({ senha: novaSenha }).eq('id', usuario_id);
    if (error) return res.status(400).json({ erro: error.message });
    res.json({ mensagem: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ erro: "Error changing password." });
  }
});

// ==========================================
// 📁 ROTA PARA SALVAR NO BANCO (AGORA SEM ZIP)
// ==========================================
app.post('/api/projetos/salvar', async (req, res) => {
  const { usuario_id, tipo_projeto, nome_projeto } = req.body;

  if (!usuario_id || !tipo_projeto) {
    return res.status(400).json({ erro: "Incomplete data." });
  }

  try {
    const { error } = await supabase
      .from('projetos')
      .insert([{ usuario_id, tipo_projeto, nome_projeto }]);

    if (error) return res.status(400).json({ erro: error.message });

    // Retorna apenas sucesso. O Frontend cuida do resto!
    res.json({ sucesso: true, mensagem: "Projeto registrado no histórico!" });

  } catch (err) {
    res.status(500).json({ erro: "Erro ao salvar no banco." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));