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
      setErro("❌ Please fill in all fields.");
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
        throw new Error(dados.erro || "Failed to create account.");
      }

      setSucesso("🚀 Account created successfully! Redirecting...");

      // Mapeamento correto dos dados vindos do Supabase para o LocalStorage
      localStorage.setItem("usuario_id", dados.user.id);
      localStorage.setItem("usuario_nome", dados.user.nome);
      localStorage.setItem("usuario_email", dados.user.email); 

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
        <h2 style={styles.title}>Create your Account 🚀</h2>
        <p style={styles.subtitle}>Start generating templates in seconds</p>

        <form onSubmit={handleCadastro} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Choose a strong password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={carregando} style={styles.btn}>
            {carregando ? "Creating account..." : "Register & Start"}
          </button>
        </form>

        {erro && <p style={styles.error}>{erro}</p>}
        {sucesso && <p style={styles.success}>{sucesso}</p>}

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
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