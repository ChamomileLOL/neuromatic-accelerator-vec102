import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { NeuromorphicCPU } from './simulator/cpu.js';
import { ZKPProvider } from './auth/zkpProvider.js';
import { Instruction } from './simulator/isa.js';

dotenv.config();

const app = express();
const cpu = new NeuromorphicCPU();
const zkp = new ZKPProvider();

app.use(cors());
app.use(express.json());

// Endpoint 1: The ZKP Audit (Security Verification)
app.post('/api/auth/verify', (req: Request, res: Response): void => {
  const { proof } = req.body;
  const isValid = zkp.verifyProof(proof);
  
  if (isValid) {
    res.status(200).json({ status: "ACCESS_GRANTED", clearance: "LEVEL_10_VC" });
  } else {
    res.status(403).json({ status: "ACCESS_DENIED", message: "Result = 0" });
  }
});

// Endpoint 2: The Execution Pipeline (VEC102 Result)
app.post('/api/simulate', (req: Request, res: Response): void => {
  const { program, proof } = req.body;

  // Strict Equality Guard: No Proof, No Execution
  if (!zkp.verifyProof(proof)) {
    res.status(403).send("Unauthorized Execution Attempt Detected.");
    return;
  }

  const result = cpu.execute(program as Instruction[]);
  res.json({ result });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`VC AUDIT: System Active on Port ${PORT}`);
});