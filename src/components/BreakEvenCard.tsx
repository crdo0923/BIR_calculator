"use client";

import React from "react";
import { ComputeResult, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { Scale, Info, CheckCircle2, AlertCircle } from "lucide-react";

interface BreakEvenCardProps {
  result: ComputeResult;
  expenses: number;
  grossAnnual: number;
  lang: Language;
}

export function BreakEvenCard({ result, expenses, grossAnnual, lang }: BreakEvenCardProps) {
  if (!result.eight.eligible || grossAnnual <= 0) return null;

  const t = translations[lang];
  const breakEvenExpenses = result.breakEvenExpenses ?? 0;
  const breakEvenRatio = result.breakEvenRatio ?? 0;
  const breakEvenPct = Math.round(breakEvenRatio * 100);

  const hasExpenses = expenses > 0;
  const passedBreakEven = hasExpenses && expenses >= breakEvenExpenses;

  // Percentage of progress toward break-even
  const progressPct = breakEvenExpenses > 0 ? Math.min(100, Math.round((expenses / breakEvenExpenses) * 100)) : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/50 dark:border-amber-800/50 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">{t.breakEvenHeaderTitle}</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.breakEvenHeaderSub}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{breakEvenPct}%</span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block">{formatPHP(breakEvenExpenses)}</span>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5">
        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>{t.breakEvenRuleTitle}</span>
        </div>
        <p className="leading-relaxed">
          {t.breakEvenRuleDesc
            .replace("{amount}", formatPHP(breakEvenExpenses))
            .replace("{percent}", String(breakEvenPct))}
        </p>
      </div>

      {/* Progress towards Break-even */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-600 dark:text-zinc-400">{t.yourDocExpenses}</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {formatPHP(expenses)} {hasExpenses && `(${Math.round((expenses / grossAnnual) * 100)}%)`}
          </span>
        </div>

        <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200/60 dark:border-zinc-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              passedBreakEven ? "bg-purple-600 dark:bg-purple-500" : "bg-zinc-800 dark:bg-zinc-200"
            }`}
            style={{ width: `${Math.max(4, progressPct)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 dark:text-zinc-500">₱0 (0%)</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Break-even: {formatPHP(breakEvenExpenses)}</span>
        </div>
      </div>

      {/* Practical Recommendation based on expenses */}
      <div className="text-xs">
        {!hasExpenses ? (
          <div className="text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/60 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t.noReceiptsRec}</span>
          </div>
        ) : passedBreakEven ? (
          <div className="text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 p-2.5 rounded-lg border border-purple-200 dark:border-purple-800/60 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{t.passedBreakEvenRec}</span>
          </div>
        ) : (
          <div className="text-zinc-700 dark:text-zinc-300 bg-zinc-100/80 dark:bg-zinc-800/80 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span>{t.stayOn8Rec.replace("{amount}", formatPHP(expenses))}</span>
          </div>
        )}
      </div>
    </div>
  );
}
