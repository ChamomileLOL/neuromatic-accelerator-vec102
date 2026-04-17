// VEC102 Instruction Set Architecture (ISA) Implementation
export enum InstructionType {
  ADD = "ADD",
  SUB = "SUB",
  MOV = "MOV",
  HLT = "HLT"
}

export interface Instruction {
  type: InstructionType;
  rd: string;
  rs1?: string;
  rs2?: string;
  imm?: number;
}

export class RegisterFile {
  private registers: { [key: string]: number } = {
    R0: 0, R1: 0, R2: 0, R3: 0, R4: 0, R5: 0
  };

  set(reg: string, value: number): void {
    this.registers[reg] = value;
  }

  get(reg: string): number {
    // Strict Equality Guard: Ensuring a number is always returned
    return this.registers[reg] ?? 0;
  }

  dump(): Record<string, number> {
    return this.registers;
  }
}