import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

export default function Landing() {
  
  useEffect(() => {
    // GATILHO DE ENGENHARIA HUMANA: Ping preventivo para acordar o Render de graça
    fetch("https://devlaunch-backend-uw21.onrender.com/api/projetos/lista/ping").catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: "var(--bg-dark-obsidian)", minHeight: "100vh", color: "var(--text-primary)" }}>
      <header style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)" }}>
        <span style={{ fontWeight: "700", letterSpacing: "0.5px", fontSize: "15px" }}>DEVLAUNCH // BASE</span>
        <div style={{ display: "flex", gap: "24px", fontSize: "13px" }}>
          <Link to="/login" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Sign In</Link>
          <Link to="/cadastro" style={{ color: "var(--accent-premium)", textDecoration: "none", fontWeight: "600" }}>Register</Link>
        </div>
      </header>

      <main style={{ maxWidth: "800px", margin: "100px auto 0 auto", padding: "0 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#fff", letterSpacing: "-1px", marginBottom: "24px", lineHeight: "1.1" }}>
          Scaffold project structures instantly.
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 40px auto" }}>
          A minimal sandbox utility to acquire and stream production-ready configuration frames as standalone zip containers. Built for deployment pipeline rapid initialization.
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "100px" }}>
          <Link to="/cadastro" style={{ padding: "14px 28px", backgroundColor: "var(--accent-premium)", color: "#fff", textDecoration: "none", fontWeight: "600", fontSize: "14px", borderRadius: "4px" }}>
            Initialize Development Workspace
          </Link>
        </div>

        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "50px", textAlign: "left" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "30px" }}>
            <div>
              <h4 style={{ fontSize: "14px", color: "#fff", margin: "0 0 8px 0" }}>React Application Client</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>Vite scaffold architecture mapped with routing layer environment setups.</p>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", color: "#fff", margin: "0 0 8px 0" }}>Node.js REST Engine</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>Express runtime bundle pre-configured with rigid CORS handlers and error interceptors.</p>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", color: "#fff", margin: "0 0 8px 0" }}>Automation Build Matrix</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>Discord.js isolated modules ready for secure environment variable injection.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}