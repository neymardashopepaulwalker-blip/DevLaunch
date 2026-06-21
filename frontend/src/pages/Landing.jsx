import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

export default function Landing() {
  
  useEffect(() => {
    fetch("https://devlaunch-backend-uw21.onrender.com/api/projetos/lista/ping").catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: "var(--bg-main)", minHeight: "100vh", color: "var(--text-main)", overflowX: "hidden" }}>
      
      {/* HEADER */}
      <header style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glow)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--accent)" }}></div>
          <span style={{ fontWeight: "700", fontSize: "16px", letterSpacing: "0.5px" }}>DEVLAUNCH</span>
        </div>
        
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/login" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
            Sign In
          </Link>
          <Link to="/cadastro" className="primary-button" style={{ color: "#fff", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)" }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 32px 120px 32px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translate(-50%, -50%)", width: "400px", height: "200px", backgroundColor: "rgba(124, 58, 237, 0.15)", filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none" }}></div>

        <span style={{ display: "inline-block", backgroundColor: "rgba(124, 58, 237, 0.1)", color: "#a78bfa", padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", marginBottom: "24px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
          ✨ Accelerate Your Development Workflow
        </span>

        <h1 style={{ fontSize: "3.5rem", fontWeight: "800", color: "#fff", letterSpacing: "-1.5px", marginBottom: "20px", lineHeight: "1.1", maxWidth: "800px", margin: "0 auto 20px auto" }}>
          Your production-ready environment setup in seconds.
        </h1>

        <p style={{ color: "var(--text-muted)", fontSize: "18px", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 40px auto" }}>
          Choose your favorite base stack, customize your compilation parameters, and instantly download clean, professional code architectures.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "80px" }}>
          <Link to="/cadastro" className="primary-button" style={{ padding: "16px 32px", color: "#fff", textDecoration: "none", fontWeight: "600", fontSize: "15px", borderRadius: "8px", boxShadow: "0 8px 24px rgba(124, 58, 237, 0.3)" }}>
            Create Free Account
          </Link>
        </div>

        {/* PREVIEW CONTAINER */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-glow)", borderRadius: "12px", padding: "6px", maxWidth: "850px", margin: "0 auto", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", gap: "6px", padding: "10px 14px", borderBottom: "1px solid #1f1f23" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444" }}></div>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#eab308" }}></div>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#22c55e" }}></div>
          </div>
          <div style={{ padding: "30px", backgroundColor: "#0b0b0d", borderRadius: "0 0 8px 8px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", textAlign: "left" }}>
            <div style={{ padding: "16px", border: "1px solid var(--accent)", borderRadius: "8px", backgroundColor: "var(--bg-card)" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--accent)", marginBottom: "4px" }}>FRONTEND</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>React Boilerplate</div>
            </div>
            <div style={{ padding: "16px", border: "1px solid var(--border-glow)", borderRadius: "8px", backgroundColor: "var(--bg-card)", opacity: 0.4 }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "4px" }}>BACKEND</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>Node.js API</div>
            </div>
            <div style={{ padding: "16px", border: "1px solid var(--border-glow)", borderRadius: "8px", backgroundColor: "var(--bg-card)", opacity: 0.4 }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "4px" }}>AUTOMATION</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>Discord Bot Base</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}