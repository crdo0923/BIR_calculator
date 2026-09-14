"use client";

import React, { useState } from "react";
import { Language, translations } from "@/lib/translations";
import {
  FileSpreadsheet,
  CreditCard,
  Scale,
  Cookie,
  MoreVertical,
  X,
  ExternalLink,
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
  onOpenCookies,
}: HeaderProps) {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs ring-1 ring-emerald-800/20 group-hover:bg-emerald-800 transition">
              <span className="font-serif text-base leading-none text-white font-black select-none">₱</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-zinc-900 group-hover:text-emerald-800 transition">
                  {t.brandName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  {t.countryTag}
                </span>
              </div>
              <div className="text-[10.5px] text-zinc-500 font-normal leading-none hidden sm:block">
                {t.lawsBadge}
              </div>
            </div>
          </Link>

          {/* Desktop Ghost Nav Links */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onOpenPaymentGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.howToPayBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenEBIR}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.eBirFormsGuideBtn}</span>
            </button>

            <button
              type="button"
              onClick={onOpenGlossary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.lawsGlossaryBtn}</span>
            </button>

            <div className="h-4 w-px bg-zinc-200 mx-1" />

            {/* Language Switcher Toggle */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/80">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                  lang === "en"
                    ? "bg-white text-zinc-900 shadow-2xs font-bold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("tl")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                  lang === "tl"
                    ? "bg-white text-zinc-900 shadow-2xs font-bold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                TL
              </button>
            </div>
          </div>

          {/* Mobile Header Right: Language Toggle + More Button */}
          <div className="flex md:hidden items-center gap-1.5">
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/80">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  lang === "en" ? "bg-white text-zinc-900 shadow-2xs font-bold" : "text-zinc-500"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("tl")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  lang === "tl" ? "bg-white text-zinc-900 shadow-2xs font-bold" : "text-zinc-500"
                }`}
              >
                TL
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-zinc-700 hover:bg-zinc-100 border border-zinc-200 transition cursor-pointer"
              aria-label={t.headerMoreMenu}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-1 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPaymentGuide();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span>{t.howToPayBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEBIR();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span>{t.eBirFormsGuideBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGlossary();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <span>{t.lawsGlossaryBtn}</span>
            </button>

            {onOpenCookies && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCookies();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
                  <Cookie className="w-4 h-4" />
                </div>
                <span>{t.headerPrivacySettings}</span>
              </button>
            )}

            <div className="pt-2 border-t border-zinc-100">
              <a
                href="https://www.bir.gov.ph/ebirforms"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50/60 hover:bg-emerald-50"
              >
                <span>{lang === "en" ? "Official BIR Portal" : "Opisyal na BIR Portal"}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
