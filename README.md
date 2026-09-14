# BIR Co-Pilot PH 🇵🇭
### The Modern, Free & Open-Source Philippine Tax & Payslip Suite

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-11%2F11%20Passed-10b981)](tests/tax-engine.test.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**BIR Co-Pilot PH** is a client-side, zero-tracking, precision tax calculator designed specifically for **Filipino Freelancers, Self-Employed Professionals, Sole Proprietors, Mixed Income Earners, and Full-Time Corporate Employees**.

Built in 100% compliance with the **TRAIN Law (Republic Act No. 10963)** and the **Ease of Paying Taxes (EOPT) Act (Republic Act No. 11976)**.

---

## 🌟 Key Features

### 💼 1. Freelancer, Professional & Business Mode
- **8% Flat Rate vs. Graduated Rates (OSD & Itemized):**
  Instantly computes your tax liability across all regimes, recommends the optimal choice, and calculates your exact annual savings.
- **Form 2307 Creditable Withholding Tax (CWT) Deduction:**
  Enter 5%, 10%, or custom CWT amounts withheld by your clients. The engine automatically subtracts credits from Tax Due to output your exact Net Cash Payable to the BIR.
- **Break-Even Expense Analyzer:**
  Reveals the exact threshold where Graduated Itemized deductions become cheaper than the 8% Flat Rate.
- **eBIRForms Line-by-Line Helper:**
  Pre-computes exact figures for **Item 15, 16, 17, 18, 19, 20, and 21** for Form 1701A (Annual), 1701Q (Quarterly), and 1701 (Mixed). Includes **1-Click Text Worksheet Export (.txt)**.
- **100% Authentic Offline BIR PDF Forms:**
  Bundled local downloads for Form 1701A, 1701Q, 2551Q, 2307, 2316, 1901, and the complete **Offline eBIRForms Package v7.9.4.2 (.zip)**.
- **1-Tap Maya & GCash App Launchers:**
  Deep-link launchers (`paymaya://` / `gcash://`) to open your mobile banking apps directly from your phone, plus a 1-click **Copy Net Tax Payable** button.

### 🏢 2. Full-Time Employee Salary & Payslip Mode
- **Mandatory Statutory Contributions (2024–2026 Tables):**
  - **SSS:** 14% contribution rate (4.5% Employee / 9.5% Employer) + Employees' Compensation (EC) fund (*RA 11199 & PD 626*).
  - **PhilHealth:** 5% premium rate (2.5% Employee / 2.5% Employer, ₱10,000 floor & ₱100,000 ceiling) (*RA 11223*).
  - **Pag-IBIG (HDMF):** 2% rate with updated ₱10,000 monthly salary ceiling (₱200 EE / ₱200 ER) (*RA 9679*).
- **DOLE Factor 261 Hourly & Daily Rates:**
  Computes standard daily and hourly wages under the official DOLE 5-day work week formula `(Annual Salary / 261)`.
- **Total Cost to Company (CTC):**
  Itemizes employer contributions so both workers and founders understand true employment cost.
- **Tax-Exempt De Minimis & 13th Month Pay:**
  Collapsible guide on statutory non-taxable allowances under BIR RR 11-2018 and the ₱90,000 13th-month bonus threshold.

### 🌐 3. User Experience & Architecture
- **100% In-Browser Execution:** Zero tax or salary data ever leaves your device. No user accounts, logins, or server databases required.
- **Bilingual Interface:** Instant, interactive 🇺🇸 English ⇄ 🇵🇭 Tagalog language toggle.
- **Mobile-First Responsive Dock:** Fixed 4-button navigation bar with iOS/Android gesture safe-area insets.

---

## ⚖️ Statutory Legal Bases

| Deduction / Provision | Governing Law & Regulatory Basis |
| :--- | :--- |
| **Personal Income Tax Brackets** | Republic Act No. 10963 (TRAIN Law) & BIR RR 11-2018 |
| **8% Gross Income Tax Option** | Tax Code Section 24(A)(2)(b) & RR 8-2018 |
| **40% Optional Standard Deduction (OSD)** | Tax Code Section 34(L) |
| **Creditable Withholding Tax (CWT)** | BIR Form 2307 & Revenue Regulations No. 2-98 |
| **Ease of Paying Taxes (EOPT) Act** | Republic Act No. 11976 (Removal of ₱500 Annual Registration Fee) |
| **Social Security System (SSS)** | Republic Act No. 11199 (Social Security Act of 2018) & PD 626 |
| **PhilHealth Universal Health Care** | Republic Act No. 11223 (Universal Health Care Act) |
| **Pag-IBIG Home Development Mutual Fund** | Republic Act No. 9679 & Circular No. 460 |
| **13th Month Pay Statutory Cap (₱90,000)** | Presidential Decree No. 851 & RA 10963 Sec. 32(B)(7)(e) |
| **Daily & Hourly Wage Conversion** | DOLE Handbook on Workers' Statutory Monetary Benefits (Factor 261) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm, yarn, or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/crdo0923/BIR_calculator.git
cd BIR_calculator

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `--port 3002`) in your browser.

---

## 🧪 Testing & Verification

Run the automated precision unit tests covering TRAIN law graduated brackets, 8% vs OSD break-even, VAT threshold enforcement, and mandatory contribution tables:

```bash
# Run unit & compliance tests
npm test

# Run ESLint check
npm run lint

# Build production static bundle
npm run build
```

---

## 👤 Author & Acknowledgements

Created with ❤️ by **DEVjules** (Lead Architect).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
