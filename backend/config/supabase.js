const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Criando o cliente com uma configuração extra para evitar travas no Node recente
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  global: {
    fetch: (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)).catch(err => {
      // Se falhar o fetch global, ele usa o padrão do node
      return fetch(...args);
    })
  }
});

module.exports = supabase;