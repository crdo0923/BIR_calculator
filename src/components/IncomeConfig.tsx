"use client";

import React from "react";
import { CWTMode, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { AlertTriangle, Briefcase, Calculator, FileCheck, Receipt, X } from "lucide-react";

interface IncomeConfigProps {
  grossDigits: string;
  setGrossDigits: (v: string) => void;
  period: "annual" | "quarterly";
  setPeriod: (v: "annual" | "quarterly") => void;
  isMixed: boolean;
  setIsMixed: (v: boolean) => void;
  salaryDigits: string;
  setSalaryDigits: (v: string) => void;
  showExpenses: boolean;
  setShowExpenses: (v: boolean) => void;
  expenseDigits: string;
  setExpenseDigits: (v: string) => void;
  cwtMode: CWTMode;
  setCwtMode: (v: CWTMode) => void;
  cwtCustomDigits: string;
  setCwtCustomDigits: (v: string) => void;
  grossAnnual: number;
  lang: Language;
}

const PRESETS = [
  { label: "₱30k/mo", annual: 360000 },
  { label: "₱60k/mo", annual: 720000 },
  { label: "₱100k/mo", annual: 1200000 },
  { label: "₱150k/mo", annual: 1800000 },
  { label: "₱250k/mo", annual: 3000000 },
];

export function IncomeConfig({
  grossDigits,
  setGrossDigits,
  period,
  setPeriod,
  isMixed,
  setIsMixed,
  salaryDigits,
  setSalaryDigits,
  showExpenses,
  setShowExpenses,
  expenseDigits,
  setExpenseDigits,
  cwtMode,
  setCwtMode,
  cwtCustomDigits,
  setCwtCustomDigits,
  grossAnnual,
  lang,
}: IncomeConfigProps) {
  const t = translations[lang];
  const isOver3M = grossAnnual > 3000000;

  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 10);
    setter(cleaned);
  };

  const displayGross = grossDigits ? Number(grossDigits).toLocaleString("en-PH") : "";
  const displaySalary = salaryDigits ? Number(salaryDigits).toLocaleString("en-PH") : "";
  const displayExpenses = expenseDigits ? Number(expenseDigits).toLocaleString("en-PH") : "";
  const displayCwtCustom = cwtCustomDigits ? Number(cwtCustomDigits).toLocaleString("en-PH") : "";

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200/50 flex items-center justify-center text-emerald-700">
            <Calculator className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700">{t.incomeSectionTitle}</h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
          {t.currencyTag}
        </span>
      </div>

      {/* Freelance/Business Gross Input */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="gross-income-input" className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            {t.grossIncomeLabel}
            <span className="text-emerald-600 font-medium text-[11px]">{t.grossIncomeSubtitle}</span>
          </label>
          <span className="text-[11px] text-zinc-400 font-medium">
            {period === "annual" ? t.perYear : t.perQuarter}
          </span>
        </div>

        <div className="mt-2 relative flex items-center border-2 border-zinc-200 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/15 rounded-2xl px-3.5 py-3 bg-white transition shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center mr-3 border border-emerald-200/60 shrink-0 select-none">
            <span className="font-serif text-base leading-none font-black">₱</span>
          </div>
          <input
            id="gross-income-input"
            type="text"
            inputMode="numeric"
            value={displayGross}
            onChange={(e) => handleNumericInput(e.target.value, setGrossDigits)}
            placeholder="1,000,000"
            className="w-full text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 outline-none bg-transparent tabular-nums placeholder:text-zinc-300"
          />
          {grossDigits && (
            <button
              type="button"
              onClick={() => setGrossDigits("")}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg transition cursor-pointer shrink-0"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live helper */}
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500">
          <span>
            {grossDigits
              ? period === "annual"
                ? t.estPerQuarter.replace("{amount}", formatPHP(grossAnnual / 4))
                : t.totalAnnualGross.replace("{amount}", formatPHP(grossAnnual))
              : t.enterIncomePlaceholder}
          </span>
          {grossAnnual <= 250000 && grossAnnual > 0 && (
            <span className="text-emerald-600 font-semibold">{t.taxExemptBadge}</span>
          )}
        </div>

        {/* Quick Presets */}
        <div className="mt-3">
          <div className="text-[11px] font-medium text-zinc-400 mb-1.5">{t.quickPresetsLabel}</div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => {
              const targetVal = period === "annual" ? p.annual : p.annual / 4;
              const isSelected = Number(grossDigits) === targetVal;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setGrossDigits(String(targetVal))}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition border cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200/90 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Period Selector (Annual vs Quarterly) */}
      <div>
        <label className="block text-xs font-bold text-zinc-800 mb-1.5">{t.calcPeriodLabel}</label>
        <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-xl gap-1 border border-zinc-200/60">
          <button
            type="button"
            onClick={() => setPeriod("annual")}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition cursor-pointer ${
              period === "annual" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {t.periodAnnual}
          </button>
          <button
            type="button"
            onClick={() => setPeriod("quarterly")}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition cursor-pointer ${
              period === "quarterly" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {t.periodQuarterly}
          </button>
        </div>
      </div>

      {/* Taxpayer Category (Pure vs Mixed) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-zinc-800">{t.taxpayerStatusLabel}</label>
          <span className="text-[11px] text-zinc-400">
            {isMixed ? t.statusMixedDesc : t.statusPureDesc}
          </span>
        </div>
        <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-xl gap-1 border border-zinc-200/60">
          <button
            type="button"
            onClick={() => setIsMixed(false)}
            className={`py-2.5 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              !isMixed ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/50" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {t.pureFreelancer}
          </button>
          <button
            type="button"
            onClick={() => setIsMixed(true)}
            className={`py-2.5 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isMixed ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/50" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {t.mixedIncomeEarner}
          </button>
        </div>
      </div>

      {/* Mixed Earner Salary Field */}
      {isMixed && (
        <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-2">
          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <label htmlFor="salary-input" className="text-xs font-bold text-zinc-900">
                {t.salaryLabel}
              </label>
              <p className="text-[11px] text-zinc-500 leading-normal">
                {t.salaryDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center border border-zinc-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-emerald-500/20">
            <span className="text-zinc-400 font-serif text-base mr-2">₱</span>
            <input
              id="salary-input"
              type="text"
              inputMode="numeric"
              value={displaySalary}
              onChange={(e) => handleNumericInput(e.target.value, setSalaryDigits)}
              placeholder="300,000"
              className="w-full text-base font-bold text-zinc-900 outline-none bg-transparent tabular-nums placeholder:text-zinc-300"
            />
          </div>
          <div className="text-[10px] text-emerald-800 font-medium">
            {t.salaryMixedRule}
          </div>
        </div>
      )}

      {/* BIR Form 2307 Withholding Tax Section */}
      <div className="border-t border-zinc-100 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <label className="text-xs font-bold text-zinc-800">
              {t.cwtSectionTitle} <span className="text-emerald-600 font-medium">{t.cwtSubtitle}</span>
            </label>
          </div>
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/50">
            {t.deductibleBadge}
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-normal">
          {t.cwtDesc}
        </p>

        {/* 2307 Mode Selector */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => setCwtMode("none")}
            className={`text-xs py-2 px-1 rounded-lg font-bold transition border text-center cursor-pointer ${
              cwtMode === "none"
                ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
            }`}
          >
            {t.cwtNone}
          </button>
          <button
            type="button"
            onClick={() => setCwtMode("5%")}
            className={`text-xs py-2 px-1 rounded-lg font-bold transition border text-center cursor-pointer ${
              cwtMode === "5%"
                ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
            }`}
          >
            {t.cwt5}
          </button>
          <button
            type="button"
            onClick={() => setCwtMode("10%")}
            className={`text-xs py-2 px-1 rounded-lg font-bold transition border text-center cursor-pointer ${
              cwtMode === "10%"
                ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
            }`}
          >
            {t.cwt10}
          </button>
          <button
            type="button"
            onClick={() => setCwtMode("custom")}
            className={`text-xs py-2 px-1 rounded-lg font-bold transition border text-center cursor-pointer ${
              cwtMode === "custom"
                ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
            }`}
          >
            {t.cwtCustom}
          </button>
        </div>

        {cwtMode === "custom" && (
          <div className="flex items-center border border-zinc-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-zinc-900/10">
            <span className="text-zinc-400 font-serif text-sm mr-2">₱</span>
            <input
              type="text"
              inputMode="numeric"
              value={displayCwtCustom}
              onChange={(e) => handleNumericInput(e.target.value, setCwtCustomDigits)}
              placeholder={t.cwtCustomPlaceholder}
              className="w-full text-sm font-bold text-zinc-900 outline-none bg-transparent tabular-nums placeholder:text-zinc-300"
            />
          </div>
        )}
      </div>

      {/* Expenses (Itemized Deductions) */}
      <div className="border-t border-zinc-100 pt-4">
        {!showExpenses ? (
          <button
            type="button"
            onClick={() => setShowExpenses(true)}
            className="w-full py-2.5 px-3 border border-dashed border-zinc-300 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-zinc-500" />
            {t.addExpensesBtn}
          </button>
        ) : (
          <div className="space-y-2 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
            <div className="flex items-center justify-between">
              <label htmlFor="expenses-input" className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-zinc-500" />
                {t.expensesTitle}
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowExpenses(false);
                  setExpenseDigits("");
                }}
                className="text-[11px] font-medium text-rose-600 hover:text-rose-700 underline cursor-pointer"
              >
                {t.removeBtn}
              </button>
            </div>
            <div className="flex items-center border border-zinc-300 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-zinc-900/10">
              <span className="text-zinc-400 font-serif text-sm mr-2">₱</span>
              <input
                id="expenses-input"
                type="text"
                inputMode="numeric"
                value={displayExpenses}
                onChange={(e) => handleNumericInput(e.target.value, setExpenseDigits)}
                placeholder="0"
                className="w-full text-sm font-bold text-zinc-900 outline-none bg-transparent tabular-nums placeholder:text-zinc-300"
              />
            </div>
            <p className="text-[10.5px] text-zinc-500 leading-normal">
              {t.expensesDesc}
            </p>
          </div>
        )}
      </div>

      {/* Warning if over 3M VAT limit */}
      {isOver3M && (
        <div className="p-3.5 bg-amber-50 border border-amber-300/80 rounded-xl flex items-start gap-2.5 text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">{t.vatAlertTitle}</span> {t.vatAlertDesc}
          </div>
        </div>
      )}
    </div>
  );
}
