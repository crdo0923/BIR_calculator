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
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme?: "light" | "dark";
  toggleTheme?: () => void;
  onOpenEBIR: () => void;
  onOpenPaymentGuide: () => void;
  onOpenGlossary: () => void;
  appMode?: "freelance" | "employee";
  setAppMode?: (mode: "freelance" | "employee") => void;
  onOpenCookies?: () => void;
  onOpenSourceCode?: () => void;
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Header({
  lang,
  setLang,
  theme = "light",
  toggleTheme,
  onOpenEBIR,
  onOpenPaymentGuide,
  onOpenGlossary,
  onOpenCookies,
  onOpenSourceCode,
}: HeaderProps) {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSourceClick = (e: React.MouseEvent) => {
    if (onOpenSourceCode) {
      e.preventDefault();
      onOpenSourceCode();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 shadow-2xs transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs ring-1 ring-emerald-800/20 group-hover:bg-emerald-800 dark:group-hover:bg-emerald-500 transition">
              <span className="font-serif text-base leading-none text-white font-black select-none">₱</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition">
                  {t.brandName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  {t.countryTag}
                </span>
              </div>
              <div className="text-[10.5px] text-zinc-500 dark:text-zinc-400 font-normal leading-none hidden sm:block">
                {t.lawsBadge}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {/* eBIRForms Guide Modal Trigger */}
            <button
              type="button"
              onClick={onOpenEBIR}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>{t.eBirFormsGuideBtn}</span>
            </button>

            {/* Payment Filing Guide Trigger */}
            <button
              type="button"
              onClick={onOpenPaymentGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>{t.howToPayBtn}</span>
            </button>

            {/* Tax Glossary Trigger */}
            <button
              type="button"
              onClick={onOpenGlossary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>{t.lawsGlossaryBtn}</span>
            </button>

            <span className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />

            {/* Language Switcher */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/90 rounded-lg p-0.5 border border-zinc-200/80 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  lang === "en"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("tl")}
                className={`px-2 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  lang === "tl"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                TL
              </button>
            </div>

            {/* Theme Switcher Toggle Button (Desktop) */}
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                title={t.themeToggle}
                aria-label={t.themeToggle}
                className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 transition cursor-pointer ml-0.5"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-600" />
                )}
              </button>
            )}

            {/* Source Code GitHub Link (Desktop) */}
            <a
              href="https://github.com/crdo0923/BIR_calculator"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSourceClick}
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 transition cursor-pointer"
              title="GitHub"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Header Right: Theme Toggle + Language Toggle + Source Code + More Button */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Mobile GitHub link */}
            <a
              href="https://github.com/crdo0923/BIR_calculator"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSourceClick}
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 transition cursor-pointer"
              title="View source code on GitHub"
              aria-label="View source code on GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 transition cursor-pointer"
                title={theme === "dark" ? t.themeLight : t.themeDark}
                aria-label={t.themeToggle}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-600" />
                )}
              </button>
            )}

            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200/80 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  lang === "en"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("tl")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  lang === "tl"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                TL
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
              aria-label={t.headerMoreMenu}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 space-y-1 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPaymentGuide();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:bg-zinc-100 dark:active:bg-zinc-700 transition cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:bg-zinc-100 dark:active:bg-zinc-700 transition cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:bg-zinc-100 dark:active:bg-zinc-700 transition cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <span>{t.lawsGlossaryBtn}</span>
            </button>

            {/* Source Code GitHub Option */}
            <a
              href="https://github.com/crdo0923/BIR_calculator"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleSourceClick(e);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:bg-zinc-100 dark:active:bg-zinc-700 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <span>{t.sourceCodeLabel} (GitHub)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>

            {/* Theme Toggle option inside mobile menu */}
            {toggleTheme && (
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:bg-zinc-100 dark:active:bg-zinc-700 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                  <span>{theme === "dark" ? t.themeLight : t.themeDark}</span>
                </div>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-wider">
                  {theme === "dark" ? "Dark" : "Light"}
                </span>
              </button>
            )}

            {onOpenCookies && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCookies();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:bg-zinc-100 dark:active:bg-zinc-700 transition cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                  <Cookie className="w-4 h-4" />
                </div>
                <span>{t.headerPrivacySettings}</span>
              </button>
            )}

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <a
                href="https://www.bir.gov.ph/ebirforms"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
              >
                <span>{lang === "en" ? "Official BIR Portal" : "Opisyal na BIR Portal"}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
