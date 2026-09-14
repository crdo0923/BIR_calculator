import { formatPHP, type ComputeResult, type EmployeePayrollResult } from "./tax-engine.ts";
import type { Language } from "./translations.ts";

export function generateFreelanceSummary(
  result: ComputeResult,
  period: "annual" | "quarterly",
  lang: Language
): string {
  const isEn = lang === "en";
  const now = new Date().toLocaleDateString(isEn ? "en-PH" : "fil-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const winner = result.winner;
  const winnerIs8 = winner === "8%";
  const winnerOption = winnerIs8
    ? result.eight
    : winner === "graduated-itemized" && result.graduatedItemized
    ? result.graduatedItemized
    : result.graduatedOSD;

  const totalGross = result.grossAnnual + (result.salaryAnnual || 0);
  const estimatedTax = winnerOption.taxAnnual;
  const estimatedTakeHome = Math.max(0, totalGross - estimatedTax);

  const recommendedLabel =
    result.grossAnnual > 3_000_000
      ? "Graduated Rates + 12% VAT (Required: Exceeds ₱3,000,000 threshold)"
      : winnerIs8
      ? "8% Flat Income Tax (Sec. 24(A)(2)(b), NIRC)"
      : winner === "graduated-itemized"
      ? "Graduated Rates with Itemized Deductions"
      : "Graduated Rates with 40% OSD (Sec. 24(A)(2)(a), NIRC)";

  return `================================================================================
                           BIR CO-PILOT PHILIPPINES
               TAX ESTIMATION SUMMARY & FILING CHEAT SHEET
                     Generated on: ${now}
                     Platform: https://tax-cal.crdo.site
================================================================================

1. TAXPAYER CLASSIFICATION
   Category:       Self-Employed / Professional / Sole Proprietor
   Filing Year:    2026 (Governed by TRAIN Law RA 10963 & EOPT Act RA 11976)
   View Basis:     ${period === "annual" ? "Annualized (Full Year)" : "Quarterly Cutoff"}

2. GROSS EARNINGS
   Gross Freelance / Business:   ${formatPHP(result.grossAnnual)}
   Compensation Salary (Mixed):  ${formatPHP(result.salaryAnnual || 0)}
   Total Combined Gross:         ${formatPHP(totalGross)}
   ${result.cwtAnnual > 0 ? `Withholding Tax Credits (2307): ${formatPHP(result.cwtAnnual)}` : "Withholding Tax Credits:       ₱0.00 (None applied)"}

3. REGIME COMPARISON SUMMARY
   -----------------------------------------------------------------------------
   A. 8% OPTIONAL FLAT TAX REGIME (Sec. 24(A)(2)(b))
      • Tax-Exempt Allowance:    ₱250,000.00 ${result.salaryAnnual > 0 ? "(Applied to salary first)" : ""}
      • Taxable Freelance Base:  ${formatPHP(result.eight.taxableAnnual)}
      • Income Tax Due:          ${formatPHP(result.eight.incomeTaxAnnual)}
      • Percentage Tax (2551Q):  EXEMPT (₱0.00)
      • Total Annual Tax:        ${formatPHP(result.eight.taxAnnual)}
      • Net Cash to Pay (CWT):   ${formatPHP(result.eight.netPayableAnnual)}

   B. GRADUATED RATES + 40% OSD (Sec. 24(A)(2)(a))
      • Standard Deduction (40%): ${formatPHP(result.grossAnnual * 0.4)}
      • Net Taxable Income:      ${formatPHP(result.graduatedOSD.taxableAnnual)}
      • Income Tax Due:          ${formatPHP(result.graduatedOSD.incomeTaxAnnual)}
      • 3% Percentage Tax:       ${formatPHP(result.graduatedOSD.percentageAnnual)}
      • Total Annual Tax:        ${formatPHP(result.graduatedOSD.taxAnnual)}
      • Net Cash to Pay (CWT):   ${formatPHP(result.graduatedOSD.netPayableAnnual)}
   -----------------------------------------------------------------------------

4. RECOMMENDED REGIME & ESTIMATED TAKE-HOME
   RECOMMENDED METHOD:    ${recommendedLabel}
   ANNUAL TAX ESTIMATE:   ${formatPHP(estimatedTax)} (~${formatPHP(winnerOption.taxQuarter)} / quarter)
   ANNUAL TAKE-HOME PAY:  ${formatPHP(estimatedTakeHome)} (${totalGross > 0 ? Math.round((estimatedTakeHome / totalGross) * 100) : 0}% of gross)
   ${result.savingsAnnual > 0 ? `ESTIMATED SAVINGS:     ${formatPHP(result.savingsAnnual)}/year by choosing this method!` : ""}

5. eBIRFORMS & COMPLIANCE GUIDE
   • 1st Quarter: BIR Form 1701Q (Deadline: May 15)
   • 2nd Quarter: BIR Form 1701Q (Deadline: August 15)
   • 3rd Quarter: BIR Form 1701Q (Deadline: November 15)
   • Annual:      BIR Form 1701A (Deadline: April 15)
   ${winnerIs8 ? "• BIR Form 2551Q: NOT REQUIRED (8% flat tax is exempt from percentage tax)" : "• BIR Form 2551Q: REQUIRED (Quarterly 3% Percentage Tax)"}
   • BIR Form 0605: PERMANENTLY REPEALED under the Ease of Paying Taxes (EOPT) Act

================================================================================
PRIVACY & SECURITY NOTICE:
This computation was calculated 100% locally in your client web browser.
Zero financial data or personally identifiable information was uploaded.

DISCLAIMER:
This summary is for informational estimation purposes based on prevailing
Philippine tax statutes. Consult a licensed Philippine CPA or your BIR RDO
for formal tax filing compliance.
================================================================================
`;
}

export function generateEmployeeSummary(
  result: EmployeePayrollResult,
  lang: Language
): string {
  const isEn = lang === "en";
  const now = new Date().toLocaleDateString(isEn ? "en-PH" : "fil-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `================================================================================
                           BIR CO-PILOT PHILIPPINES
                    EMPLOYEE SALARY & PAYSLIP BREAKDOWN
                     Generated on: ${now}
                     Platform: https://tax-cal.crdo.site
================================================================================

1. COMPENSATION SUMMARY
   Monthly Basic Salary:         ${formatPHP(result.monthlyBasic)}
   Semi-Monthly Cutoff (15/30):  ${formatPHP(result.monthlyBasic / 2)}
   Annual Basic Salary:          ${formatPHP(result.annualBasic)}
   DOLE Factor 261 Daily Rate:   ${formatPHP(result.dailyRate)} (based on 261 working days)
   Hourly Rate:                  ${formatPHP(result.hourlyRate)} (8 hrs/day)
   ${result.nonTaxableAllowances > 0 ? `Non-Taxable Allowances:       ${formatPHP(result.nonTaxableAllowances)} / month` : ""}
   ${result.taxableAllowances > 0 ? `Taxable Allowances:           ${formatPHP(result.taxableAllowances)} / month` : ""}

2. MANDATORY GOVERNMENT CONTRIBUTIONS (MONTHLY)
   -----------------------------------------------------------------------------
   Benefit Fund             Employee Share      Employer Share      Total Fund
   -----------------------------------------------------------------------------
   SSS Contribution:        ${formatPHP(result.sss.employee).padEnd(18)}  ${formatPHP(result.sss.employer).padEnd(18)}  ${formatPHP(result.sss.total)}
   PhilHealth (5% / 2):     ${formatPHP(result.philHealth.employee).padEnd(18)}  ${formatPHP(result.philHealth.employer).padEnd(18)}  ${formatPHP(result.philHealth.total)}
   Pag-IBIG Fund:           ${formatPHP(result.pagIbig.employee).padEnd(18)}  ${formatPHP(result.pagIbig.employer).padEnd(18)}  ${formatPHP(result.pagIbig.total)}
   -----------------------------------------------------------------------------
   Total Contributions:     ${formatPHP(result.totalGovtContributionsMonthly).padEnd(18)}  ${formatPHP(result.employerTotalMonthly).padEnd(18)}  ${formatPHP(result.totalGovtContributionsMonthly + result.employerTotalMonthly)}

3. WITHHOLDING TAX ON COMPENSATION (TRAIN LAW)
   Monthly Taxable Income:       ${formatPHP(result.taxableCompensationMonthly)}
   Monthly Withholding Tax:      ${formatPHP(result.withholdingTaxMonthly)}
   Semi-Monthly Withholding Tax: ${formatPHP(result.withholdingTaxSemiMonthly)} (per cutoff)
   Annual Withholding Tax:       ${formatPHP(result.withholdingTaxAnnual)}
   Effective Tax Rate:           ${(result.effectiveTaxRate * 100).toFixed(1)}%

4. NET TAKE-HOME PAY
   -----------------------------------------------------------------------------
   MONTHLY TAKE-HOME:            ${formatPHP(result.netPayMonthly)} (${result.monthlyBasic > 0 ? ((result.netPayMonthly / result.monthlyBasic) * 100).toFixed(1) : 0}% of basic)
   SEMI-MONTHLY (PER CUTOFF):    ${formatPHP(result.netPaySemiMonthly)}
   ANNUAL NET TAKE-HOME:         ${formatPHP(result.netPayAnnual)}
   -----------------------------------------------------------------------------

5. 13TH MONTH PAY & MANDATORY BONUSES
   Estimated 13th Month Pay:     ${formatPHP(result.thirteenthMonth.total)}
   Tax-Exempt Threshold (TRAIN): ₱90,000.00
   Tax-Exempt Portion:           ${formatPHP(result.thirteenthMonth.exempt)}
   Taxable Excess:               ${formatPHP(result.thirteenthMonth.taxable)}
   Tax Due on Bonus:             ${formatPHP(result.thirteenthMonth.taxDue)}
   Net 13th Month Take-Home:     ${formatPHP(result.thirteenthMonth.netAmount)}

================================================================================
PRIVACY & SECURITY NOTICE:
This computation was calculated 100% locally in your client web browser.
Zero payroll data or employee identifiers were uploaded or sent to any server.

DISCLAIMER:
This payslip estimation is based on Republic Act No. 10963 (TRAIN Law) and
prevailing SSS, PhilHealth, and Pag-IBIG circulars. Company policies, de minimis
benefits, and night differential may adjust final company payroll figures.
================================================================================
`;
}

export function downloadSummaryFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
