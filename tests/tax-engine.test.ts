import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  computeAll,
  computeGraduatedIncomeTax,
  computeSSSContribution,
  computePhilHealthContribution,
  computePagIbigContribution,
  computeWithholdingTaxMonthly,
  computeEmployeePayroll,
} from "../src/lib/tax-engine.ts";

test("Graduated Income Tax Brackets (TRAIN Law RA 10963)", () => {
  // 0 - 250,000: 0%
  assert.equal(computeGraduatedIncomeTax(250000), 0);

  // 250,001 - 400,000: 15% of excess
  // Taxable 300,000 -> 50,000 * 0.15 = 7,500
  assert.equal(computeGraduatedIncomeTax(300000), 7500);

  // 400,001 - 800,000: 22,500 + 20% of excess over 400k
  // Taxable 600,000 -> 22,500 + 200,000 * 0.20 = 62,500
  assert.equal(computeGraduatedIncomeTax(600000), 62500);

  // 800,001 - 2,000,000: 102,500 + 25% of excess over 800k
  // Taxable 1,000,000 -> 102,500 + 200,000 * 0.25 = 152,500
  assert.equal(computeGraduatedIncomeTax(1000000), 152500);

  // 2,000,001 - 8,000,000: 402,500 + 30% of excess over 2M
  // Taxable 3,000,000 -> 402,500 + 1,000,000 * 0.30 = 702,500
  assert.equal(computeGraduatedIncomeTax(3000000), 702500);
});

test("Pure Freelancer 8% Flat Rate vs Graduated OSD at ₱1,000,000 Gross", () => {
  const result = computeAll({
    grossInput: 1000000,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "none",
  });

  // 8% calculation: (1,000,000 - 250,000) * 0.08 = 60,000
  assert.equal(result.eight.taxAnnual, 60000);
  assert.equal(result.eight.eligible, true);

  // Graduated with 40% OSD:
  // Taxable = 1M * 0.6 = 600,000
  // Income tax on 600k = 22,500 + 200,000 * 0.2 = 62,500
  // 3% Percentage tax = 1M * 0.03 = 30,000
  // Total Graduated OSD = 92,500
  assert.equal(result.graduatedOSD.taxAnnual, 92500);

  // Winner should be 8% with ₱32,500 savings
  assert.equal(result.winner, "8%");
  assert.equal(result.savingsAnnual, 32500);
});

test("VAT Threshold Exceeded (> ₱3,000,000 Gross)", () => {
  const result = computeAll({
    grossInput: 3500000,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "none",
  });

  // 8% option must be ineligible
  assert.equal(result.eight.eligible, false);
  // Winner must be graduated
  assert.equal(result.winner, "graduated-OSD");
});

test("Form 2307 Creditable Withholding Tax (CWT)", () => {
  // With 5% CWT on ₱1,000,000 -> ₱50,000 withheld
  const result5 = computeAll({
    grossInput: 1000000,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "5%",
  });

  assert.equal(result5.cwtAnnual, 50000);
  // 8% tax is ₱60,000. Net cash payable = 60,000 - 50,000 = 10,000
  assert.equal(result5.eight.netPayableAnnual, 10000);
  assert.equal(result5.eight.cwtCreditAnnual, 0);

  // With 10% CWT on ₱1,000,000 -> ₱100,000 withheld
  const result10 = computeAll({
    grossInput: 1000000,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "10%",
  });

  assert.equal(result10.cwtAnnual, 100000);
  // 8% tax is ₱60,000. Net cash payable = 0, Carry-over tax credit = 40,000
  assert.equal(result10.eight.netPayableAnnual, 0);
  assert.equal(result10.eight.cwtCreditAnnual, 40000);
});

test("Mixed Income Earner RR 8-2018 (Salary + Freelance)", () => {
  // Compensation ₱500,000 + Freelance ₱500,000
  const result = computeAll({
    grossInput: 500000,
    period: "annual",
    isMixed: true,
    salaryAnnual: 500000,
    cwtMode: "none",
  });

  // Under RR 8-2018:
  // Salary tax: Taxable 500k -> 22,500 + 100,000 * 0.20 = 42,500
  // Freelance 8%: 500k * 0.08 = 40,000 (NO ₱250k deduction for mixed earner!)
  // Total 8% option tax: 42,500 + 40,000 = 82,500
  assert.equal(result.eight.taxAnnual, 82500);
  assert.equal(result.eight.salaryTaxAnnual, 42500);
  assert.equal(result.eight.freelanceTaxAnnual, 40000);
});

test("Mandatory Contributions (SSS, PhilHealth, Pag-IBIG 2024–2026)", () => {
  // SSS tests
  const sssMid = computeSSSContribution(35000);
  assert.equal(sssMid.msc, 30000); // Max MSC capped at 30k
  assert.equal(sssMid.employee, 1350); // 4.5% of 30k
  assert.equal(sssMid.employer, 2850); // 9.5% of 30k
  assert.equal(sssMid.ec, 30); // EC for MSC >= 15k

  const sssMin = computeSSSContribution(4000);
  assert.equal(sssMin.msc, 4000);
  assert.equal(sssMin.employee, 180);
  assert.equal(sssMin.employer, 380);
  assert.equal(sssMin.ec, 10); // EC for MSC < 15k

  // PhilHealth tests (5% total: 2.5% EE, 2.5% ER)
  const phMid = computePhilHealthContribution(35000);
  assert.equal(phMid.employee, 875);
  assert.equal(phMid.employer, 875);

  const phCeiling = computePhilHealthContribution(150000);
  assert.equal(phCeiling.employee, 2500); // 100k cap * 2.5%
  assert.equal(phCeiling.employer, 2500);

  // Pag-IBIG tests (2024 ₱10,000 salary cap)
  const pagIbig = computePagIbigContribution(35000);
  assert.equal(pagIbig.employee, 200); // 10,000 * 2%
  assert.equal(pagIbig.employer, 200);
});

test("Monthly Withholding Tax Table (TRAIN Law 2023-2026)", () => {
  // <= ₱20,833.33: 0%
  assert.equal(computeWithholdingTaxMonthly(20000), 0);
  assert.equal(computeWithholdingTaxMonthly(20833.33), 0);

  // ₱20,833.33 to ₱33,333.33: 15% of excess
  // On 30,000: (30000 - 20833.33) * 0.15 = 1375.0005
  assert.ok(Math.abs(computeWithholdingTaxMonthly(30000) - (30000 - 20833.33) * 0.15) < 0.01);

  // ₱33,333.33 to ₱66,666.67: ₱1,875 + 20% of excess
  assert.ok(Math.abs(computeWithholdingTaxMonthly(50000) - (1875 + (50000 - 33333.33) * 0.2)) < 0.01);

  // ₱66,666.67 to ₱166,666.67: ₱8,541.67 + 25% of excess
  assert.ok(Math.abs(computeWithholdingTaxMonthly(100000) - (8541.67 + (100000 - 66666.67) * 0.25)) < 0.01);
});

test("Full-Time Employee Payroll & DOLE Rates", () => {
  const payroll = computeEmployeePayroll({
    monthlyBasic: 35000,
  });

  // Annual basic: 35,000 * 12 = 420,000
  assert.equal(payroll.annualBasic, 420000);

  // Total govt employee deductions:
  // SSS (1,350) + PhilHealth (875) + Pag-IBIG (200) = 2,425
  assert.equal(payroll.totalGovtContributionsMonthly, 2425);

  // Taxable compensation monthly: 35,000 - 2,425 = 32,575
  assert.equal(payroll.taxableCompensationMonthly, 32575);

  // Withholding tax on 32,575:
  // Bracket: 20,833.33 to 33,333.33 -> 15% of (32,575 - 20,833.33) = 15% of 11,741.67 ≈ 1,761.25
  const expectedTax = (32575 - 20833.33) * 0.15;
  assert.ok(Math.abs(payroll.withholdingTaxMonthly - expectedTax) < 0.1);

  // Net Pay Monthly: 35,000 - 2,425 - withholdingTax
  const expectedNet = 35000 - 2425 - payroll.withholdingTaxMonthly;
  assert.ok(Math.abs(payroll.netPayMonthly - expectedNet) < 0.01);
  assert.equal(payroll.netPaySemiMonthly, payroll.netPayMonthly / 2);

  // 13th Month Pay: ₱35,000 <= ₱90,000 -> 100% exempt, 0 tax
  assert.equal(payroll.thirteenthMonth.total, 35000);
  assert.equal(payroll.thirteenthMonth.exempt, 35000);
  assert.equal(payroll.thirteenthMonth.taxable, 0);
  assert.equal(payroll.thirteenthMonth.netAmount, 35000);

  // DOLE Factor 261 standard:
  // Daily rate: 420,000 / 261 ≈ 1609.195
  assert.ok(Math.abs(payroll.dailyRate - 420000 / 261) < 0.01);
  assert.ok(Math.abs(payroll.hourlyRate - payroll.dailyRate / 8) < 0.01);

  // Employer Total Share: SSS ER (2,850) + EC (30) + PhilHealth ER (875) + Pag-IBIG ER (200) = 3,955
  assert.equal(payroll.employerTotalMonthly, 3955);
  // Total Cost to Company: 35,000 + 3,955 = 38,955
  assert.equal(payroll.totalCostToCompanyMonthly, 38955);
});

test("Audit: Edge Cases (Zero Gross, ₱250k Tax-Free Boundary, and ₱3M Boundary)", () => {
  // Edge Case 1: ₱0 Gross
  const zeroGross = computeAll({
    grossInput: 0,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "none",
  });
  assert.equal(zeroGross.eight.taxAnnual, 0);
  assert.equal(zeroGross.graduatedOSD.taxAnnual, 0);
  assert.equal(zeroGross.savingsAnnual, 0);
  assert.equal(zeroGross.eight.eligible, true);

  // Edge Case 2: Exact ₱250,000 Boundary (Tax-free under both)
  const boundary250k = computeAll({
    grossInput: 250000,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "none",
  });
  assert.equal(boundary250k.eight.taxAnnual, 0);
  assert.equal(boundary250k.eight.taxableAnnual, 0);
  assert.equal(boundary250k.graduatedOSD.incomeTaxAnnual, 0);
  // Note: Graduated still pays 3% Percentage Tax (₱7,500)
  assert.equal(boundary250k.graduatedOSD.percentageAnnual, 7500);
  assert.equal(boundary250k.winner, "8%");
  assert.equal(boundary250k.savingsAnnual, 7500);

  // Edge Case 3: Exact ₱3,000,000 Gross (Allowed on 8%)
  const boundary3M = computeAll({
    grossInput: 3000000,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "none",
  });
  assert.equal(boundary3M.eight.eligible, true);
  // 8% of (3,000,000 - 250,000) = 220,000
  assert.equal(boundary3M.eight.taxAnnual, 220000);

  // Edge Case 4: ₱3,000,001 Gross (Strictly Disallowed on 8%)
  const over3M = computeAll({
    grossInput: 3000001,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "none",
  });
  assert.equal(over3M.eight.eligible, false);
  assert.notEqual(over3M.winner, "8%");
});

test("Audit: CWT Overpayment & Refund Carry-Over Logic", () => {
  // Gross ₱200,000 with 10% CWT withheld (₱20,000 credit)
  // Tax due is ₱0 because gross < ₱250k
  const result = computeAll({
    grossInput: 200000,
    period: "annual",
    isMixed: false,
    salaryAnnual: 0,
    cwtMode: "10%",
  });

  assert.equal(result.cwtAnnual, 20000);
  assert.equal(result.eight.taxAnnual, 0);
  assert.equal(result.eight.netPayableAnnual, 0);
  // Excess CWT is ₱20,000 refundable/carry-over
  assert.equal(result.eight.cwtCreditAnnual, 20000);
});

test("Audit: Form Downloads & Offline Package Assets Integrity", () => {
  const formsDir = path.resolve(process.cwd(), "public/forms");
  assert.ok(fs.existsSync(formsDir), "public/forms directory must exist");

  const requiredFiles = [
    "BIR-Form-1701.pdf",
    "BIR-Form-1701A.pdf",
    "BIR-Form-1701Q.pdf",
    "BIR-Form-1901.pdf",
    "BIR-Form-2307.pdf",
    "BIR-Form-2316.pdf",
    "BIR-Form-2551Q.pdf",
    "Offline-eBIRForms-Package-v7.9.4.2.zip",
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(formsDir, file);
    assert.ok(fs.existsSync(filePath), `Form file ${file} must exist`);
    const stat = fs.statSync(filePath);
    assert.ok(stat.size > 1000, `Form file ${file} must be non-empty (size: ${stat.size} bytes)`);
  }
});

