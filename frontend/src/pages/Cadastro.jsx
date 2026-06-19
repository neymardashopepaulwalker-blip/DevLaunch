import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    if (!nome || !email || !senha) {
      setErro("❌ Preencha todos os campos!");
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch("https://devlaunch-backend-uw21.onrender.com/api/auth/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Falha ao criar conta.");
      }

      setSucesso("🚀 Conta criada com sucesso! Redirecionando...");

      // Salvando os dados reais recebidos do banco de dados
      localStorage.setItem("usuario_id", dados.usuario.id);
      localStorage.setItem("usuario_nome", dados.usuario.nome);
      localStorage.setItem("usuario_email", dados.usuario.email); 

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setErro(`❌ ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Criar Conta no DevLaunch 🚀</h2>
        <p style={styles.subtitle}>Comece a gerar seus templates em segundos</p>

        <form onSubmit={handleCadastro} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome Completo</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="Sua senha secreta"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={carregando} style={styles.btn}>
            {carregando ? "Criando conta..." : "Registrar e Entrar"}
          </button>
        </form>

        {erro && <p style={styles.error}>{erro}</p>}
        {sucesso && <p style={styles.success}>{sucesso}</p>}

        <p style={styles.footerText}>
          Já tem uma conta? <Link to="/login" style={styles.link}>Faça Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#090d16", fontFamily: "'Inter', sans-serif", padding: "20px" },
  card: { width: "100%", maxWidth: "420px", backgroundColor: "#0f172a", borderRadius: "12px", padding: "40px", border: "1px solid #1e293b", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" },
  title: { fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "#64748b", marginBottom: "30px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" },
  label: { fontSize: "13px", fontWeight: "600", color: "#94a3b8" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #1e293b", backgroundColor: "#090d16", color: "#fff", fontSize: "14px", outline: "none" },
  btn: { width: "100%", backgroundColor: "#38bdf8", color: "#090d16", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", transition: "0.2s", marginTop: "10px" },
  error: { color: "#ef4444", fontSize: "14px", fontWeight: "600", marginTop: "15px" },
  success: { color: "#34d399", fontSize: "14px", fontWeight: "600", marginTop: "15px" },
  footerText: { fontSize: "14px", color: "#64748b", marginTop: "25px" },
  link: { color: "#38bdf8", textDecoration: "none", fontWeight: "600" }
};