import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { NeuromorphicCPU } from './simulator/cpu.js';
import { ZKPProvider } from './auth/zkpProvider.js';
import { Instruction } from './simulator/isa.js';

dotenv.config();

const app = express();
const cpu = new NeuromorphicCPU();
const zkp = new ZKPProvider();

// --- STATUTORY MIDDLEWARE ---
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Strict Handshake with Vercel
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- DATABASE HANDSHAKE (VEC101 PERSISTENCE) ---
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("VC AUDIT: Permanent Ledger (MongoDB) Connected."))
    .catch(err => console.error("AUDIT FAILURE: Database Signal Lost.", err));
}

// --- ENDPOINT 1: THE ZKP GATEKEEPER ---
app.post('/api/auth/verify', (req: Request, res: Response): void => {
  try {
    const { proof } = req.body;
    const isValid = zkp.verifyProof(proof);
    
    if (isValid) {
      console.log("VC AUDIT: Level 10 Clearance Granted.");
      res.status(200).json({ status: "ACCESS_GRANTED", clearance: "LEVEL_10_VC" });
    } else {
      res.status(403).json({ status: "ACCESS_DENIED", message: "Result = 0: Invalid Proof Hash" });
    }
  } catch (error) {
    res.status(500).json({ status: "SYSTEM_FAULT", message: "Internal Handshake Error" });
  }
});

// --- ENDPOINT 2: THE VEC102 EXECUTION CORE ---
app.post('/api/simulate', (req: Request, res: Response): void => {
  const { program, proof } = req.body;

  // STRICT EQUALITY GUARD: No Proof, No Vibration.
  if (!zkp.verifyProof(proof)) {
    console.warn("VC AUDIT: Unauthorized Simulation Intercepted.");
    res.status(401).json({ error: "UNAUTHORIZED_EXECUTION", message: "ZKP Validation Failed" });
    return;
  }

  try {
    const result = cpu.execute(program as Instruction[]);
    console.log(`VC AUDIT: Program Executed Successfully. Cycles: ${result.length}`);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "PIPELINE_STALL", message: "VEC102 ISA Decoding Error" });
  }
});

// --- IGNITION ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`--- UNIVERSITY OF MUMBAI: VEC102 SIMULATOR ---`);
  console.log(`STATUS: ACTIVE | PORT: ${PORT} | MODE: ${MONGO_URI ? 'PERSISTENT' : 'VOLATILE'}`);
});