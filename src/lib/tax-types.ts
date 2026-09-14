export type Period = "annual" | "quarterly";
export type EarnerType = "employed" | "freelance" | "mixed";

export interface ComputeInput {
  grossInput: number; // freelance gross as typed
  period: Period;
  isMixed: boolean;
  salaryAnnual: number; // for mixed/ employed
  expenses: number;
  cwtAmount: number; // BIR 2307 creditable withholding
}

export interface ComputeResult {
  grossAnnual: number;
  grossQuarterly: number;
  salaryAnnual: number;
  eight: {
    taxAnnual: number;
    taxQuarter: number;
    eligible: boolean;
    reason?: string;
    salaryTaxAnnual: number;
    freelanceTaxAnnual: number;
    netPayableAnnual: number;
    excessCWT: number;
  };
  graduatedOSD: {
    incomeTaxAnnual: number;
    percentageAnnual: number;
    totalAnnual: number;
    netPayableAnnual: number;
    excessCWT: number;
    incomeTaxQ: number;
    percentageQ: number;
    totalQ: number;
    taxableAnnual: number;
    combinedTaxableAnnual: number;
  };
  graduatedItemized: {
    incomeTaxAnnual: number;
    percentageAnnual: number;
    totalAnnual: number;
    netPayableAnnual: number;
    excessCWT: number;
    taxableAnnual: number;
    combinedTaxableAnnual: number;
  } | null;
  winner: "8%" | "graduated-OSD" | "tie";
  savingsAnnual: number;
  breakEvenRatio: number | null;
  breakEvenExpenses: number | null;
  recommendedForm: "1701A" | "1701";
  atcCode: "II012" | "II014";
}

export interface Deadline {
  q: string;
  period: string;
  form: string;
  due: string;
  note?: string;
}
