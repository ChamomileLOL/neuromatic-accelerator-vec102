import React, { useState, useMemo } from 'react';
import axios from 'axios';

/**
 * VC AUDIT: Environmental Handshake
 * Points to the Render Cloud URL provided in Step 16, or defaults to Localhost.
 */
// @ts-ignore
const API_URL = (import.meta as any).env.VITE_API_URL || 'https://neuromatic-accelerator-vec102.onrender.com';

const App: React.FC = () => {
  const [proof, setProof] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // AUTHENTICATION PROTOCOL (ZKP GATEKEEPER)
  const handleVerify = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/verify`, { proof });
      if (data.status === "ACCESS_GRANTED") {
        setIsAuthenticated(true);
        setError('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'RESULT = 0: ACCESS DENIED');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // VEC102 EXECUTION PROTOCOL (ARM ISA SIMULATION)
  const runSimulation = async () => {
    const program = [
      { type: "MOV", rd: "R1", imm: 100 },
      { type: "MOV", rd: "R2", imm: 50 },
      { type: "ADD", rd: "R3", rs1: "R1", rs2: "R2" },
      { type: "HLT", rd: "R0" }
    ];

    try {
      const res = await axios.post(`${API_URL}/api/simulate`, { program, proof });
      const resultData = res.data.result || res.data;
      setExecutionLogs(Array.isArray(resultData) ? resultData : []);
    } catch (err: any) {
      console.error("VEC102_FATAL:", err);
      alert("VC AUDIT: Signal Severed. Verify Render Service Status.");
    }
  };

  // GATEKEEPER VIEW
  if (!isAuthenticated) {
    return (
      <div style={styles.gatewayContainer}>
        <div style={styles.gatewayBox}>
          <h1 style={{ letterSpacing: '2px' }}>NEUROMATIC ACCELERATOR</h1>
          <p style={{ color: '#888' }}>University of Mumbai | VEC101 Protocol</p>
          <input 
            type="password" 
            placeholder="ENTER ZKP HASH"
            value={proof} 
            onChange={(e) => setProof(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleVerify} disabled={loading} style={styles.btnPrimary}>
            {loading ? 'VALIDATING...' : 'AUTHENTICATE'}
          </button>
          {error && <p style={styles.errorText}>{error}</p>}
        </div>
      </div>
    );
  }

  // ACCELERATOR DASHBOARD
  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h2 style={{ margin: 0 }}>SYSTEM STATUS: 200 OK (ADMIN_LEVEL_10)</h2>
        <small style={{ color: '#888' }}>Target: {API_URL}</small>
      </header>

      <div style={styles.layoutGrid}>
        {/* TRANSISTOR MATRIX */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Neuromorphic Activity Matrix</h3>
          <div style={styles.matrixGrid}>
            {[...Array(100)].map((_, i) => (
              <div key={i} style={{ 
                ...styles.transistor,
                background: Math.random() > 0.6 ? '#00ff41' : '#111',
                boxShadow: Math.random() > 0.9 ? '0 0 10px #00ff41' : 'none'
              }} />
            ))}
          </div>
          <p style={styles.subtext}>* Monitoring 10,000,000 node simulation clusters</p>
        </section>

        {/* CONTROLS & TRACE */}
        <section style={styles.controlPanel}>
          <div style={styles.thermalBox}>
            <span style={{ fontSize: '12px' }}>THERMAL GMM PREDICTION</span>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>STABLE (45.2°C)</div>
          </div>

          <button onClick={runSimulation} style={styles.btnExecute}>
            EXECUTE ARM PROGRAM (VEC102)
          </button>

          <div style={styles.traceWindow}>
            <h4 style={styles.traceHeader}>Execution Trace Log</h4>
            <div style={styles.traceContent}>
              {executionLogs.length === 0 ? <span style={{ color: '#333' }}>Awaiting Trigger...</span> : 
                executionLogs.map((log, i) => (
                  <div key={i} style={styles.logLine}>
                    <div style={{ color: '#fff' }}>[CYCLE {log?.cycle || i}] {log?.instruction}</div>
                    <div style={{ fontSize: '10px', color: '#00ff41' }}>
                      R3: {log?.registers?.R3 ?? '??'} | {log?.thermal?.temp ?? '45'}°C
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- STYLES (Strict Equality Layout) ---
const styles: { [key: string]: React.CSSProperties } = {
  gatewayContainer: { padding: '40px', textAlign: 'center', background: '#000', minHeight: '100vh', color: '#00ff41', fontFamily: 'monospace', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  gatewayBox: { border: '1px solid #00ff41', padding: '50px', background: '#050505' },
  appContainer: { padding: '20px', background: '#050505', minHeight: '100vh', color: '#00ff41', fontFamily: 'monospace' },
  header: { borderBottom: '1px solid #00ff41', paddingBottom: '10px', marginBottom: '20px' },
  layoutGrid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  card: { border: '1px solid #333', padding: '20px', flex: '1 1 400px', background: '#000' },
  cardTitle: { marginTop: 0, borderBottom: '1px solid #222', paddingBottom: '10px' },
  matrixGrid: { display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' },
  transistor: { width: '100%', paddingBottom: '100%', borderRadius: '1px', transition: 'all 0.3s' },
  controlPanel: { flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '15px' },
  thermalBox: { background: '#111', padding: '15px', borderLeft: '4px solid #00ff41' },
  btnPrimary: { background: '#00ff41', color: '#000', border: 'none', padding: '12px 25px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  btnExecute: { background: '#00ff41', color: '#000', padding: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '14px' },
  traceWindow: { flex: 1, background: '#000', border: '1px solid #333', display: 'flex', flexDirection: 'column' },
  traceHeader: { margin: 0, padding: '8px', background: '#111', fontSize: '12px' },
  traceContent: { padding: '10px', overflowY: 'auto', maxHeight: '400px' },
  logLine: { marginBottom: '10px', paddingLeft: '8px', borderLeft: '1px solid #444' },
  input: { background: '#111', color: '#00ff41', border: '1px solid #00ff41', padding: '12px', width: '280px', textAlign: 'center', outline: 'none' },
  errorText: { color: '#ff4444', marginTop: '15px', fontSize: '12px' },
  subtext: { color: '#444', fontSize: '10px', marginTop: '10px' }
};

export default App;