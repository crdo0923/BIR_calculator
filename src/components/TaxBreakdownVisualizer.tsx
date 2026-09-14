"use client";

import React from "react";
import { ComputeResult, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { BarChart3 } from "lucide-react";

interface TaxBreakdownVisualizerProps {
  result: ComputeResult;
  grossAnnual: number;
  lang: Language;
}

export function TaxBreakdownVisualizer({ result, grossAnnual, lang }: TaxBreakdownVisualizerProps) {
  if (grossAnnual <= 0) return null;

  const t = translations[lang];
  const eightTax = result.eight.eligible ? result.eight.taxAnnual : 0;
  const gradTax = result.graduatedOSD.taxAnnual;

  const eightTakeHome = Math.max(0, grossAnnual - eightTax);
  const gradTakeHome = Math.max(0, grossAnnual - gradTax);

  const eightTakeHomePct = Math.round((eightTakeHome / grossAnnual) * 100);
  const eightTaxPct = Math.round((eightTax / grossAnnual) * 100);

  const gradTakeHomePct = Math.round((gradTakeHome / grossAnnual) * 100);
  const gradTaxPct = Math.round((gradTax / grossAnnual) * 100);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{t.visualizerTitle}</h3>
        </div>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">{t.effectiveTaxRate}</span>
      </div>

      {/* Visual Bars Comparison */}
      <div className="space-y-4">
        {/* 8% Flat Regime Bar */}
        {result.eight.eligible ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                8% Flat Rate
                {result.winner === "8%" && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    • {t.higherTakeHomeBadge}
                  </span>
                )}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {t.takeHomeLabel.replace("{amount}", formatPHP(eightTakeHome)).replace("{percent}", String(eightTakeHomePct))}
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-3.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                style={{ width: `${eightTakeHomePct}%` }}
                title={`Take-home: ${formatPHP(eightTakeHome)}`}
              />
              <div
                className="h-full bg-zinc-900 dark:bg-zinc-700 rounded-r-full transition-all duration-500"
                style={{ width: `${eightTaxPct}%` }}
                title={`Tax Due: ${formatPHP(eightTax)}`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> {t.keepPercent.replace("{percent}", String(eightTakeHomePct))}
              </span>
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-700" />{" "}
                {t.taxDuePercent.replace("{amount}", formatPHP(eightTax)).replace("{percent}", String(eightTaxPct))}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/80">
            {t.vatAlertDesc}
          </div>
        )}

        {/* Graduated Regime Bar */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              Graduated + OSD
              {result.winner === "graduated-OSD" && (
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  • {t.higherTakeHomeBadge}
                </span>
              )}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {t.takeHomeLabel.replace("{amount}", formatPHP(gradTakeHome)).replace("{percent}", String(gradTakeHomePct))}
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-3.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-sky-500 rounded-l-full transition-all duration-500"
              style={{ width: `${gradTakeHomePct}%` }}
              title={`Take-home: ${formatPHP(gradTakeHome)}`}
            />
            <div
              className="h-full bg-zinc-500 dark:bg-zinc-600 rounded-r-full transition-all duration-500"
              style={{ width: `${gradTaxPct}%` }}
              title={`Tax Due: ${formatPHP(gradTax)}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1 text-sky-700 dark:text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> {t.keepPercent.replace("{percent}", String(gradTakeHomePct))}
            </span>
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-zinc-500 dark:bg-zinc-600" />{" "}
              {t.taxDuePercent.replace("{amount}", formatPHP(gradTax)).replace("{percent}", String(gradTaxPct))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
