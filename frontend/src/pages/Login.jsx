import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    try {
      // Disparando para a rota de login do nosso backend Node.js
      const resposta = await fetch("https://devlaunch-backend-uw21.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "E-mail ou senha incorretos.");
      }

      // 🚨 OS SALVADORES DA PÁTRIA: Guardando os dados do usuário no navegador
      localStorage.setItem("usuario_nome", dados.user.nome);
      localStorage.setItem("usuario_id", dados.user.id); // 👈 ISSO AQUI VAI CONSERTAR O GERADOR!

      // Redireciona com sucesso para o painel principal
      navigate("/dashboard");

    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Botão discreto para voltar para a Landing Page se quiser */}
      <button onClick={() => navigate("/")} style={styles.backButton}>← Voltar ao início</button>

      <div style={styles.card}>
        <h2 style={styles.title}>Entrar no DevLaunch 🚀</h2>
        <p style={styles.subtitle}>Faça login para gerenciar e criar seus templates</p>

        {/* Caixa de Erro Dinâmica */}
        {erro && <div style={styles.errorBox}>{erro}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input 
              type="email" 
              placeholder="seuemail@exemplo.com" 
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={carregando}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input 
              type="password" 
              placeholder="Sua senha secreta" 
              style={styles.input}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={carregando}
            />
          </div>

          <button type="submit" style={styles.button} disabled={carregando}>
            {carregando ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>

        <p style={styles.footerText}>
          Não tem uma conta? <span onClick={() => navigate("/cadastro")} style={styles.link}>Crie uma agora</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative", backgroundColor: "#0f172a" },
  backButton: { position: "absolute", top: "30px", color: "#94a3b8", backgroundColor: "transparent", border: "none", cursor: "pointer", fontSize: "14px" },
  card: { backgroundColor: "#1e293b", width: "100%", maxWidth: "400px", padding: "40px 30px", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)", textAlign: "center", border: "1px solid #334155" },
  title: { fontSize: "24px", fontWeight: "700", marginBottom: "8px", color: "#fff" },
  subtitle: { fontSize: "14px", color: "#94a3b8", marginBottom: "30px" },
  errorBox: { backgroundColor: "#ef444422", color: "#f87171", padding: "10px", borderRadius: "6px", fontSize: "14px", marginBottom: "20px", border: "1px solid #ef4444" },
  inputGroup: { textAlign: "left", marginBottom: "20px" },
  label: { display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "8px" },
  input: { width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "6px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none" },
  button: { width: "100%", backgroundColor: "#6366f1", color: "#ffffff", border: "none", padding: "14px", fontSize: "16px", fontWeight: "bold", borderRadius: "6px", cursor: "pointer", marginTop: "10px" },
  footerText: { color: "#94a3b8", fontSize: "14px", marginTop: "20px" },
  link: { color: "#10b981", cursor: "pointer", fontWeight: "500", textDecoration: "underline" }
};