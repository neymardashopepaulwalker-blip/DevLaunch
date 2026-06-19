import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    try {
      // Disparando para a rota de cadastro que já criamos no Node.js
      const resposta = await fetch("http://localhost:5000/api/auth/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao criar conta.");
      }

      setSucesso("Conta criada com sucesso! Redirecionando para o login...");
      
      // Espera 2 segundos para o usuário ler a mensagem de sucesso e joga pro Login
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.backButton}>← Voltar ao início</button>

      <div style={styles.card}>
        <h2 style={styles.title}>Crie sua conta 🚀</h2>
        <p style={styles.subtitle}>Faça parte do DevLaunch e comece a gerar projetos</p>

        {erro && <div style={styles.errorBox}>{erro}</div>}
        {sucesso && <div style={styles.successBox}>{sucesso}</div>}

        <form onSubmit={handleCadastro}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome Completo</label>
            <input 
              type="text" 
              placeholder="Seu nome" 
              style={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={carregando}
            />
          </div>

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
              placeholder="Escolha uma senha segura" 
              style={styles.input}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={carregando}
            />
          </div>

          <button type="submit" style={styles.button} disabled={carregando}>
            {carregando ? "Criando conta..." : "Cadastrar no DevLaunch"}
          </button>
        </form>

        <p style={styles.footerText}>
          Já tem uma conta? <span onClick={() => navigate("/login")} style={styles.link}>Faça login</span>
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
  successBox: { backgroundColor: "#10b98122", color: "#34d399", padding: "10px", borderRadius: "6px", fontSize: "14px", marginBottom: "20px", border: "1px solid #10b981" },
  inputGroup: { textAlign: "left", marginBottom: "20px" },
  label: { display: "block", fontSize: "14px", fontWeight: "500", color: "#cbd5e1", marginBottom: "8px" },
  input: { width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "6px", padding: "12px", color: "#ffffff", fontSize: "14px", outline: "none" },
  button: { width: "100%", backgroundColor: "#10b981", color: "#ffffff", border: "none", padding: "14px", fontSize: "16px", fontWeight: "bold", borderRadius: "6px", cursor: "pointer", marginTop: "10px" },
  footerText: { color: "#94a3b8", fontSize: "14px", marginTop: "20px" },
  link: { color: "#6366f1", cursor: "pointer", fontWeight: "500", textDecoration: "underline" }
};