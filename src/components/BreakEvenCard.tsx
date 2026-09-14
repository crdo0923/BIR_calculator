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
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200/50 flex items-center justify-center text-amber-700">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">{t.breakEvenTitle}</h3>
            <p className="text-[11px] text-zinc-400">{t.breakEvenSub}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-zinc-900 tabular-nums">{breakEvenPct}%</span>
          <span className="text-[11px] text-zinc-400 block">{formatPHP(breakEvenExpenses)}</span>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 space-y-1.5">
        <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-500" />
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
          <span className="font-medium text-zinc-600">{t.yourDocExpenses}</span>
          <span className="font-bold text-zinc-900 tabular-nums">
            {formatPHP(expenses)} {hasExpenses && `(${Math.round((expenses / grossAnnual) * 100)}%)`}
          </span>
        </div>

        <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              passedBreakEven ? "bg-purple-600" : "bg-zinc-800"
            }`}
            style={{ width: `${Math.max(4, progressPct)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">₱0 (0%)</span>
          <span className="text-zinc-500 font-medium">Break-even: {formatPHP(breakEvenExpenses)}</span>
        </div>
      </div>

      {/* Practical Recommendation based on expenses */}
      <div className="text-xs">
        {!hasExpenses ? (
          <div className="text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/50 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.noReceiptsRec}</span>
          </div>
        ) : passedBreakEven ? (
          <div className="text-purple-900 bg-purple-50 p-2.5 rounded-lg border border-purple-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{t.passedBreakEvenRec}</span>
          </div>
        ) : (
          <div className="text-zinc-700 bg-zinc-100/80 p-2.5 rounded-lg border border-zinc-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0" />
            <span>{t.stayOn8Rec.replace("{amount}", formatPHP(expenses))}</span>
          </div>
        )}
      </div>
    </div>
  );
}
