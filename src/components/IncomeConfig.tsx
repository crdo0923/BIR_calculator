"use client";

import React, { useState } from "react";
import { CWTMode, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import {
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Receipt,
  X,
} from "lucide-react";

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

  // Progressive disclosure for Advanced Options
  const hasActiveAdvanced = cwtMode !== "none" || (showExpenses && Number(expenseDigits) > 0);
  const [showAdvanced, setShowAdvanced] = useState(hasActiveAdvanced);

  const handleNumericInput = (val: string, setter: (v: string) => void) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 10);
    setter(cleaned);
  };

  const displayGross = grossDigits ? Number(grossDigits).toLocaleString("en-PH") : "";
  const displaySalary = salaryDigits ? Number(salaryDigits).toLocaleString("en-PH") : "";
  const displayExpenses = expenseDigits ? Number(expenseDigits).toLocaleString("en-PH") : "";
  const displayCwtCustom = cwtCustomDigits ? Number(cwtCustomDigits).toLocaleString("en-PH") : "";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 transition-colors duration-200">
      {/* Gross Income Input */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="gross-income-input" className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <span>{t.grossIncomeLabel}</span>
          </label>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            {period === "annual" ? t.perYear : t.perQuarter}
          </span>
        </div>

        <div className="mt-2 relative flex items-center border border-zinc-300 dark:border-zinc-700 focus-within:border-emerald-700 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-700/15 dark:focus-within:ring-emerald-500/20 rounded-xl px-3.5 py-2.5 bg-white dark:bg-zinc-950 transition shadow-2xs">
          <span className="font-serif text-lg font-bold text-zinc-400 select-none mr-2">₱</span>
          <input
            id="gross-income-input"
            type="text"
            inputMode="numeric"
            value={displayGross}
            onChange={(e) => handleNumericInput(e.target.value, setGrossDigits)}
            placeholder="1,000,000"
            className="w-full text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 outline-none bg-transparent tabular-nums placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
          />
          {grossDigits && (
            <button
              type="button"
              onClick={() => setGrossDigits("")}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-md transition cursor-pointer shrink-0"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live helper & Presets */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>
            {grossDigits
              ? period === "annual"
                ? t.estPerQuarter.replace("{amount}", formatPHP(grossAnnual / 4))
                : t.totalAnnualGross.replace("{amount}", formatPHP(grossAnnual))
              : t.enterIncomePlaceholder}
          </span>
          {grossAnnual <= 250000 && grossAnnual > 0 && (
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t.taxExemptBadge}</span>
          )}
        </div>

        {/* Quiet Monthly Presets */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {PRESETS.map((p) => {
            const targetVal = period === "annual" ? p.annual : p.annual / 4;
            const isSelected = Number(grossDigits) === targetVal;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setGrossDigits(String(targetVal))}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition border cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-2xs font-semibold"
                    : "bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Subtle Auto-update note */}
        <div className="mt-2 text-[10.5px] text-zinc-400 dark:text-zinc-500 font-medium">
          {t.autoUpdateNote}
        </div>
      </div>

      {/* Period Selector (Annual vs Quarterly) */}
      <div>
        <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">{t.calcPeriodLabel}</label>
        <div className="grid grid-cols-2 p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl gap-1 border border-zinc-200/70 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setPeriod("annual")}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition cursor-pointer ${
              period === "annual"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {t.periodAnnual}
          </button>
          <button
            type="button"
            onClick={() => setPeriod("quarterly")}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition cursor-pointer ${
              period === "quarterly"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {t.periodQuarterly}
          </button>
        </div>
      </div>

      {/* Taxpayer Category (Pure Freelancer vs Mixed Income) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t.taxpayerStatusLabel}</label>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {isMixed ? t.statusMixedDesc : t.statusPureDesc}
          </span>
        </div>
        <div className="grid grid-cols-2 p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl gap-1 border border-zinc-200/70 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setIsMixed(false)}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              !isMixed
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {t.pureFreelancer}
          </button>
          <button
            type="button"
            onClick={() => setIsMixed(true)}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isMixed
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {t.mixedIncomeEarner}
          </button>
        </div>
      </div>

      {/* Mixed Earner Salary Field (if active) */}
      {isMixed && (
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <label htmlFor="salary-input" className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {t.salaryLabel}
              </label>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                {t.salaryDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-emerald-700/15 dark:focus-within:ring-emerald-500/20">
            <span className="text-zinc-400 dark:text-zinc-500 font-serif text-sm mr-2">₱</span>
            <input
              id="salary-input"
              type="text"
              inputMode="numeric"
              value={displaySalary}
              onChange={(e) => handleNumericInput(e.target.value, setSalaryDigits)}
              placeholder="300,000"
              className="w-full text-sm font-bold text-zinc-900 dark:text-zinc-100 outline-none bg-transparent tabular-nums placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
            />
          </div>
          <div className="text-[10.5px] text-zinc-600 dark:text-zinc-400 font-medium">
            {t.salaryMixedRule}
          </div>
        </div>
      )}

      {/* Warning if over 3M VAT limit */}
      {isOver3M && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 rounded-xl flex items-start gap-2.5 text-amber-900 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">{t.vatAlertTitle}</span> {t.vatAlertDesc}
          </div>
        </div>
      )}

      {/* Progressive Disclosure: Advanced Options Toggle */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100/80 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200/80 dark:border-zinc-700 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>{showAdvanced ? "−" : "+"}</span>
            <span>{t.advancedOptionsToggle}</span>
            {hasActiveAdvanced && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" title="Active settings" />
            )}
          </div>
          <span className="text-[10.5px] text-zinc-400 dark:text-zinc-500 font-normal hidden sm:inline">
            {t.advancedOptionsHelp}
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-4 pt-1">
            {/* BIR Form 2307 Withholding Tax Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {t.cwtSectionTitle}
                  </label>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50">
                  {t.deductibleBadge}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                {t.cwtHelpText}
              </p>

              {/* 2307 Mode Selector */}
              <div className="grid grid-cols-4 gap-1.5">
                {(["none", "5%", "10%", "custom"] as CWTMode[]).map((mode) => {
                  const isSelected = cwtMode === mode;
                  const label =
                    mode === "none"
                      ? t.cwtNone
                      : mode === "5%"
                      ? t.cwt5
                      : mode === "10%"
                      ? t.cwt10
                      : t.cwtCustom;

                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setCwtMode(mode)}
                      className={`text-xs py-1.5 px-1 rounded-lg font-semibold transition border text-center cursor-pointer ${
                        isSelected
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-2xs font-bold"
                          : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {cwtMode === "custom" && (
                <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-950 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-zinc-100/10">
                  <span className="text-zinc-400 dark:text-zinc-500 font-serif text-sm mr-2">₱</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displayCwtCustom}
                    onChange={(e) => handleNumericInput(e.target.value, setCwtCustomDigits)}
                    placeholder={t.cwtCustomPlaceholder}
                    className="w-full text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none bg-transparent tabular-nums placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                  />
                </div>
              )}
            </div>

            {/* Expenses (Itemized Deductions) */}
            <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
              {!showExpenses ? (
                <button
                  type="button"
                  onClick={() => setShowExpenses(true)}
                  className="w-full py-2 px-3 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>{t.addExpensesBtn}</span>
                </button>
              ) : (
                <div className="space-y-2 p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <label htmlFor="expenses-input" className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      <span>{t.expensesTitle}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowExpenses(false);
                        setExpenseDigits("");
                      }}
                      className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 underline cursor-pointer"
                    >
                      {t.removeBtn}
                    </button>
                  </div>
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-zinc-100/10">
                    <span className="text-zinc-400 dark:text-zinc-500 font-serif text-sm mr-2">₱</span>
                    <input
                      id="expenses-input"
                      type="text"
                      inputMode="numeric"
                      value={displayExpenses}
                      onChange={(e) => handleNumericInput(e.target.value, setExpenseDigits)}
                      placeholder="0"
                      className="w-full text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none bg-transparent tabular-nums placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                    />
                  </div>
                  <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-normal">
                    {t.expensesHelpText}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
