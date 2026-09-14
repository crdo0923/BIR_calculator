"use client";

import React from "react";
import { ComputeResult, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { ArrowRight, CreditCard, FileSpreadsheet, CheckCircle2 } from "lucide-react";

interface TaxWinnerHeroProps {
  result: ComputeResult;
  isOver3M: boolean;
  onOpenEBIR: () => void;
  onOpenPaymentGuide: () => void;
  lang: Language;
}

export function TaxWinnerHero({
  result,
  isOver3M,
  onOpenEBIR,
  onOpenPaymentGuide,
  lang,
}: TaxWinnerHeroProps) {
  const t = translations[lang];
  const winner = result.winner;
  const savings = result.savingsAnnual;
  const winnerIs8 = winner === "8%";

  // Winner option details
  const winnerOption = winnerIs8
    ? result.eight
    : winner === "graduated-itemized" && result.graduatedItemized
    ? result.graduatedItemized
    : result.graduatedOSD;

  const totalGross = result.grossAnnual + (result.salaryAnnual || 0);
  const estimatedTax = winnerOption.taxAnnual;
  const estimatedTakeHome = Math.max(0, totalGross - estimatedTax);

  const recommendedLabel = isOver3M
    ? (lang === "en" ? "Graduated Rates (VAT Required)" : "Graduated Rates (Kailangang mag-VAT)")
    : winnerIs8
    ? t.tier1Option8
    : winner === "graduated-itemized"
    ? t.tier1OptionGradItemized
    : t.tier1OptionGradOSD;

  return (
    <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-7 border border-zinc-800 shadow-sm space-y-6">
      {/* Tier 1: Estimated Tax Header */}
      <div>
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span>{t.tier1EstimatedTax}</span>
          <span className="text-[11px] text-zinc-500">
            {lang === "en" ? "Annual estimate" : "Taunang tantiya"}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white tabular-nums">
            {formatPHP(estimatedTax)}
          </span>
          <span className="text-xs sm:text-sm text-zinc-400 tabular-nums">
            {t.estQuarterly.replace("{amount}", formatPHP(winnerOption.taxQuarter))}
          </span>
        </div>

        {/* If Form 2307 exists */}
        {result.cwtAnnual > 0 && (
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
            <span>
              {lang === "en"
                ? `Actual cash to pay: ${formatPHP(winnerOption.netPayableAnnual)} (after ${formatPHP(result.cwtAnnual)} Form 2307 credits)`
                : `Aktwal na babayaran: ${formatPHP(winnerOption.netPayableAnnual)} (bawas ang ${formatPHP(result.cwtAnnual)} Form 2307 credits)`}
            </span>
          </div>
        )}
      </div>

      {/* Grid: Recommended Method & Estimated Take-Home */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
        {/* Recommended Method */}
        <div className="space-y-1.5">
          <div className="text-xs text-zinc-400 font-medium">{t.tier1RecommendedMethod}</div>
          <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>{recommendedLabel}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t.tier1LowerTaxBadge}</span>
          </div>
          {savings > 0 && !isOver3M && (
            <div className="text-[11.5px] text-zinc-300">
              {lang === "en"
                ? `Saves ${formatPHP(savings)}/year compared to the other method.`
                : `Makatipid ng ${formatPHP(savings)}/taon kumpara sa ibang paraan.`}
            </div>
          )}
        </div>

        {/* Estimated Take-Home */}
        <div className="space-y-1.5">
          <div className="text-xs text-zinc-400 font-medium">{t.tier1EstimatedTakeHome}</div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight tabular-nums">
            {formatPHP(estimatedTakeHome)}
          </div>
          <div className="text-[11.5px] text-zinc-400">
            {totalGross > 0
              ? `${Math.round((estimatedTakeHome / totalGross) * 100)}% ${lang === "en" ? "of your gross earnings" : "ng iyong gross na kita"}`
              : "—"}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenEBIR}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{t.tier1ViewGuideBtn}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-auto" />
        </button>

        <button
          type="button"
          onClick={onOpenPaymentGuide}
          className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-850 text-zinc-200 hover:text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>{t.tier1HowToPayBtn}</span>
        </button>
      </div>

      {/* Trust & Estimation Note */}
      <div className="pt-1 text-center sm:text-left text-[11px] text-zinc-400">
        {t.tier1Disclaimer}
      </div>
    </div>
  );
}
