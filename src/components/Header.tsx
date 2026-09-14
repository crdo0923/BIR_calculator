"use client";

import React from "react";
import { Language, translations } from "@/lib/translations";
import {
  FileSpreadsheet,
  CreditCard,
  Scale,
  Briefcase,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenEBIR: () => void;
  onOpenPaymentGuide: () => void;
  onOpenGlossary: () => void;
  appMode?: "freelance" | "employee";
  setAppMode?: (mode: "freelance" | "employee") => void;
  onOpenCookies?: () => void;
}

export function Header({
  lang,
  setLang,
  onOpenEBIR,
  onOpenPaymentGuide,
  onOpenGlossary,
  appMode = "freelance",
  setAppMode,
}: HeaderProps) {
  const t = translations[lang];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-1 ring-emerald-600/20 group-hover:scale-105 transition">
              <span className="font-serif text-lg leading-none text-white font-black select-none">₱</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-zinc-900 group-hover:text-emerald-700 transition">
                  {t.brandName}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {t.countryTag}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                <span>{t.lawsBadge}</span>
              </div>
            </div>
          </Link>

          {/* Desktop Controls (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-2.5">
            {/* Where to Pay Button */}
            <button
              type="button"
              onClick={onOpenPaymentGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 active:scale-95 transition border border-emerald-200/70 cursor-pointer"
              title={lang === "en" ? "Where and how to pay BIR taxes online and in banks" : "Saan at paano magbayad ng buwis"}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.howToPayBtn}</span>
            </button>

            {/* eBIRForms Cheat Sheet Button */}
            <button
              type="button"
              onClick={onOpenEBIR}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 active:scale-95 transition border border-zinc-200/60 cursor-pointer"
              title={lang === "en" ? "View eBIRForms Line-by-Line Guide" : "Tingnan ang eBIRForms Gabay"}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-600" />
              <span>{t.eBirFormsGuideBtn}</span>
            </button>

            {/* Laws & Tax Glossary */}
            <button
              type="button"
              onClick={onOpenGlossary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 active:scale-95 transition border border-zinc-200/60 cursor-pointer"
              title={lang === "en" ? "Tax Terms Glossary & Legal Citations" : "Talahulugan ng Buwis at Mga Batas"}
            >
              <Scale className="w-3.5 h-3.5 text-zinc-600" />
              <span>{t.lawsGlossaryBtn}</span>
            </button>

            {/* Language Switcher Toggle */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                  lang === "en"
                    ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/50"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                title="Switch to English"
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setLang("tl")}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                  lang === "tl"
                    ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/50"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                title="Switch to Tagalog"
              >
                <span>🇵🇭</span>
                <span>TL</span>
              </button>
            </div>
          </div>

          {/* Mobile Right Controls: Language Switcher */}
          <div className="flex md:hidden items-center">
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  lang === "en" ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/50" : "text-zinc-500"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("tl")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  lang === "tl" ? "bg-white text-zinc-900 shadow-xs border border-zinc-200/50" : "text-zinc-500"
                }`}
              >
                TL
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sleek Mobile Bottom Action Bar (Dock on Mobile) */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 pt-1.5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] px-3 flex items-center justify-around shadow-lg"
      >
        {setAppMode && (
          <button
            type="button"
            onClick={() => setAppMode(appMode === "freelance" ? "employee" : "freelance")}
            className="flex-1 flex flex-col items-center gap-0.5 text-[10px] font-bold transition cursor-pointer active:scale-95 py-0.5"
          >
            {appMode === "freelance" ? (
              <>
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Briefcase className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-emerald-700 font-bold leading-tight">8% Flat</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sky-700 font-bold leading-tight">Employee</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onOpenPaymentGuide}
          className="flex-1 flex flex-col items-center gap-0.5 text-[10px] font-bold text-zinc-600 hover:text-zinc-900 transition cursor-pointer active:scale-95 py-0.5"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/70 flex items-center justify-center shadow-2xs">
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <span className="leading-tight">{lang === "en" ? "Pay Tax" : "Bayad"}</span>
        </button>

        <button
          type="button"
          onClick={onOpenEBIR}
          className="flex-1 flex flex-col items-center gap-0.5 text-[10px] font-bold text-zinc-600 hover:text-zinc-900 transition cursor-pointer active:scale-95 py-0.5"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200/70 flex items-center justify-center shadow-2xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-700" />
          </div>
          <span className="leading-tight">eBIRForms</span>
        </button>

        <button
          type="button"
          onClick={onOpenGlossary}
          className="flex-1 flex flex-col items-center gap-0.5 text-[10px] font-bold text-zinc-600 hover:text-zinc-900 transition cursor-pointer active:scale-95 py-0.5"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200/70 flex items-center justify-center shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-zinc-700" />
          </div>
          <span className="leading-tight">{lang === "en" ? "Laws" : "Batas"}</span>
        </button>
      </nav>
    </>
  );
}

