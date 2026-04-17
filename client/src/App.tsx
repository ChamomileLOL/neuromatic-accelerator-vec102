import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [proof, setProof] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [executionLogs, setExecutionLogs] = useState<any[]>([]);

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify', { proof });
      if (response.data.status === "ACCESS_GRANTED") {
        setIsAuthenticated(true);
        setError('');
      }
    } catch (err) {
      setError('RESULT = 0: ACCESS DENIED');
      setIsAuthenticated(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#050505', minHeight: '100vh', color: '#00ff41', fontFamily: 'monospace' }}>
        <h1>NEUROMATIC ACCELERATOR: GATEWAY</h1>
        <p>University of Mumbai Audit Protocol VEC101</p>
        <div style={{ marginTop: '50px' }}>
          <input 
            type="password" 
            placeholder="ENTER ZKP HASH"
            value={proof} 
            onChange={(e) => setProof(e.target.value)}
            style={{ background: '#111', color: '#00ff41', border: '1px solid #00ff41', padding: '15px', width: '300px', textAlign: 'center' }}
          />
          <br /><br />
          <button onClick={handleVerify} style={{ cursor: 'pointer', background: '#00ff41', color: '#000', fontWeight: 'bold', padding: '10px 30px', border: 'none' }}>
            AUTHENTICATE
          </button>
          {error && <p style={{ color: '#ff4444', marginTop: '20px' }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#050505', minHeight: '100vh', color: '#00ff41', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '2px solid #00ff41', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>SYSTEM STATUS: 200 OK (ADMIN_LEVEL_10)</h1>
        <p style={{ margin: 0 }}>Neuromorphic VEC102 Core | 10 Million Transistor Simulation</p>
      </header>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ border: '1px solid #333', padding: '20px', flex: 1 }}>
          <h3>Core Activity Matrix</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '5px' }}>
            {[...Array(100)].map((_, i) => (
              <div key={i} style={{ 
                width: '100%', paddingBottom: '100%', 
                background: Math.random() > 0.6 ? '#00ff41' : '#111',
                boxShadow: Math.random() > 0.9 ? '0 0 8px #00ff41' : 'none',
                borderRadius: '1px' 
              }}></div>
            ))}
          </div>
          <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>* Rendering 100/10,000,000 node clusters</p>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#111', padding: '15px', border: '1px solid #00ff41' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Thermal GMM Status</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>STABLE (45.2°C)</div>
          </div>

          <button 
            onClick={async () => {
              const program = [
                { type: "MOV", rd: "R1", imm: 100 },
                { type: "MOV", rd: "R2", imm: 50 },
                { type: "ADD", rd: "R3", rs1: "R1", rs2: "R2" },
                { type: "HLT", rd: "R0" }
              ];
              try {
                const res = await axios.post('http://localhost:5000/api/simulate', { program, proof });
                // VC AUDIT: Strict Type Safety to prevent white screens
                const resultData = res.data.result || res.data; 
                setExecutionLogs(Array.isArray(resultData) ? resultData : []);
              } catch (err: any) {
                console.error("EXECUTION_ERROR", err);
                alert("VC AUDIT: Signal Severed. Result = 0.");
              }
            }}
            style={{ background: '#00ff41', color: '#000', padding: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            EXECUTE ARM PROGRAM (VEC102)
          </button>

          <div style={{ flex: 1, background: '#000', border: '1px solid #333', padding: '10px', overflowY: 'auto', maxHeight: '300px' }}>
            <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #333' }}>Execution Trace</h4>
            {(!executionLogs || executionLogs.length === 0) ? 
              <span style={{ color: '#444' }}>Awaiting Trigger...</span> : 
              executionLogs.map((log, i) => (
                <div key={i} style={{ fontSize: '11px', marginBottom: '8px', borderLeft: '2px solid #00ff41', paddingLeft: '8px' }}>
                  <div style={{ color: '#fff' }}>[CYCLE {log?.cycle || i}] {log?.instruction || "PROCESSING..."}</div>
                  <div style={{ color: '#888' }}>
                    REGS: {log?.registers ? JSON.stringify(log.registers) : "PENDING"} | 
                    T: {log?.thermal?.temp || "45"}°C
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;