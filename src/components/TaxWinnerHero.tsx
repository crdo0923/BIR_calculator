"use client";

import React from "react";
import { ComputeResult, formatPHP } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { ArrowRight, ShieldAlert, Sparkles, FileSpreadsheet, CreditCard } from "lucide-react";

interface TaxWinnerHeroProps {
  result: ComputeResult;
  isOver3M: boolean;
  onOpenEBIR: () => void;
  onOpenPaymentGuide: () => void;
  lang: Language;
}

export function TaxWinnerHero({ result, isOver3M, onOpenEBIR, onOpenPaymentGuide, lang }: TaxWinnerHeroProps) {
  const t = translations[lang];
  const winner = result.winner;
  const savings = result.savingsAnnual;
  const winnerIs8 = winner === "8%";
  const winnerIsGrad = winner === "graduated-OSD" || winner === "graduated-itemized";

  // Winner option details
  const winnerOption = winnerIs8
    ? result.eight
    : winner === "graduated-itemized" && result.graduatedItemized
    ? result.graduatedItemized
    : result.graduatedOSD;

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-zinc-800 space-y-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Tag */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded-full px-3 py-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.recStrategy}</span>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">{t.lawTag}</span>
      </div>

      {/* Hero Recommendation Headline */}
      <div>
        {isOver3M ? (
          <div>
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{t.vatRequiredTitle}</h1>
            </div>
            <p className="mt-1 text-xs text-zinc-300">{t.vatRequiredDesc}</p>
          </div>
        ) : winnerIs8 ? (
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{t.topChoiceBadge}</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
              {t.choose8Title.replace("8% Flat Rate", "")} <span className="text-emerald-400">8% Flat Rate</span>
            </h1>
            <p className="mt-1 text-xs text-zinc-300">
              {t.choose8Desc.replace("{savings}", formatPHP(savings))}
            </p>
          </div>
        ) : winnerIsGrad ? (
          <div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">{t.topChoiceBadge}</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
              {t.chooseGradTitle.replace("Graduated Rates", "")} <span className="text-sky-400">Graduated Rates</span>
            </h1>
            <p className="mt-1 text-xs text-zinc-300">
              {t.chooseGradDesc.replace("{savings}", formatPHP(savings))}
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t.equalTaxTitle}</h1>
            <p className="mt-1 text-xs text-zinc-300">{t.equalTaxDesc}</p>
          </div>
        )}
      </div>

      {/* Highlight Tax Savings Banner from Template */}
      {savings > 0 && !isOver3M && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-zinc-950 font-bold flex items-center justify-center shrink-0 shadow-xs">
              <span className="font-serif text-lg font-black leading-none">₱</span>
            </div>
            <div>
              <div className="text-[10.5px] uppercase font-bold text-emerald-400 tracking-wider">
                {lang === "en" ? "Tax Savings vs Alternative" : "Matitipid sa Buwis"}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums">
                +{formatPHP(savings)}
                <span className="text-xs font-normal text-emerald-300 ml-1.5">{lang === "en" ? "/year" : "/taon"}</span>
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full">
              {winnerIs8 ? "8% Flat Rate" : "Graduated Rates"}
            </span>
          </div>
        </div>
      )}

      {/* Snapshot Numbers Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
        <div className="bg-zinc-800/70 border border-zinc-700/60 rounded-xl p-3.5">
          <div className="text-[10.5px] uppercase font-bold text-zinc-400 tracking-wider">{t.annualTaxDue}</div>
          <div className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 tabular-nums">
            {formatPHP(winnerOption.taxAnnual)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            {t.estQuarterly.replace("{amount}", formatPHP(winnerOption.taxQuarter))}
          </div>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3.5">
          <div className="text-[10.5px] uppercase font-bold text-emerald-400 tracking-wider flex items-center justify-between">
            <span>{t.cashOutNet}</span>
            {result.cwtAnnual > 0 && (
              <span className="text-[9px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded">
                {t.less2307Badge}
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-300 mt-1 tabular-nums">
            {formatPHP(winnerOption.netPayableAnnual)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            {result.cwtAnnual > 0
              ? t.cwtPaidNote.replace("{amount}", formatPHP(result.cwtAnnual))
              : t.noCwtNote}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onOpenEBIR}
          className="w-full py-3 px-3 bg-white text-zinc-900 hover:bg-zinc-100 active:scale-[0.99] font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-zinc-900 shrink-0" />
          <span className="truncate">{t.viewEBIRCheatSheet}</span>
          <ArrowRight className="w-4 h-4 text-zinc-500 ml-auto shrink-0" />
        </button>

        <button
          type="button"
          onClick={onOpenPaymentGuide}
          className="w-full py-3 px-3 bg-zinc-800 hover:bg-zinc-700 text-white active:scale-[0.99] font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-zinc-700/80 cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.howToPayAction}</span>
        </button>
      </div>
    </div>
  );
}
