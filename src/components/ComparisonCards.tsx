"use client";

import React, { useState } from "react";
import { ComputeResult, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { Check, ChevronDown, ChevronUp, Info } from "lucide-react";

interface ComparisonCardsProps {
  result: ComputeResult;
  isMixed: boolean;
  hasExpenses: boolean;
  lang: Language;
}

export function ComparisonCards({ result, isMixed, hasExpenses, lang }: ComparisonCardsProps) {
  const t = translations[lang];
  const [showFormulas, setShowFormulas] = useState(false);

  const totalGross = result.grossAnnual + (result.salaryAnnual || 0);
  const isWinner8 = result.winner === "8%";
  const isWinnerOSD = result.winner === "graduated-OSD";
  const isWinnerItemized = result.winner === "graduated-itemized";

  const takeHome8 = Math.max(0, totalGross - result.eight.taxAnnual);
  const takeHomeOSD = Math.max(0, totalGross - result.graduatedOSD.taxAnnual);
  const takeHomeItemized = result.graduatedItemized
    ? Math.max(0, totalGross - result.graduatedItemized.taxAnnual)
    : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors duration-200">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">{t.compTableTitle}</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.compTableSub}</p>
        </div>
        <span className="text-[10.5px] font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded self-start sm:self-auto">
          {t.valuesAnnual}
        </span>
      </div>

      {/* Scannable Comparison Table */}
      <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
        <table className="w-full text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-left">
              <th className="py-2.5 px-3 font-semibold w-1/4">{t.tableColMetric}</th>
              {/* 8% Flat Rate Column */}
              <th
                className={`py-2.5 px-3 font-bold rounded-t-xl text-center ${
                  isWinner8
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-x border-t border-emerald-300 dark:border-emerald-800"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{t.tableCol8}</span>
                  {isWinner8 && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-600 dark:bg-emerald-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                      <Check className="w-2.5 h-2.5" />
                      {t.tableRecommendedBadge}
                    </span>
                  )}
                </div>
              </th>

              {/* Graduated 40% OSD Column */}
              <th
                className={`py-2.5 px-3 font-bold rounded-t-xl text-center ${
                  isWinnerOSD
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-x border-t border-emerald-300 dark:border-emerald-800"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{t.tableColGradOSD}</span>
                  {isWinnerOSD && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-600 dark:bg-emerald-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                      <Check className="w-2.5 h-2.5" />
                      {t.tableRecommendedBadge}
                    </span>
                  )}
                </div>
              </th>

              {/* Graduated Itemized Column (if applicable) */}
              {hasExpenses && result.graduatedItemized && (
                <th
                  className={`py-2.5 px-3 font-bold rounded-t-xl text-center ${
                    isWinnerItemized
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-x border-t border-emerald-300 dark:border-emerald-800"
                      : "text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{t.tableColGradItemized}</span>
                    {isWinnerItemized && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-600 dark:bg-emerald-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                        <Check className="w-2.5 h-2.5" />
                        {t.tableRecommendedBadge}
                      </span>
                    )}
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {/* Row 1: Income Tax */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
              <td className="py-2.5 px-3 font-medium text-zinc-600 dark:text-zinc-400">{t.tableRowIncomeTax}</td>
              <td
                className={`py-2.5 px-3 text-center tabular-nums font-semibold ${
                  isWinner8
                    ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {result.eight.eligible ? formatPHP(result.eight.taxAnnual) : t.notEligible}
              </td>
              <td
                className={`py-2.5 px-3 text-center tabular-nums font-semibold ${
                  isWinnerOSD
                    ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {formatPHP(result.graduatedOSD.incomeTaxAnnual)}
              </td>
              {hasExpenses && result.graduatedItemized && (
                <td
                  className={`py-2.5 px-3 text-center tabular-nums font-semibold ${
                    isWinnerItemized
                      ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {formatPHP(result.graduatedItemized.incomeTaxAnnual)}
                </td>
              )}
            </tr>

            {/* Row 2: Percentage Tax (Sec. 116) */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
              <td className="py-2.5 px-3 font-medium text-zinc-600 dark:text-zinc-400">{t.tableRowPercentageTax}</td>
              <td
                className={`py-2.5 px-3 text-center tabular-nums font-semibold ${
                  isWinner8
                    ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : "text-emerald-700 dark:text-emerald-400"
                }`}
              >
                ₱0 <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">({lang === "en" ? "Exempt" : "Libre"})</span>
              </td>
              <td
                className={`py-2.5 px-3 text-center tabular-nums font-semibold ${
                  isWinnerOSD
                    ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {formatPHP(result.graduatedOSD.percentageAnnual)}
              </td>
              {hasExpenses && result.graduatedItemized && (
                <td
                  className={`py-2.5 px-3 text-center tabular-nums font-semibold ${
                    isWinnerItemized
                      ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {formatPHP(result.graduatedItemized.percentageAnnual)}
                </td>
              )}
            </tr>

            {/* Row 3: Total Tax Liability (Bold / Key Metric) */}
            <tr className="bg-zinc-50/60 dark:bg-zinc-950/50 font-bold">
              <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">{t.tableRowTotalLiability}</td>
              <td
                className={`py-3 px-3 text-center tabular-nums text-sm font-black ${
                  isWinner8
                    ? "bg-emerald-100/60 dark:bg-emerald-950/60 border-x border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {result.eight.eligible ? formatPHP(result.eight.taxAnnual) : t.notEligible}
              </td>
              <td
                className={`py-3 px-3 text-center tabular-nums text-sm font-black ${
                  isWinnerOSD
                    ? "bg-emerald-100/60 dark:bg-emerald-950/60 border-x border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {formatPHP(result.graduatedOSD.taxAnnual)}
              </td>
              {hasExpenses && result.graduatedItemized && (
                <td
                  className={`py-3 px-3 text-center tabular-nums text-sm font-black ${
                    isWinnerItemized
                      ? "bg-emerald-100/60 dark:bg-emerald-950/60 border-x border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {formatPHP(result.graduatedItemized.taxAnnual)}
                </td>
              )}
            </tr>

            {/* Row 4: Less 2307 Credits (if user entered CWT) */}
            {result.cwtAnnual > 0 && (
              <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400">
                <td className="py-2.5 px-3 font-medium">{t.tableRowCwtCredit}</td>
                <td
                  className={`py-2.5 px-3 text-center tabular-nums ${
                    isWinner8 ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800" : ""
                  }`}
                >
                  −{formatPHP(result.cwtAnnual)}
                </td>
                <td
                  className={`py-2.5 px-3 text-center tabular-nums ${
                    isWinnerOSD ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800" : ""
                  }`}
                >
                  −{formatPHP(result.cwtAnnual)}
                </td>
                {hasExpenses && result.graduatedItemized && (
                  <td
                    className={`py-2.5 px-3 text-center tabular-nums ${
                      isWinnerItemized ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800" : ""
                    }`}
                  >
                    −{formatPHP(result.cwtAnnual)}
                  </td>
                )}
              </tr>
            )}

            {/* Row 5: Actual Cash to Pay (if 2307 exists) */}
            {result.cwtAnnual > 0 && (
              <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 font-bold text-zinc-900 dark:text-zinc-100">
                <td className="py-2.5 px-3">{t.tableRowNetPayable}</td>
                <td
                  className={`py-2.5 px-3 text-center tabular-nums font-bold ${
                    isWinner8 ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-x border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200" : ""
                  }`}
                >
                  {formatPHP(result.eight.netPayableAnnual)}
                </td>
                <td
                  className={`py-2.5 px-3 text-center tabular-nums font-bold ${
                    isWinnerOSD ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-x border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200" : ""
                  }`}
                >
                  {formatPHP(result.graduatedOSD.netPayableAnnual)}
                </td>
                {hasExpenses && result.graduatedItemized && (
                  <td
                    className={`py-2.5 px-3 text-center tabular-nums font-bold ${
                      isWinnerItemized ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-x border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200" : ""
                    }`}
                  >
                    {formatPHP(result.graduatedItemized.netPayableAnnual)}
                  </td>
                )}
              </tr>
            )}

            {/* Row 6: Estimated Take-Home Pay */}
            <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
              <td className="py-2.5 px-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.tableRowTakeHome}</td>
              <td
                className={`py-2.5 px-3 text-center tabular-nums font-bold ${
                  isWinner8
                    ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {formatPHP(takeHome8)}
              </td>
              <td
                className={`py-2.5 px-3 text-center tabular-nums font-bold ${
                  isWinnerOSD
                    ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {formatPHP(takeHomeOSD)}
              </td>
              {hasExpenses && result.graduatedItemized && (
                <td
                  className={`py-2.5 px-3 text-center tabular-nums font-bold ${
                    isWinnerItemized
                      ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {formatPHP(takeHomeItemized)}
                </td>
              )}
            </tr>

            {/* Row 7: Forms Required */}
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
              <td className="py-2.5 px-3 font-medium">{t.tableRowFormsNeeded}</td>
              <td
                className={`py-2.5 px-3 text-center rounded-b-xl ${
                  isWinner8 ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-b border-emerald-300 dark:border-emerald-800 font-medium text-zinc-700 dark:text-zinc-300" : ""
                }`}
              >
                1701A (Annual) • 1701Q (Quarterly)
              </td>
              <td
                className={`py-2.5 px-3 text-center rounded-b-xl ${
                  isWinnerOSD ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-b border-emerald-300 dark:border-emerald-800 font-medium text-zinc-700 dark:text-zinc-300" : ""
                }`}
              >
                1701A/1701 + 2551Q (Quarterly)
              </td>
              {hasExpenses && result.graduatedItemized && (
                <td
                  className={`py-2.5 px-3 text-center rounded-b-xl ${
                    isWinnerItemized ? "bg-emerald-50/50 dark:bg-emerald-950/25 border-x border-b border-emerald-300 dark:border-emerald-800 font-medium text-zinc-700 dark:text-zinc-300" : ""
                  }`}
                >
                  1701 + 2551Q + Receipts
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quiet formula and rule details accordion */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowFormulas(!showFormulas)}
          className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1.5 transition cursor-pointer font-medium"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{lang === "en" ? "How each tax option is computed" : "Paano kinwenta ang bawat opsyon"}</span>
          {showFormulas ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showFormulas && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
            <div className="space-y-1">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{t.title8}:</span>
              <p className="text-[11px] leading-relaxed">
                {!isMixed ? t.formula8Pure : t.formula8Mixed
                  .replace("{salaryTax}", formatPHP(result.eight.salaryTaxAnnual))
                  .replace("{freelanceTax}", formatPHP(result.eight.freelanceTaxAnnual))}
              </p>
              <p className="text-[10.5px] text-emerald-800 dark:text-emerald-400 font-medium">{t.noPercentageTax}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{t.titleGradOSD}:</span>
              <p className="text-[11px] leading-relaxed">
                {t.taxableBaseLabel.replace("{amount}", formatPHP(result.graduatedOSD.taxableAnnual))}
              </p>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">{t.requiresTwoForms}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
