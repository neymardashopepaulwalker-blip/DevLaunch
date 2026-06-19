import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <header style={styles.header}>
        <div style={styles.logo}>DevLaunch <span style={{color: '#6366f1'}}>🚀</span></div>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button style={styles.secondaryButton}>Acessar Plataforma</button>
        </Link>
      </header>

      {/* 1. HERO SECTION */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Transforme suas ideias em softwares <span style={styles.highlight}>lançados no mercado</span>.
        </h1>
        <p style={styles.subtitle}>
          O centro de comando definitivo para desenvolvedores e makers organizarem, executarem e lançarem seus projetos sem abandonar no meio do caminho. Baseado na metodologia do Stardance.
        </p>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button style={styles.primaryButton}>Criar Minha Conta Grátis</button>
        </Link>
      </section>

      {/* 2. COMO FUNCIONA (O ROADMAP DO PRODUTO) */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>A Metodologia do Sucesso</h2>
        <div style={styles.gridSteps}>
          <div style={styles.stepCard}><h3>1. Ideia & Plano</h3><p>Estruture o escopo inicial e objetivos.</p></div>
          <div style={styles.stepCard}><h3>2. Desenvolvimento</h3><p>Gerencie tarefas por prioridades (Alta, Média, Baixa).</p></div>
          <div style={styles.stepCard}><h3>3. Lançamento</h3><p>Acompanhe o roadmap visual até o deploy final.</p></div>
        </div>
      </section>

      {/* 3. RECURSOS (FEATURES) */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Recursos do MVP</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureBox}><h4>📊 Dashboard Central</h4><p>Visão geral de projetos ativos e concluídos.</p></div>
          <div style={styles.featureBox}><h4>🗺️ Roadmap Visual</h4><p>Acompanhe os estágios de Ideia até Concluído.</p></div>
          <div style={styles.featureBox}><h4>📋 Sistema de Tarefas</h4><p>Kanban integrado com controle de prazos e status.</p></div>
        </div>
      </section>

      {/* 4. FAQ simples */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Perguntas Frequentes</h2>
        <div style={styles.faqBox}>
          <p><strong>O DevLaunch possui IA?</strong></p>
          <p style={{color: '#94a3b8', marginTop: '5px'}}>O recurso de Mentor Virtual e Planejamento Inteligente por IA está listado no roadmap pós-MVP.</p>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", padding: "0 20px", fontFamily: "sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto", padding: "20px 0" },
  logo: { fontSize: "22px", fontWeight: "bold" },
  secondaryButton: { backgroundColor: "transparent", border: "1px solid #334155", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  hero: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "800px", margin: "80px auto", paddingBottom: "40px" },
  title: { fontSize: "42px", fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" },
  highlight: { color: "#6366f1" },
  subtitle: { fontSize: "18px", color: "#94a3b8", marginBottom: "30px", lineHeight: "1.6" },
  primaryButton: { backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "16px 32px", fontSize: "16px", fontWeight: "bold", borderRadius: "8px", cursor: "pointer" },
  section: { maxWidth: "1000px", margin: "60px auto", textAlign: "center" },
  sectionTitle: { fontSize: "28px", marginBottom: "30px" },
  gridSteps: { display: "flex", gap: "20px", justifyContent: "space-between" },
  stepCard: { flex: 1, backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", border: "1px solid #334155" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  featureBox: { backgroundColor: "#1e293b", padding: "25px", borderRadius: "8px", textAlign: "left", border: "1px solid #334155" },
  faqBox: { backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", textAlign: "left", margin: "0 auto", maxWidth: "600px", border: "1px solid #334155" }
};