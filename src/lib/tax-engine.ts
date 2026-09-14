// BIR Co-Pilot PH — Accurate TAX ENGINE
// TRAIN Law RA 10963 & Ease of Paying Taxes (EOPT) Act RA 11976
// 2023 onward graduated table (0% to 35%) & 8% income tax regulations (RR 8-2018)

export type Bracket = {
  over: number;
  notOver: number | null;
  base: number;
  rate: number;
  desc: string;
};

export const GRADUATED_TABLE_2023: Bracket[] = [
  { over: 0, notOver: 250_000, base: 0, rate: 0, desc: "0% up to ₱250k" },
  { over: 250_000, notOver: 400_000, base: 0, rate: 0.15, desc: "15% of excess over ₱250k" },
  { over: 400_000, notOver: 800_000, base: 22_500, rate: 0.2, desc: "₱22,500 + 20% of excess over ₱400k" },
  { over: 800_000, notOver: 2_000_000, base: 102_500, rate: 0.25, desc: "₱102,500 + 25% of excess over ₱800k" },
  { over: 2_000_000, notOver: 8_000_000, base: 402_500, rate: 0.3, desc: "₱402,500 + 30% of excess over ₱2M" },
  { over: 8_000_000, notOver: null, base: 2_202_500, rate: 0.35, desc: "₱2,202,500 + 35% of excess over ₱8M" },
];

export function computeGraduatedIncomeTax(taxableAnnual: number): number {
  if (taxableAnnual <= 0) return 0;
  if (taxableAnnual <= 250_000) return 0;
  if (taxableAnnual <= 400_000) return (taxableAnnual - 250_000) * 0.15;
  if (taxableAnnual <= 800_000) return 22_500 + (taxableAnnual - 400_000) * 0.2;
  if (taxableAnnual <= 2_000_000) return 102_500 + (taxableAnnual - 800_000) * 0.25;
  if (taxableAnnual <= 8_000_000) return 402_500 + (taxableAnnual - 2_000_000) * 0.3;
  return 2_202_500 + (taxableAnnual - 8_000_000) * 0.35;
}

export function compute8PercentTax(grossAnnual: number, isMixedEarner: boolean): { tax: number; eligible: boolean; reason?: string } {
  if (grossAnnual > 3_000_000) {
    return {
      tax: 0,
      eligible: false,
      reason: "Gross exceeds ₱3,000,000 VAT threshold. 8% option is strictly disallowed; mandatory Graduated rates + VAT apply.",
    };
  }
  if (grossAnnual <= 0) return { tax: 0, eligible: true };
  // Under RR 8-2018: Mixed earner gets the ₱250k deduction on compensation, NOT on freelance
  if (isMixedEarner) return { tax: grossAnnual * 0.08, eligible: true };
  const base = Math.max(0, grossAnnual - 250_000);
  return { tax: base * 0.08, eligible: true };
}

export function computeGraduatedWithOSD(grossAnnual: number): {
  incomeTax: number;
  percentageTax: number;
  total: number;
  taxable: number;
} {
  const taxable = Math.max(0, grossAnnual * 0.6); // 40% OSD leaves 60% taxable
  const incomeTax = computeGraduatedIncomeTax(taxable);
  const percentageTax = grossAnnual * 0.03; // 3% Section 116 Non-VAT percentage tax
  return { incomeTax, percentageTax, total: incomeTax + percentageTax, taxable };
}

export function computeGraduatedWithItemized(grossAnnual: number, expenses: number): {
  incomeTax: number;
  percentageTax: number;
  total: number;
  taxable: number;
} {
  const taxable = Math.max(0, grossAnnual - Math.max(0, expenses));
  const incomeTax = computeGraduatedIncomeTax(taxable);
  const percentageTax = grossAnnual * 0.03;
  return { incomeTax, percentageTax, total: incomeTax + percentageTax, taxable };
}

export type CWTMode = "none" | "5%" | "10%" | "custom";

export type ComputeInput = {
  grossInput: number;
  period: "annual" | "quarterly";
  isMixed: boolean;
  salaryAnnual: number;
  expenses?: number;
  cwtMode: CWTMode;
  cwtCustomAmount?: number;
};

export type OptionResult = {
  taxAnnual: number;
  netPayableAnnual: number;
  cwtCreditAnnual: number;
  taxQuarter: number;
  netPayableQuarter: number;
  eligible: boolean;
  reason?: string;
  salaryTaxAnnual: number;
  freelanceTaxAnnual: number;
  incomeTaxAnnual: number;
  percentageAnnual: number;
  taxableAnnual: number;
  combinedTaxableAnnual: number;
  recommendedForms: {
    quarterly: string[];
    annual: string;
    atcCode: string;
  };
};

export type ComputeResult = {
  grossAnnual: number;
  grossQuarterly: number;
  salaryAnnual: number;
  cwtAnnual: number;
  cwtQuarterly: number;
  eight: OptionResult;
  graduatedOSD: OptionResult;
  graduatedItemized: OptionResult | null;
  winner: "8%" | "graduated-OSD" | "graduated-itemized" | "tie";
  savingsAnnual: number;
  breakEvenRatio: number | null;
  breakEvenExpenses: number | null;
};

export function computeAll(inp: ComputeInput): ComputeResult {
  const freelanceGrossAnnual = inp.period === "quarterly" ? inp.grossInput * 4 : inp.grossInput;
  const grossQuarterly = inp.period === "quarterly" ? inp.grossInput : inp.grossInput / 4;
  const salaryAnnual = inp.isMixed ? Math.max(0, inp.salaryAnnual) : 0;
  const expensesAnnual = Math.max(0, inp.expenses || 0);

  // Compute Form 2307 Creditable Withholding Tax (CWT)
  let cwtAnnual = 0;
  if (inp.cwtMode === "5%") {
    cwtAnnual = freelanceGrossAnnual * 0.05;
  } else if (inp.cwtMode === "10%") {
    cwtAnnual = freelanceGrossAnnual * 0.10;
  } else if (inp.cwtMode === "custom") {
    cwtAnnual = Math.max(0, inp.cwtCustomAmount || 0);
  }
  const cwtQuarterly = cwtAnnual / 4;

  // 1. 8% Option
  const eightFreelance = compute8PercentTax(freelanceGrossAnnual, inp.isMixed);
  const salaryTaxAnnual = inp.isMixed ? computeGraduatedIncomeTax(salaryAnnual) : 0;

  let eightTaxAnnual = 0;
  let eightEligible = eightFreelance.eligible;
  const eightReason = eightFreelance.reason;

  if (!inp.isMixed) {
    eightTaxAnnual = eightFreelance.tax;
  } else {
    eightTaxAnnual = salaryTaxAnnual + eightFreelance.tax;
    if (!eightFreelance.eligible) {
      eightEligible = false;
    }
  }

  const eightNetPayableAnnual = Math.max(0, eightTaxAnnual - cwtAnnual);
  const eightCreditAnnual = Math.max(0, cwtAnnual - eightTaxAnnual);

  const eightResult: OptionResult = {
    taxAnnual: eightTaxAnnual,
    netPayableAnnual: eightNetPayableAnnual,
    cwtCreditAnnual: eightCreditAnnual,
    taxQuarter: eightTaxAnnual / 4,
    netPayableQuarter: eightNetPayableAnnual / 4,
    eligible: eightEligible,
    reason: eightReason,
    salaryTaxAnnual,
    freelanceTaxAnnual: eightFreelance.tax,
    incomeTaxAnnual: eightTaxAnnual,
    percentageAnnual: 0,
    taxableAnnual: !inp.isMixed ? Math.max(0, freelanceGrossAnnual - 250_000) : freelanceGrossAnnual,
    combinedTaxableAnnual: !inp.isMixed ? Math.max(0, freelanceGrossAnnual - 250_000) : salaryAnnual + freelanceGrossAnnual,
    recommendedForms: {
      quarterly: ["BIR Form 1701Q (Quarterly Income Tax)"],
      annual: inp.isMixed ? "BIR Form 1701 (Mixed Earner Regular)" : "BIR Form 1701A (Purely Self-Employed Simplified)",
      atcCode: "II012",
    },
  };

  // 2. Graduated + OSD (40%)
  let gradOSDIncomeTax = 0;
  let gradOSDPctTax = 0;
  let freelanceTaxableOSD = 0;
  let combinedTaxableOSD = 0;

  if (!inp.isMixed) {
    const r = computeGraduatedWithOSD(freelanceGrossAnnual);
    gradOSDIncomeTax = r.incomeTax;
    gradOSDPctTax = r.percentageTax;
    freelanceTaxableOSD = r.taxable;
    combinedTaxableOSD = r.taxable;
  } else {
    freelanceTaxableOSD = freelanceGrossAnnual * 0.6;
    combinedTaxableOSD = salaryAnnual + freelanceTaxableOSD;
    gradOSDIncomeTax = computeGraduatedIncomeTax(combinedTaxableOSD);
    gradOSDPctTax = freelanceGrossAnnual * 0.03;
  }

  const gradOSDTotalAnnual = gradOSDIncomeTax + gradOSDPctTax;
  const gradOSDNetPayableAnnual = Math.max(0, gradOSDTotalAnnual - cwtAnnual);
  const gradOSDCreditAnnual = Math.max(0, cwtAnnual - gradOSDTotalAnnual);

  const gradOSDResult: OptionResult = {
    taxAnnual: gradOSDTotalAnnual,
    netPayableAnnual: gradOSDNetPayableAnnual,
    cwtCreditAnnual: gradOSDCreditAnnual,
    taxQuarter: gradOSDTotalAnnual / 4,
    netPayableQuarter: gradOSDNetPayableAnnual / 4,
    eligible: true,
    salaryTaxAnnual,
    freelanceTaxAnnual: gradOSDIncomeTax,
    incomeTaxAnnual: gradOSDIncomeTax,
    percentageAnnual: gradOSDPctTax,
    taxableAnnual: freelanceTaxableOSD,
    combinedTaxableAnnual: combinedTaxableOSD,
    recommendedForms: {
      quarterly: ["BIR Form 1701Q (Income Tax)", "BIR Form 2551Q (3% Percentage Tax)"],
      annual: inp.isMixed ? "BIR Form 1701 (Regular Return)" : "BIR Form 1701A (OSD Simplified)",
      atcCode: "II014",
    },
  };

  // 3. Graduated + Itemized Deductions (if expenses > 0)
  let gradItemizedResult: OptionResult | null = null;
  if (expensesAnnual > 0) {
    let itemizedIncomeTax = 0;
    let freelanceTaxableItemized = 0;
    let combinedTaxableItemized = 0;

    if (!inp.isMixed) {
      const r = computeGraduatedWithItemized(freelanceGrossAnnual, expensesAnnual);
      itemizedIncomeTax = r.incomeTax;
      freelanceTaxableItemized = r.taxable;
      combinedTaxableItemized = r.taxable;
    } else {
      freelanceTaxableItemized = Math.max(0, freelanceGrossAnnual - expensesAnnual);
      combinedTaxableItemized = salaryAnnual + freelanceTaxableItemized;
      itemizedIncomeTax = computeGraduatedIncomeTax(combinedTaxableItemized);
    }

    const itemizedPctTax = freelanceGrossAnnual * 0.03;
    const itemizedTotalAnnual = itemizedIncomeTax + itemizedPctTax;
    const itemizedNetPayable = Math.max(0, itemizedTotalAnnual - cwtAnnual);
    const itemizedCredit = Math.max(0, cwtAnnual - itemizedTotalAnnual);

    gradItemizedResult = {
      taxAnnual: itemizedTotalAnnual,
      netPayableAnnual: itemizedNetPayable,
      cwtCreditAnnual: itemizedCredit,
      taxQuarter: itemizedTotalAnnual / 4,
      netPayableQuarter: itemizedNetPayable / 4,
      eligible: true,
      salaryTaxAnnual,
      freelanceTaxAnnual: itemizedIncomeTax,
      incomeTaxAnnual: itemizedIncomeTax,
      percentageAnnual: itemizedPctTax,
      taxableAnnual: freelanceTaxableItemized,
      combinedTaxableAnnual: combinedTaxableItemized,
      recommendedForms: {
        quarterly: ["BIR Form 1701Q (Income Tax)", "BIR Form 2551Q (3% Percentage Tax)"],
        annual: "BIR Form 1701 (Regular Return required for Itemized)",
        atcCode: "II014",
      },
    };
  }

  // Determine winner based on lowest total tax liability
  let winner: ComputeResult["winner"] = "tie";
  let lowestTax = gradOSDTotalAnnual;
  winner = "graduated-OSD";

  if (eightEligible && eightTaxAnnual < lowestTax) {
    lowestTax = eightTaxAnnual;
    winner = "8%";
  }

  if (gradItemizedResult && gradItemizedResult.taxAnnual < lowestTax) {
    lowestTax = gradItemizedResult.taxAnnual;
    winner = "graduated-itemized";
  }

  if (eightEligible && Math.abs(eightTaxAnnual - gradOSDTotalAnnual) < 1 && (!gradItemizedResult || gradItemizedResult.taxAnnual >= eightTaxAnnual)) {
    winner = "tie";
  }

  // Savings computation
  let savingsAnnual = 0;
  if (winner === "8%") {
    savingsAnnual = gradOSDTotalAnnual - eightTaxAnnual;
  } else if (winner === "graduated-OSD" && eightEligible) {
    savingsAnnual = eightTaxAnnual - gradOSDTotalAnnual;
  } else if (winner === "graduated-itemized" && eightEligible) {
    savingsAnnual = eightTaxAnnual - (gradItemizedResult?.taxAnnual || 0);
  }

  // Break-even analysis: expense ratio where Itemized Total == 8% Total
  let breakEvenRatio: number | null = null;
  let breakEvenExpenses: number | null = null;

  if (eightEligible && freelanceGrossAnnual > 0) {
    const targetIncomeTax = eightTaxAnnual - freelanceGrossAnnual * 0.03;
    const taxAtZeroExp = !inp.isMixed
      ? computeGraduatedIncomeTax(freelanceGrossAnnual)
      : computeGraduatedIncomeTax(salaryAnnual + freelanceGrossAnnual);
    const totalAtZero = taxAtZeroExp + freelanceGrossAnnual * 0.03;

    if (totalAtZero <= eightTaxAnnual + 1) {
      breakEvenRatio = 0;
      breakEvenExpenses = 0;
    } else {
      let lo = 0;
      let hi = 1;
      let best = 1;
      for (let i = 0; i < 50; i++) {
        const mid = (lo + hi) / 2;
        const freelanceTaxable = freelanceGrossAnnual * (1 - mid);
        const combined = inp.isMixed ? salaryAnnual + freelanceTaxable : freelanceTaxable;
        const t = computeGraduatedIncomeTax(combined);
        if (Math.abs(t - targetIncomeTax) < 1) {
          best = mid;
          break;
        }
        if (t > targetIncomeTax) lo = mid;
        else hi = mid;
        best = mid;
      }
      const freelanceTaxableBest = freelanceGrossAnnual * (1 - best);
      const combinedBest = inp.isMixed ? salaryAnnual + freelanceTaxableBest : freelanceTaxableBest;
      const check = computeGraduatedIncomeTax(combinedBest) + freelanceGrossAnnual * 0.03;
      if (check <= eightTaxAnnual + 500) {
        breakEvenRatio = best;
        breakEvenExpenses = Math.round(freelanceGrossAnnual * best);
      }
    }
  }

  return {
    grossAnnual: freelanceGrossAnnual,
    grossQuarterly,
    salaryAnnual,
    cwtAnnual,
    cwtQuarterly,
    eight: eightResult,
    graduatedOSD: gradOSDResult,
    graduatedItemized: gradItemizedResult,
    winner,
    savingsAnnual,
    breakEvenRatio,
    breakEvenExpenses,
  };
}

export const DEADLINES_2026 = {
  iq: [
    { q: "Q1", period: "Jan 1 – Mar 31", form: "1701Q", due: "May 15, 2026", desc: "First Quarter Income Tax Return" },
    { q: "Q2", period: "Apr 1 – Jun 30", form: "1701Q", due: "Aug 15, 2026", desc: "Second Quarter Income Tax Return" },
    { q: "Q3", period: "Jul 1 – Sep 30", form: "1701Q", due: "Nov 15, 2026", desc: "Third Quarter Income Tax Return" },
    { q: "Annual", period: "Full Year 2026", form: "1701 / 1701A", due: "Apr 15, 2027", desc: "Annual Income Tax Return" },
  ],
  pq: [
    { q: "Q1", period: "Jan 1 – Mar 31", form: "2551Q", due: "Apr 25, 2026", desc: "3% Percentage Tax (Graduated only)" },
    { q: "Q2", period: "Apr 1 – Jun 30", form: "2551Q", due: "Jul 25, 2026", desc: "3% Percentage Tax (Graduated only)" },
    { q: "Q3", period: "Jul 1 – Sep 30", form: "2551Q", due: "Oct 25, 2026", desc: "3% Percentage Tax (Graduated only)" },
    { q: "Q4", period: "Oct 1 – Dec 31", form: "2551Q", due: "Jan 25, 2027", desc: "3% Percentage Tax (Graduated only)" },
  ],
};

export function formatPHP(n: number): string {
  return "₱" + Math.round(n).toLocaleString("en-PH");
}

export function formatPHPExact(n: number): string {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// =========================================================================
// FULL-TIME EMPLOYEE (COMPENSATION) PAYROLL & TAX ENGINE
// Based on RA 10963 (TRAIN Law), RA 11199 (SSS), RA 11223 (UHC PhilHealth),
// and HDMF Circular 460 (Pag-IBIG 2024+)
// =========================================================================

export type SSSContribution = {
  employee: number;
  employer: number;
  ec: number;
  total: number;
  msc: number;
};

export function computeSSSContribution(monthlySalary: number): SSSContribution {
  if (monthlySalary <= 0) {
    return { employee: 0, employer: 0, ec: 0, total: 0, msc: 0 };
  }

  // Bracket MSC lookup: Min ₱4,000, Max ₱30,000 (steps of ₱500)
  let msc = 4000;
  if (monthlySalary < 4250) {
    msc = 4000;
  } else if (monthlySalary >= 29750) {
    msc = 30000;
  } else {
    msc = Math.floor((monthlySalary - 4250) / 500) * 500 + 4500;
    msc = Math.min(30000, Math.max(4000, msc));
  }

  // 14% total contribution: 4.5% employee, 9.5% employer
  // Plus EC (Employees' Compensation fund): ₱10 for MSC < ₱15,000; ₱30 for MSC >= ₱15,000 (100% employer paid)
  const employee = Math.round(msc * 0.045);
  const employer = Math.round(msc * 0.095);
  const ec = msc >= 15000 ? 30 : 10;

  return {
    employee,
    employer,
    ec,
    total: employee + employer + ec,
    msc,
  };
}

export type PhilHealthContribution = {
  employee: number;
  employer: number;
  total: number;
};

export function computePhilHealthContribution(monthlySalary: number): PhilHealthContribution {
  if (monthlySalary <= 0) {
    return { employee: 0, employer: 0, total: 0 };
  }

  // 2024-2026: 5% total (2.5% employee, 2.5% employer)
  // Floor: ₱10,000 (₱250 EE), Ceiling: ₱100,000 (₱2,500 EE)
  const clampedSalary = Math.min(100000, Math.max(10000, monthlySalary));
  const employee = clampedSalary * 0.025;
  const employer = clampedSalary * 0.025;

  return {
    employee,
    employer,
    total: employee + employer,
  };
}

export type PagIbigContribution = {
  employee: number;
  employer: number;
  total: number;
};

export function computePagIbigContribution(monthlySalary: number): PagIbigContribution {
  if (monthlySalary <= 0) {
    return { employee: 0, employer: 0, total: 0 };
  }

  // Effective Feb 2024: Max monthly salary cap increased to ₱10,000
  // Employee: 2% of salary up to ₱10,000 -> max ₱200/mo
  // Employer: 2% of salary up to ₱10,000 -> max ₱200/mo
  const clampedSalary = Math.min(10000, monthlySalary);
  const rate = monthlySalary <= 1500 ? 0.01 : 0.02;
  const employee = clampedSalary * rate;
  const employer = clampedSalary * 0.02;

  return {
    employee,
    employer,
    total: employee + employer,
  };
}

export function computeWithholdingTaxMonthly(taxableCompensation: number): number {
  if (taxableCompensation <= 20833.33) {
    return 0;
  }
  if (taxableCompensation <= 33333.33) {
    return (taxableCompensation - 20833.33) * 0.15;
  }
  if (taxableCompensation <= 66666.67) {
    return 1875 + (taxableCompensation - 33333.33) * 0.2;
  }
  if (taxableCompensation <= 166666.67) {
    return 8541.67 + (taxableCompensation - 66666.67) * 0.25;
  }
  if (taxableCompensation <= 666666.67) {
    return 33541.67 + (taxableCompensation - 166666.67) * 0.3;
  }
  return 183541.67 + (taxableCompensation - 666666.67) * 0.35;
}

export type EmployeePayrollInput = {
  monthlyBasic: number;
  nonTaxableAllowances?: number;
  taxableAllowances?: number;
  thirteenthMonthBonus?: number;
};

export type EmployeePayrollResult = {
  monthlyBasic: number;
  annualBasic: number;
  dailyRate: number; // DOLE Factor 261 standard: (annualBasic / 261)
  hourlyRate: number; // dailyRate / 8
  nonTaxableAllowances: number;
  taxableAllowances: number;
  sss: SSSContribution;
  philHealth: PhilHealthContribution;
  pagIbig: PagIbigContribution;
  totalGovtContributionsMonthly: number;
  totalGovtContributionsAnnual: number;
  employerTotalMonthly: number; // SSS + EC + PhilHealth + Pag-IBIG
  employerTotalAnnual: number;
  totalCostToCompanyMonthly: number; // Basic + Allowances + Employer Gov't Share
  totalCostToCompanyAnnual: number;
  taxableCompensationMonthly: number;
  taxableCompensationAnnual: number;
  withholdingTaxMonthly: number;
  withholdingTaxSemiMonthly: number;
  withholdingTaxAnnual: number;
  netPayMonthly: number;
  netPaySemiMonthly: number; // 15th & 30th Cutoff
  netPayAnnual: number;
  effectiveTaxRate: number;
  thirteenthMonth: {
    total: number;
    exempt: number;
    taxable: number;
    taxDue: number;
    netAmount: number;
  };
};

export function computeEmployeePayroll(input: EmployeePayrollInput): EmployeePayrollResult {
  const monthlyBasic = Math.max(0, input.monthlyBasic);
  const annualBasic = monthlyBasic * 12;
  const nonTaxableMonthly = Math.max(0, input.nonTaxableAllowances || 0);
  const taxableAllowancesMonthly = Math.max(0, input.taxableAllowances || 0);

  // DOLE Standard rates: 261 working days/year for 5-day work week
  const dailyRate = annualBasic > 0 ? annualBasic / 261 : 0;
  const hourlyRate = dailyRate > 0 ? dailyRate / 8 : 0;

  // Mandatory government deductions
  const sss = computeSSSContribution(monthlyBasic);
  const philHealth = computePhilHealthContribution(monthlyBasic);
  const pagIbig = computePagIbigContribution(monthlyBasic);

  // Employee share
  const totalGovtMonthly = sss.employee + philHealth.employee + pagIbig.employee;
  const totalGovtAnnual = totalGovtMonthly * 12;

  // Employer share (including SSS EC fund)
  const employerTotalMonthly = sss.employer + sss.ec + philHealth.employer + pagIbig.employer;
  const employerTotalAnnual = employerTotalMonthly * 12;

  // Taxable compensation per month
  const totalMonthlyGross = monthlyBasic + taxableAllowancesMonthly;
  const taxableCompensationMonthly = Math.max(0, totalMonthlyGross - totalGovtMonthly);
  const taxableCompensationAnnual = taxableCompensationMonthly * 12;

  // Withholding tax
  const withholdingTaxMonthly = computeWithholdingTaxMonthly(taxableCompensationMonthly);
  const withholdingTaxSemiMonthly = withholdingTaxMonthly / 2;
  const withholdingTaxAnnual = withholdingTaxMonthly * 12;

  // Net Take-home pay
  const netPayMonthly = totalMonthlyGross + nonTaxableMonthly - (totalGovtMonthly + withholdingTaxMonthly);
  const netPaySemiMonthly = netPayMonthly / 2;

  // 13th month pay & bonus (₱90,000 tax-free ceiling under TRAIN Law)
  const thirteenthMonthTotal = input.thirteenthMonthBonus !== undefined ? input.thirteenthMonthBonus : monthlyBasic;
  const thirteenthMonthExempt = Math.min(90000, thirteenthMonthTotal);
  const thirteenthMonthTaxable = Math.max(0, thirteenthMonthTotal - 90000);
  const thirteenthMonthTaxDue = thirteenthMonthTaxable > 0 ? thirteenthMonthTaxable * 0.20 : 0; // estimated marginal rate
  const thirteenthMonthNetAmount = thirteenthMonthTotal - thirteenthMonthTaxDue;

  const netPayAnnual = netPayMonthly * 12 + thirteenthMonthNetAmount;
  const effectiveTaxRate = totalMonthlyGross > 0 ? (withholdingTaxMonthly / totalMonthlyGross) * 100 : 0;

  // Total Cost to Company (CTC) = Gross + Non-Taxable Allowances + Employer Gov't Share
  const totalCostToCompanyMonthly = totalMonthlyGross + nonTaxableMonthly + employerTotalMonthly;
  const totalCostToCompanyAnnual = totalCostToCompanyMonthly * 12 + thirteenthMonthTotal;

  return {
    monthlyBasic,
    annualBasic,
    dailyRate,
    hourlyRate,
    nonTaxableAllowances: nonTaxableMonthly,
    taxableAllowances: taxableAllowancesMonthly,
    sss,
    philHealth,
    pagIbig,
    totalGovtContributionsMonthly: totalGovtMonthly,
    totalGovtContributionsAnnual: totalGovtAnnual,
    employerTotalMonthly,
    employerTotalAnnual,
    totalCostToCompanyMonthly,
    totalCostToCompanyAnnual,
    taxableCompensationMonthly,
    taxableCompensationAnnual,
    withholdingTaxMonthly,
    withholdingTaxSemiMonthly,
    withholdingTaxAnnual,
    netPayMonthly,
    netPaySemiMonthly,
    netPayAnnual,
    effectiveTaxRate,
    thirteenthMonth: {
      total: thirteenthMonthTotal,
      exempt: thirteenthMonthExempt,
      taxable: thirteenthMonthTaxable,
      taxDue: thirteenthMonthTaxDue,
      netAmount: thirteenthMonthNetAmount,
    },
  };
}
