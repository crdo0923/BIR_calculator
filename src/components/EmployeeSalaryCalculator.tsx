"use client";

import React, { useState, useMemo } from "react";
import { computeEmployeePayroll, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import {
  Building2,
  CreditCard,
  FileText,
  ShieldCheck,
  Wallet,
  X,
  Gift,
  ChevronDown,
  ChevronUp,
  Info,
  Scale,
} from "lucide-react";

const SALARY_PRESETS = [
  { label: "₱18k (Min)", value: 18000 },
  { label: "₱25k (Entry)", value: 25000 },
  { label: "₱35k (Junior)", value: 35000 },
  { label: "₱50k (Mid)", value: 50000 },
  { label: "₱75k (Senior)", value: 75000 },
  { label: "₱100k (Lead)", value: 100000 },
  { label: "₱150k (Exec)", value: 150000 },
];

interface EmployeeSalaryCalculatorProps {
  lang: Language;
  onOpenGlossary?: () => void;
}

export function EmployeeSalaryCalculator({ lang, onOpenGlossary }: EmployeeSalaryCalculatorProps) {
  const t = translations[lang];
  const [salaryDigits, setSalaryDigits] = useState("35000");
  const [viewFrequency, setViewFrequency] = useState<"monthly" | "semi-monthly" | "annual">("monthly");
  const [showAllowances, setShowAllowances] = useState(false);
  const [showDeMinimis, setShowDeMinimis] = useState(false);
  const [showEmployerShare, setShowEmployerShare] = useState(false);
  const [showStatutoryBasis, setShowStatutoryBasis] = useState(false);
  const [nonTaxableDigits, setNonTaxableDigits] = useState("");
  const [taxableAllowancesDigits, setTaxableAllowancesDigits] = useState("");

  const monthlyBasic = Number(salaryDigits || 0);
  const nonTaxableAllowances = Number(nonTaxableDigits || 0);
  const taxableAllowances = Number(taxableAllowancesDigits || 0);

  const result = useMemo(
    () =>
      computeEmployeePayroll({
        monthlyBasic,
        nonTaxableAllowances: showAllowances ? nonTaxableAllowances : 0,
        taxableAllowances: showAllowances ? taxableAllowances : 0,
      }),
    [monthlyBasic, showAllowances, nonTaxableAllowances, taxableAllowances]
  );

  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 9);
    setter(cleaned);
  };

  const displaySalary = salaryDigits ? Number(salaryDigits).toLocaleString("en-PH") : "";
  const displayNonTaxable = nonTaxableDigits ? Number(nonTaxableDigits).toLocaleString("en-PH") : "";
  const displayTaxableAllowances = taxableAllowancesDigits ? Number(taxableAllowancesDigits).toLocaleString("en-PH") : "";

  // Dynamic multiplier for current view frequency
  const multiplier = viewFrequency === "semi-monthly" ? 0.5 : viewFrequency === "annual" ? 12 : 1;
  const frequencyLabel =
    viewFrequency === "semi-monthly"
      ? (lang === "en" ? "Per Cutoff (15th / 30th)" : "Bawat Cutoff (Kinsenas/Katapusan)")
      : viewFrequency === "annual"
      ? (lang === "en" ? "Per Year" : "Bawat Taon")
      : (lang === "en" ? "Per Month" : "Bawat Buwan");

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout for Employee Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (5 cols): Salary Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6 transition-colors duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/50 dark:border-sky-800/60 flex items-center justify-center text-sky-700 dark:text-sky-300">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">{t.empMonthlyCompTitle}</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                {t.empCategoryBadge}
              </span>
            </div>

            {/* Basic Salary Input */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="basic-salary-input" className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  {t.empBasicSalaryLabel}
                  <span className="text-sky-600 dark:text-sky-400 font-medium text-[11px]">{t.empBasicSalarySub}</span>
                </label>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">{t.freqMonthly}</span>
              </div>

              <div className="mt-2 relative flex items-center border-2 border-zinc-200 dark:border-zinc-700 focus-within:border-sky-600 dark:focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/15 rounded-2xl px-3.5 py-3 bg-white dark:bg-zinc-950 transition shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center mr-3 border border-sky-200/60 dark:border-sky-800/60 shrink-0 select-none">
                  <span className="font-serif text-base leading-none font-black">₱</span>
                </div>
                <input
                  id="basic-salary-input"
                  type="text"
                  inputMode="numeric"
                  value={displaySalary}
                  onChange={(e) => handleNumericInput(e.target.value, setSalaryDigits)}
                  placeholder="35,000"
                  className="w-full text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 outline-none bg-transparent tabular-nums placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                />
                {salaryDigits && (
                  <button
                    type="button"
                    onClick={() => setSalaryDigits("")}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-lg transition cursor-pointer shrink-0"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>{t.empAnnualBasic.replace("{amount}", formatPHP(result.annualBasic))}</span>
                {monthlyBasic <= 20833.33 && monthlyBasic > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.empZeroTaxNotice}</span>
                )}
              </div>

              {/* Quick Monthly Presets */}
              <div className="mt-3">
                <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mb-1.5">{t.empBracketsLabel}</div>
                <div className="flex flex-wrap gap-1.5">
                  {SALARY_PRESETS.map((p) => {
                    const isSelected = Number(salaryDigits) === p.value;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setSalaryDigits(String(p.value))}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition border cursor-pointer ${
                          isSelected
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xs"
                            : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200/90 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* View Frequency Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">{t.displayFreqLabel}</label>
              <div className="grid grid-cols-3 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl gap-1 border border-zinc-200/60 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setViewFrequency("monthly")}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition text-center cursor-pointer ${
                    viewFrequency === "monthly"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {t.freqMonthly}
                </button>
                <button
                  type="button"
                  onClick={() => setViewFrequency("semi-monthly")}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition text-center cursor-pointer ${
                    viewFrequency === "semi-monthly"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {t.freqSemiMonthly}
                </button>
                <button
                  type="button"
                  onClick={() => setViewFrequency("annual")}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition text-center cursor-pointer ${
                    viewFrequency === "annual"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {t.freqAnnual}
                </button>
              </div>
            </div>

            {/* Optional Allowances Dropdown */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
              {!showAllowances ? (
                <button
                  type="button"
                  onClick={() => setShowAllowances(true)}
                  className="w-full py-2.5 px-3 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {t.addAllowancesBtn}
                </button>
              ) : (
                <div className="space-y-3 p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t.allowancesTitle}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAllowances(false);
                        setNonTaxableDigits("");
                        setTaxableAllowancesDigits("");
                      }}
                      className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 underline cursor-pointer"
                    >
                      {t.removeBtn}
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block">
                      {t.nonTaxableAllowancesLabel}
                    </label>
                    <div className="mt-1 flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-white dark:bg-zinc-900">
                      <span className="text-zinc-400 dark:text-zinc-500 font-serif text-sm mr-1.5">₱</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={displayNonTaxable}
                        onChange={(e) => handleNumericInput(e.target.value, setNonTaxableDigits)}
                        placeholder="e.g. 2,000"
                        className="w-full text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none bg-transparent tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block">
                      {t.taxableAllowancesLabel}
                    </label>
                    <div className="mt-1 flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-white dark:bg-zinc-900">
                      <span className="text-zinc-400 dark:text-zinc-500 font-serif text-sm mr-1.5">₱</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={displayTaxableAllowances}
                        onChange={(e) => handleNumericInput(e.target.value, setTaxableAllowancesDigits)}
                        placeholder="e.g. 3,000"
                        className="w-full text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none bg-transparent tabular-nums"
                      />
                    </div>
                  </div>

                  {/* De Minimis Tax-Free Guide Accordion */}
                  <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setShowDeMinimis(!showDeMinimis)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-sky-800 dark:text-sky-400 hover:text-sky-950 dark:hover:text-sky-300 py-1 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>{t.deMinimisGuideTitle}</span>
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        {showDeMinimis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {showDeMinimis && (
                      <div className="mt-2 p-2.5 bg-white dark:bg-zinc-900 border border-sky-200/70 dark:border-sky-800/70 rounded-lg text-[10.5px] text-zinc-600 dark:text-zinc-400 space-y-1 leading-relaxed">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between mb-1">
                          <span>{t.deMinimisGuideDesc}</span>
                          <span className="text-[9.5px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 px-1.5 py-0.2 rounded">
                            {t.deMinimisGuideBadge}
                          </span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-600 dark:text-zinc-400">
                          <li>{t.deMinimisRice}</li>
                          <li>{t.deMinimisUniform}</li>
                          <li>{t.deMinimisLaundry}</li>
                          <li>{t.deMinimisMedical}</li>
                          <li>{t.deMinimisAchievement}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form 2316 & Substituted Filing Explainer Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
              <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{t.form2316Title}</span>
            </div>
            <p className="leading-relaxed">{t.form2316Desc}</p>
            <div className="p-2.5 bg-sky-50/70 dark:bg-sky-950/50 border border-sky-200/60 dark:border-sky-800/60 rounded-xl text-sky-950 dark:text-sky-200 text-[11.5px] leading-relaxed">
              {t.substitutedFilingNotice}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Payslip Breakdown & Take-Home Result */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Take-Home Pay Banner */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-zinc-800 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-sky-400 tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                <span>{t.netTakeHomeLabel.replace("{freq}", frequencyLabel)}</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">TRAIN Law 2026</span>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-emerald-400 tabular-nums">
                {formatPHP(result.netPayMonthly * multiplier)}
              </div>
              <div className="text-xs text-zinc-300 mt-1.5 flex flex-wrap items-center gap-2">
                <span>{t.cutoffDesc.replace("{amount}", formatPHP(result.netPaySemiMonthly))}</span>
                <span className="text-zinc-500">•</span>
                <span>{t.effectiveRateLabel.replace("{rate}", result.effectiveTaxRate.toFixed(1))}</span>
              </div>

              {/* Daily & Hourly Rate Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <div className="bg-zinc-800/90 text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-700/60 flex items-center gap-1.5 font-medium">
                  <span className="text-zinc-400">{t.dailyRateLabel}:</span>
                  <span className="font-bold text-white tabular-nums">{formatPHP(result.dailyRate)}</span>
                  <span className="text-[10px] text-zinc-400">/day</span>
                </div>
                <div className="bg-zinc-800/90 text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-700/60 flex items-center gap-1.5 font-medium">
                  <span className="text-zinc-400">{t.hourlyRateLabel}:</span>
                  <span className="font-bold text-white tabular-nums">{formatPHP(result.hourlyRate)}</span>
                  <span className="text-[10px] text-zinc-400">/hr</span>
                </div>
                <span className="text-[10.5px] text-zinc-400 hidden sm:inline">
                  • {t.doleFactorNote}
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-zinc-800 text-xs">
              <div className="bg-zinc-800/70 rounded-xl p-3 border border-zinc-700/50">
                <div className="text-zinc-400 text-[10.5px] uppercase font-bold">{t.grossSalaryCard}</div>
                <div className="text-white font-bold text-base mt-0.5 tabular-nums">
                  {formatPHP(result.monthlyBasic * multiplier)}
                </div>
              </div>

              <div className="bg-zinc-800/70 rounded-xl p-3 border border-zinc-700/50">
                <div className="text-rose-300 text-[10.5px] uppercase font-bold">{t.govtDeductionsCard}</div>
                <div className="text-rose-200 font-bold text-base mt-0.5 tabular-nums">
                  -{formatPHP(result.totalGovtContributionsMonthly * multiplier)}
                </div>
              </div>

              <div className="bg-zinc-800/70 rounded-xl p-3 border border-zinc-700/50 col-span-2 sm:col-span-1">
                <div className="text-amber-300 text-[10.5px] uppercase font-bold">{t.withholdingTaxCard}</div>
                <div className="text-amber-200 font-bold text-base mt-0.5 tabular-nums">
                  -{formatPHP(result.withholdingTaxMonthly * multiplier)}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Payslip Table */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {t.itemizedDeductionsTitle.replace("{freq}", frequencyLabel)}
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">2024–2026 Schedule</span>
            </div>

            {/* Deductions breakdown */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
              {/* Gross */}
              <div className="py-2.5 flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100">
                <span>{t.grossSalaryCard}</span>
                <span className="tabular-nums text-sm">{formatPHP(result.monthlyBasic * multiplier)}</span>
              </div>

              {/* SSS */}
              <div className="py-2.5 flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{t.sssLabel}</span>
                    <span className="text-[9.5px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">
                      RA 11199
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {t.sssNote
                      .replace("{msc}", formatPHP(result.sss.msc))
                      .replace("{employer}", formatPHP(result.sss.employer * multiplier))}
                  </div>
                </div>
                <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  -{formatPHP(result.sss.employee * multiplier)}
                </span>
              </div>

              {/* PhilHealth */}
              <div className="py-2.5 flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{t.philHealthLabel}</span>
                    <span className="text-[9.5px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">
                      RA 11223
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {t.philHealthNote.replace("{employer}", formatPHP(result.philHealth.employer * multiplier))}
                  </div>
                </div>
                <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  -{formatPHP(result.philHealth.employee * multiplier)}
                </span>
              </div>

              {/* Pag-IBIG */}
              <div className="py-2.5 flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{t.pagIbigLabel}</span>
                    <span className="text-[9.5px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">
                      RA 9679
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {t.pagIbigNote.replace("{employer}", formatPHP(result.pagIbig.employer * multiplier))}
                  </div>
                </div>
                <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  -{formatPHP(result.pagIbig.employee * multiplier)}
                </span>
              </div>

              {/* Taxable Base */}
              <div className="py-2.5 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60 px-3 rounded-lg text-zinc-600 dark:text-zinc-400">
                <span>{t.taxableCompLabel}</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {formatPHP(result.taxableCompensationMonthly * multiplier)}
                </span>
              </div>

              {/* BIR Withholding Tax */}
              <div className="py-2.5 flex items-center justify-between text-zinc-700 dark:text-zinc-300">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{t.withholdingTaxLabel}</span>
                    <span className="text-[9.5px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">
                      RA 10963
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500">{t.withholdingTaxNote}</div>
                </div>
                <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  -{formatPHP(result.withholdingTaxMonthly * multiplier)}
                </span>
              </div>

              {/* Final Take-Home */}
              <div className="pt-3 flex items-center justify-between font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {t.netTakeHomeTotal}
                </span>
                <span className="tabular-nums text-lg sm:text-xl text-emerald-600 dark:text-emerald-400">
                  {formatPHP(result.netPayMonthly * multiplier)}
                </span>
              </div>
            </div>
          </div>

          {/* 13th Month Pay & Year-End Bonus Simulator */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/50 dark:border-purple-800/60 flex items-center justify-center text-purple-700 dark:text-purple-400">
                  <Gift className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {t.thirteenthMonthTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 px-2 py-0.5 rounded-full">
                  PD 851 & RA 10963
                </span>
                <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 px-2 py-0.5 rounded-full">
                  {t.thirteenthMonthCap}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400">{t.thirteenthMonthTotal}</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{formatPHP(result.thirteenthMonth.total)}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400">
                <span>{t.thirteenthMonthExempt}</span>
                <span className="font-bold tabular-nums">+{formatPHP(result.thirteenthMonth.exempt)}</span>
              </div>

              {result.thirteenthMonth.taxable > 0 && (
                <div className="flex justify-between items-center text-rose-600 dark:text-rose-400">
                  <span>{t.thirteenthMonthTaxable}</span>
                  <span className="font-bold tabular-nums">
                    -{formatPHP(result.thirteenthMonth.taxDue)} ({formatPHP(result.thirteenthMonth.taxable)} excess)
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center font-bold text-zinc-900 dark:text-zinc-100">
                <span>{t.thirteenthMonthNet}</span>
                <span className="text-emerald-700 dark:text-emerald-400 text-sm font-extrabold tabular-nums">
                  {formatPHP(result.thirteenthMonth.netAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Employer Share & Cost to Company (CTC) */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <button
              type="button"
              onClick={() => setShowEmployerShare(!showEmployerShare)}
              className="w-full flex items-center justify-between cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200/50 dark:border-sky-800/60 flex items-center justify-center text-sky-700 dark:text-sky-400">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {t.employerShareTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60 px-2 py-0.5 rounded-full">
                  {t.employerShareBadge}
                </span>
                <span className="text-zinc-400 dark:text-zinc-500">
                  {showEmployerShare ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </div>
            </button>

            {showEmployerShare && (
              <>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {t.employerShareDesc}
                </p>

                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
                    <span>{t.employerSSS}</span>
                    <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatPHP((result.sss.employer + result.sss.ec) * multiplier)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
                    <span>{t.employerPhilHealth}</span>
                    <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatPHP(result.philHealth.employer * multiplier)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
                    <span>{t.employerPagIbig}</span>
                    <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatPHP(result.pagIbig.employer * multiplier)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center font-bold text-zinc-900 dark:text-zinc-100">
                    <span>{t.totalEmployerContrib}</span>
                    <span className="text-sky-700 dark:text-sky-400 text-sm tabular-nums">
                      +{formatPHP(result.employerTotalMonthly * multiplier)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 flex justify-between items-center font-extrabold text-zinc-900 dark:text-zinc-100">
                    <span className="text-xs sm:text-sm">{t.totalCostToCompanyLabel}</span>
                    <span className="text-zinc-900 dark:text-zinc-100 text-base sm:text-lg font-black tabular-nums">
                      {formatPHP(result.totalCostToCompanyMonthly * multiplier)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Full-Time Employee Statutory Basis & Republic Acts Accordion */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <button
          type="button"
          onClick={() => setShowStatutoryBasis(!showStatutoryBasis)}
          className="w-full flex items-center justify-between cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/50 dark:border-sky-800/60 flex items-center justify-center text-sky-700 dark:text-sky-400 shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {t.empStatutoryTitle}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {t.empStatutorySubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60 px-2.5 py-0.5 rounded-full">
              {t.empStatutoryBadge}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">
              {showStatutoryBasis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </div>
        </button>

        {showStatutoryBasis && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* TRAIN Law */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.trainLawCiteTitle}</span>
                  <span className="text-[9.5px] font-bold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">BIR</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.trainLawCiteDesc}</p>
              </div>

              {/* 13th Month Pay */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.pd851CiteTitle}</span>
                  <span className="text-[9.5px] font-bold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">DOLE</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.pd851CiteDesc}</p>
              </div>

              {/* SSS Law */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.sssLawCiteTitle}</span>
                  <span className="text-[9.5px] font-bold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">SSS</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.sssLawCiteDesc}</p>
              </div>

              {/* PhilHealth */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.philhealthCiteTitle}</span>
                  <span className="text-[9.5px] font-bold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">PhilHealth</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.philhealthCiteDesc}</p>
              </div>

              {/* Pag-IBIG */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.pagibigCiteTitle}</span>
                  <span className="text-[9.5px] font-bold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">HDMF</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.pagibigCiteDesc}</p>
              </div>

              {/* DOLE Daily/Hourly */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{t.doleCiteTitle}</span>
                  <span className="text-[9.5px] font-bold bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700">DOLE</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{t.doleCiteDesc}</p>
              </div>
            </div>

            {onOpenGlossary && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onOpenGlossary}
                  className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 flex items-center gap-1.5 underline underline-offset-2 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>{lang === "en" ? "Open Full Statutory Citations & Legal Text" : "Buksan ang Buong Talaan ng Batas at Citations"} →</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
