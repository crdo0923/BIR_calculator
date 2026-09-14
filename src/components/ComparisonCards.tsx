"use client";

import React from "react";
import { ComputeResult, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { Check } from "lucide-react";

interface ComparisonCardsProps {
  result: ComputeResult;
  isMixed: boolean;
  hasExpenses: boolean;
  lang: Language;
}

export function ComparisonCards({ result, isMixed, hasExpenses, lang }: ComparisonCardsProps) {
  const t = translations[lang];
  const winner = result.winner;
  const isWinner8 = winner === "8%";
  const isWinnerOSD = winner === "graduated-OSD";
  const isWinnerItemized = winner === "graduated-itemized";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">{t.compTitle}</h3>
        <span className="text-[11px] text-zinc-400">{t.valuesAnnual}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* 1. 8% Flat Rate Card */}
        <div
          className={`rounded-3xl p-5 sm:p-6 transition border relative flex flex-col justify-between ${
            isWinner8
              ? "bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
              : "bg-zinc-50/60 border-zinc-200 text-zinc-600"
          }`}
        >
          {isWinner8 && (
            <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> {t.bestValueBadge}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t.regimeA}</span>
                <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 flex items-center gap-1.5 mt-0.5">
                  {t.title8}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                {result.eight.recommendedForms.atcCode}
              </span>
            </div>

            {/* Total Tax Liability */}
            <div className="mt-3 pt-3 border-t border-zinc-200/60">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase">{t.totalTaxLiability}</div>
              <div className="text-2xl font-black text-zinc-900 tracking-tight mt-0.5 tabular-nums">
                {result.eight.eligible ? formatPHP(result.eight.taxAnnual) : t.notEligible}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {result.eight.eligible
                  ? t.estQuarterly.replace("{amount}", formatPHP(result.eight.taxQuarter))
                  : result.eight.reason || "Exceeds ₱3M VAT limit"}
              </div>
            </div>

            {/* Net Out of Pocket Payable (if CWT exists) */}
            {result.cwtAnnual > 0 && result.eight.eligible && (
              <div className="mt-2.5 p-2.5 bg-emerald-50/60 border border-emerald-200/50 rounded-xl text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>{t.actualCashToBir}</span>
                  <span className="tabular-nums">{formatPHP(result.eight.netPayableAnnual)}</span>
                </div>
                <div className="text-[10.5px] text-emerald-700">
                  {t.lessCwtCredits.replace("{amount}", formatPHP(result.cwtAnnual))}
                </div>
              </div>
            )}

            {/* Calculation Formula Notes */}
            <div className="mt-3 space-y-1.5 text-xs text-zinc-600 bg-zinc-100/70 p-3 rounded-2xl">
              <div className="font-semibold text-zinc-700">{t.howCalculated}</div>
              {!isMixed ? (
                <div>{t.formula8Pure}</div>
              ) : (
                <div>
                  {t.formula8Mixed
                    .replace("{salaryTax}", formatPHP(result.eight.salaryTaxAnnual))
                    .replace("{freelanceTax}", formatPHP(result.eight.freelanceTaxAnnual))}
                </div>
              )}
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" /> {t.noPercentageTax}
              </div>
            </div>
          </div>

          {/* Form Required */}
          <div className="mt-4 pt-3 border-t border-zinc-200/60 text-[11px] text-zinc-500">
            <span className="font-bold text-zinc-700">{t.annualReturnLabel} </span>
            {result.eight.recommendedForms.annual}
          </div>
        </div>

        {/* 2. Graduated + 40% OSD Card */}
        <div
          className={`rounded-3xl p-5 sm:p-6 transition border relative flex flex-col justify-between ${
            isWinnerOSD
              ? "bg-white border-sky-500 ring-2 ring-sky-500/20 shadow-sm"
              : "bg-zinc-50/60 border-zinc-200 text-zinc-600"
          }`}
        >
          {isWinnerOSD && (
            <div className="absolute -top-3 right-4 bg-sky-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> {t.bestValueBadge}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{t.regimeB}</span>
                <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 flex items-center gap-1.5 mt-0.5">
                  {t.titleGradOSD}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                {result.graduatedOSD.recommendedForms.atcCode}
              </span>
            </div>

            {/* Total Tax Liability */}
            <div className="mt-3 pt-3 border-t border-zinc-200/60">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase">{t.totalTaxLiability}</div>
              <div className="text-2xl font-black text-zinc-900 tracking-tight mt-0.5 tabular-nums">
                {formatPHP(result.graduatedOSD.taxAnnual)}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {t.estQuarterly.replace("{amount}", formatPHP(result.graduatedOSD.taxQuarter))}
              </div>
            </div>

            {/* Net Out of Pocket Payable (if CWT exists) */}
            {result.cwtAnnual > 0 && (
              <div className="mt-2.5 p-2 bg-sky-50/60 border border-sky-200/50 rounded-lg text-xs">
                <div className="flex items-center justify-between font-bold text-sky-900">
                  <span>{t.actualCashToBir}</span>
                  <span className="tabular-nums">{formatPHP(result.graduatedOSD.netPayableAnnual)}</span>
                </div>
                <div className="text-[10.5px] text-sky-700">
                  {t.lessCwtCredits.replace("{amount}", formatPHP(result.cwtAnnual))}
                </div>
              </div>
            )}

            {/* Breakdown */}
            <div className="mt-3 space-y-1.5 text-xs text-zinc-600 bg-zinc-100/70 p-2.5 rounded-xl">
              <div className="font-semibold text-zinc-700">{t.taxBreakdownLabel}</div>
              <div className="flex justify-between">
                <span>{t.incomeTaxGrad}</span>
                <span className="font-bold tabular-nums">{formatPHP(result.graduatedOSD.incomeTaxAnnual)}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>{t.percentageTaxSec116}</span>
                <span className="font-bold tabular-nums">+{formatPHP(result.graduatedOSD.percentageAnnual)}</span>
              </div>
              <div className="text-[10.5px] text-zinc-400 mt-0.5">
                {t.taxableBaseLabel.replace("{amount}", formatPHP(result.graduatedOSD.taxableAnnual))}
              </div>
            </div>
          </div>

          {/* Form Required */}
          <div className="mt-4 pt-3 border-t border-zinc-200/60 text-[11px] text-zinc-500">
            {t.requiresTwoForms}
          </div>
        </div>
      </div>

      {/* 3. Graduated + Itemized Card (if user entered expenses) */}
      {hasExpenses && result.graduatedItemized && (
        <div
          className={`rounded-2xl p-4 sm:p-5 transition border relative mt-3 ${
            isWinnerItemized
              ? "bg-white border-purple-500 ring-2 ring-purple-500/20 shadow-sm"
              : "bg-zinc-50/60 border-zinc-200 text-zinc-600"
          }`}
        >
          {isWinnerItemized && (
            <div className="absolute -top-3 right-4 bg-purple-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> {t.bestValueBadge}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">{t.regimeC}</span>
              <h4 className="text-base font-extrabold text-zinc-900">{t.titleGradItemized}</h4>
              <p className="text-xs text-zinc-500">{t.itemizedSubtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-400 font-semibold uppercase">{t.totalTaxLiability}</div>
              <div className="text-2xl font-black text-zinc-900 tracking-tight tabular-nums">
                {formatPHP(result.graduatedItemized.taxAnnual)}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600">
            <div>
              {t.incomeTaxGrad} <span className="font-bold tabular-nums">{formatPHP(result.graduatedItemized.incomeTaxAnnual)}</span>
            </div>
            <div>
              {t.percentageTaxSec116} <span className="font-bold tabular-nums">+{formatPHP(result.graduatedItemized.percentageAnnual)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
