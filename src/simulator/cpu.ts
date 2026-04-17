import { RegisterFile, type Instruction, InstructionType } from './isa.js';
import { ThermalGMM } from '../ml/thermalGMM.js';

export class NeuromorphicCPU {
  private registers = new RegisterFile();
  private thermalUnit = new ThermalGMM();
  private cycleCount: number = 0;

  public execute(program: Instruction[]): any[] {
    const logs: any[] = [];

    for (const instr of program) {
      this.cycleCount++;
      let activityFactor = 0;

      switch (instr.type) {
        case InstructionType.MOV:
          if (instr.imm !== undefined) {
            this.registers.set(instr.rd, instr.imm);
            activityFactor = 0.2;
          }
          break;
        case InstructionType.ADD:
          if (instr.rs1 && instr.rs2) {
            const sum = this.registers.get(instr.rs1) + this.registers.get(instr.rs2);
            this.registers.set(instr.rd, sum);
            activityFactor = 0.8;
          }
          break;
        case InstructionType.HLT:
          logs.push({ cycle: this.cycleCount, event: "HALT" });
          return logs;
      }

      // Strict Equality: Linking Hardware Logic to AI Prediction
      const thermalReport = this.thermalUnit.predictThrottling(activityFactor);
      
      logs.push({
        cycle: this.cycleCount,
        instruction: instr.type,
        registers: this.registers.dump(),
        thermal: thermalReport
      });
    }
    return logs;
  }
}