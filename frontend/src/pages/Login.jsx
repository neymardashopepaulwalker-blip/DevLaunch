import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await fetch("https://devlaunch-backend-uw21.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      // BLINDAGEM: Se a resposta não for ok (status diferente de 2xx), joga pro bloco catch
      if (!response.ok) {
        throw new Error(data.erro || "Access denied. Invalid email or password.");
      }

      if (!data.user || !data.user.id) {
        throw new Error("Malformed payload response from authentication database.");
      }

      // Salvando os dados estritamente validados
      localStorage.setItem("usuario_id", data.user.id);
      localStorage.setItem("usuario_nome", data.user.nome);
      localStorage.setItem("usuario_email", data.user.email);

      navigate("/dashboard");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="box-terminal" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>// AUTH_GATE</h2>
        
        {erro && <div style={{ color: "var(--error-color)", border: "1px solid var(--error-color)", padding: "10px", marginBottom: "20px", fontSize: "13px" }}>ERROR: {erro}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px" }}>USER_EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px" }}>USER_PASSWORD</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="btn-terminal">
            {loading ? "VALIDATING..." : "EXECUTE_LOGIN"}
          </button>
        </form>

        <p style={{ marginTop: "24px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
          No credential block? <Link to="/cadastro" style={{ color: "var(--accent-color)" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}