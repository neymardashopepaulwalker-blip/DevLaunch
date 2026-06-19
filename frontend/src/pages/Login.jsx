import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    if (!email || !senha) {
      setErro("❌ Please fill in all fields.");
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch("https://devlaunch-backend-uw21.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Invalid email or password.");
      }

      // Gravando as chaves exatas que o backend mapeia com o Supabase
      localStorage.setItem("usuario_id", dados.user.id);
      localStorage.setItem("usuario_nome", dados.user.nome);
      localStorage.setItem("usuario_email", dados.user.email);

      navigate("/dashboard");
    } catch (err) {
      setErro(`❌ ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back! 👋</h2>
        <p style={styles.subtitle}>Log in to access your developer sandbox</p>

        <form onSubmit={handleLogin} style={styles.form}>
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
              placeholder="Your secret password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={carregando} style={styles.btn}>
            {carregando ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {erro && <p style={styles.error}>{erro}</p>}

        <p style={styles.footerText}>
          Don't have an account yet? <Link to="/cadastro" style={styles.link}>Sign Up</Link>
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
  footerText: { fontSize: "14px", color: "#64748b", marginTop: "25px" },
  link: { color: "#38bdf8", textDecoration: "none", fontWeight: "600" }
};