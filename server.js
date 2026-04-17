import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Strict Equality Connection Audit
const MONGO_URI = process.env.MONGO_URI || '';
mongoose.connect(MONGO_URI)
  .then(() => console.log("SYSTEM: Database Vibration Detected (200 OK)"))
  .catch((err) => console.log("SYSTEM: Connection Failure (Absolutely No)"));

app.get('/', (req, res) => {
  res.send("Neuromorphic Accelerator: Status - Awaiting Result");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`VC Audit: Server running on Port ${PORT}`));