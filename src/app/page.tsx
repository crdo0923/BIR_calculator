"use client";

import React, { useEffect, useMemo, useState } from "react";
import { computeAll, CWTMode } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { Header } from "@/components/Header";
import { IncomeConfig } from "@/components/IncomeConfig";
import { TaxWinnerHero } from "@/components/TaxWinnerHero";
import { ComparisonCards } from "@/components/ComparisonCards";
import { TaxBreakdownVisualizer } from "@/components/TaxBreakdownVisualizer";
import { BreakEvenCard } from "@/components/BreakEvenCard";
import { DeadlinesCalendar } from "@/components/DeadlinesCalendar";
import { EBIRFormsModal } from "@/components/EBIRFormsModal";
import { PaymentFilingGuideModal } from "@/components/PaymentFilingGuideModal";
import { EmployeeSalaryCalculator } from "@/components/EmployeeSalaryCalculator";
import { RegimeExplainerFAQ } from "@/components/RegimeExplainerFAQ";
import { TaxGlossaryModal } from "@/components/TaxGlossaryModal";
import { CookieConsent } from "@/components/CookieConsent";
import { SourceCodePromptModal } from "@/components/SourceCodePromptModal";
import Link from "next/link";
import { Briefcase, Building2, ShieldAlert, Scale, Cookie, Download, ExternalLink } from "lucide-react";

export default function Home() {
  // Language toggle: default English, interactive English/Tagalog toggle
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];

  // Theme state: light or dark
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Synchronize initial theme state from class set by head script or localStorage
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        if (e.matches) {
          document.documentElement.classList.add("dark");
          setTheme("dark");
        } else {
          document.documentElement.classList.remove("dark");
          setTheme("light");
        }
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Mode switcher: Freelance/Business vs Employee
  const [appMode, setAppMode] = useState<"freelance" | "employee">("freelance");

  // Input states (Freelance/Business)
  const [grossDigits, setGrossDigits] = useState("1000000");
  const [period, setPeriod] = useState<"annual" | "quarterly">("annual");
  const [isMixed, setIsMixed] = useState(false);
  const [salaryDigits, setSalaryDigits] = useState("300000");
  const [showExpenses, setShowExpenses] = useState(false);
  const [expenseDigits, setExpenseDigits] = useState("");
  const [cwtMode, setCwtMode] = useState<CWTMode>("none");
  const [cwtCustomDigits, setCwtCustomDigits] = useState("");

  // Modals
  const [isEBIRModalOpen, setIsEBIRModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  // Parse values safely
  const gross = Number(grossDigits || 0);
  const salaryAnnual = Number(salaryDigits || 0);
  const expenses = Number(expenseDigits || 0);
  const hasExpenses = showExpenses && expenses > 0;
  const cwtCustomAmount = Number(cwtCustomDigits || 0);

  // Compute taxes (Freelance/Business)
  const result = useMemo(
    () =>
      computeAll({
        grossInput: gross,
        period,
        isMixed,
        salaryAnnual,
        expenses: hasExpenses ? expenses : 0,
        cwtMode,
        cwtCustomAmount,
      }),
    [gross, period, isMixed, salaryAnnual, expenses, hasExpenses, cwtMode, cwtCustomAmount]
  );

  const isOver3M = result.grossAnnual > 3_000_000;
  const winnerIs8 = result.winner === "8%";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-zinc-50/80 to-slate-100/60 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-950 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-200">
      {/* Top Navigation */}
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenEBIR={() => setIsEBIRModalOpen(true)}
        onOpenPaymentGuide={() => setIsPaymentModalOpen(true)}
        onOpenGlossary={() => setIsGlossaryModalOpen(true)}
        appMode={appMode}
        setAppMode={setAppMode}
        onOpenCookies={() => setIsCookieSettingsOpen(true)}
        onOpenSourceCode={() => setIsSourceModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10 space-y-8 sm:space-y-10">
        {/* Hero Section: Immediate 3-Second Clarity */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs text-zinc-600 dark:text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500" />
            <span>{appMode === "freelance" ? t.heroFreelanceBadge : t.heroEmployeeBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            {appMode === "freelance" ? t.heroMainTitle : t.heroEmployeeTitle}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            {appMode === "freelance" ? t.heroMainSubtitle : t.heroEmployeeSubtitle}
          </p>

          {/* Step Guide */}
          <div className="pt-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {t.heroStepGuide}
          </div>
        </div>

        {/* Step 1: Choose Taxpayer (Clean 2-card selection) */}
        <div className="max-w-xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card 1: Self-employed / Freelancer */}
            <button
              type="button"
              onClick={() => setAppMode("freelance")}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer relative ${
                appMode === "freelance"
                  ? "bg-white dark:bg-zinc-900 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/20 dark:ring-emerald-500/20 shadow-xs"
                  : "bg-white/80 dark:bg-zinc-900/60 border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    appMode === "freelance"
                      ? "bg-emerald-700 dark:bg-emerald-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                  {t.taxpayerCardSelfEmployed}
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                {t.taxpayerCardSelfEmployedSub}
              </p>
              {appMode === "freelance" && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              )}
            </button>

            {/* Card 2: Employee */}
            <button
              type="button"
              onClick={() => setAppMode("employee")}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer relative ${
                appMode === "employee"
                  ? "bg-white dark:bg-zinc-900 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/20 dark:ring-emerald-500/20 shadow-xs"
                  : "bg-white/80 dark:bg-zinc-900/60 border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    appMode === "employee"
                      ? "bg-emerald-700 dark:bg-emerald-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                  {t.taxpayerCardEmployee}
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                {t.taxpayerCardEmployeeSub}
              </p>
              {appMode === "employee" && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: SELF-EMPLOYED / FREELANCER (8% vs GRADUATED) */}
        {/* ========================================================================= */}
        {appMode === "freelance" ? (
          <>
            {/* Above-the-fold 2-Column Grid: Left Inputs, Right Tier 1 Result Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column (5 cols on desktop): Step 2 Input Controls */}
              <div className="lg:col-span-5">
                <IncomeConfig
                  grossDigits={grossDigits}
                  setGrossDigits={setGrossDigits}
                  period={period}
                  setPeriod={setPeriod}
                  isMixed={isMixed}
                  setIsMixed={setIsMixed}
                  salaryDigits={salaryDigits}
                  setSalaryDigits={setSalaryDigits}
                  showExpenses={showExpenses}
                  setShowExpenses={setShowExpenses}
                  expenseDigits={expenseDigits}
                  setExpenseDigits={setExpenseDigits}
                  cwtMode={cwtMode}
                  setCwtMode={setCwtMode}
                  cwtCustomDigits={cwtCustomDigits}
                  setCwtCustomDigits={setCwtCustomDigits}
                  grossAnnual={result.grossAnnual}
                  lang={lang}
                />
              </div>

              {/* Right Column (7 cols on desktop): Step 3 Tier 1 Result Card */}
              <div className="lg:col-span-7">
                <TaxWinnerHero
                  result={result}
                  isOver3M={isOver3M}
                  onOpenEBIR={() => setIsEBIRModalOpen(true)}
                  onOpenPaymentGuide={() => setIsPaymentModalOpen(true)}
                  lang={lang}
                />
              </div>
            </div>

            {/* Tier 2: Full-Width Scannable Comparison Table & Visualizer */}
            <div className="space-y-6">
              <ComparisonCards
                result={result}
                isMixed={isMixed}
                hasExpenses={hasExpenses}
                lang={lang}
              />

              <TaxBreakdownVisualizer
                result={result}
                grossAnnual={result.grossAnnual}
                lang={lang}
              />
            </div>

            {/* Tier 3: 2-Column Decision Helpers (Break-Even & Deadlines) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <BreakEvenCard
                result={result}
                expenses={hasExpenses ? expenses : 0}
                grossAnnual={result.grossAnnual}
                lang={lang}
              />

              <DeadlinesCalendar
                is8Percent={winnerIs8}
                lang={lang}
              />
            </div>

            {/* Tier 4: Guidance & Accordion FAQ */}
            <div>
              <RegimeExplainerFAQ lang={lang} />
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* MODE 2: EMPLOYEE SALARY & PAYSLIP CALCULATOR */
          /* ========================================================================= */
          <EmployeeSalaryCalculator
            lang={lang}
            onOpenGlossary={() => setIsGlossaryModalOpen(true)}
          />
        )}

        {/* Compact Statutory Educational Disclaimer */}
        <div className="p-4 sm:p-5 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                  {lang === "en"
                    ? "Important Note & Educational Disclaimer"
                    : "Pormal na Paunawa sa Katumpakan at Paggamit"}
                </span>
                <span className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                  TRAIN Law • EOPT Act
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                {lang === "en"
                  ? "This tool is for estimation and planning purposes only. It does not constitute official tax advice or file returns directly with the Bureau of Internal Revenue (BIR). Always verify your actual tax dues using official BIR forms (eBIRForms) or consult an accredited CPA."
                  : "Ang kalkulador na ito ay para sa pagpaplano at pagtatantiya lamang. Hindi ito opisyal na payong legal o CPA advice at hindi direktang nagpa-file sa BIR. Laging patunayan ang iyong babayaran gamit ang opisyal na eBIRForms o kumonsulta sa lisensyadong CPA."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsGlossaryModalOpen(true)}
            className="shrink-0 px-3.5 py-2 bg-zinc-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            <Scale className="w-3.5 h-3.5 text-zinc-300" />
            <span>{lang === "en" ? "Legal Citations & Terms" : "Batas at Terminolohiya"}</span>
          </button>
        </div>
      </main>

      {/* Modals */}
      <EBIRFormsModal
        isOpen={isEBIRModalOpen}
        onClose={() => setIsEBIRModalOpen(false)}
        result={result}
        isMixed={isMixed}
        period={period}
        lang={lang}
        onOpenPaymentGuide={() => setIsPaymentModalOpen(true)}
      />

      <PaymentFilingGuideModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        lang={lang}
        onOpenEBIRGuide={() => setIsEBIRModalOpen(true)}
        taxPayableAmount={
          period === "annual"
            ? (result.winner === "8%" ? result.eight.netPayableAnnual : result.graduatedOSD.netPayableAnnual)
            : (result.winner === "8%" ? result.eight.netPayableQuarter : result.graduatedOSD.netPayableQuarter)
        }
      />

      <TaxGlossaryModal
        isOpen={isGlossaryModalOpen}
        onClose={() => setIsGlossaryModalOpen(false)}
        lang={lang}
      />

      <CookieConsent
        lang={lang}
        forceOpen={isCookieSettingsOpen}
        onCloseForceOpen={() => setIsCookieSettingsOpen(false)}
      />

      <SourceCodePromptModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          {/* Official Tax Portals & Downloads */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
            <a
              href="https://www.bir.gov.ph/ebirforms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 hover:underline"
            >
              <span>{lang === "en" ? "Official BIR eBIRForms Portal" : "Opisyal na BIR eBIRForms Portal"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="/forms/Offline-eBIRForms-Package-v7.9.4.2.zip"
              download="Offline-eBIRForms-Package-v7.9.4.2.zip"
              className="inline-flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline"
            >
              <Download className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              <span>{lang === "en" ? "Offline Forms (.zip)" : "Offline Forms (.zip)"}</span>
            </a>
          </div>

          {/* Legal Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition underline underline-offset-2">
              {lang === "en" ? "Terms of Service" : "Tuntunin ng Paggamit"}
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition underline underline-offset-2">
              {lang === "en" ? "Privacy Policy" : "Patakaran sa Privacy"}
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsGlossaryModalOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <Scale className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              <span>{lang === "en" ? "Statutory Citations & Glossary" : "Mga Batas at Talahulugan"}</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsCookieSettingsOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <Cookie className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              <span>{lang === "en" ? "Cookie Preferences" : "Kagustuhan sa Cookies"}</span>
            </button>
          </div>

          {/* Creator Credit & GitHub Source Link */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs">
              <span>{t.footerMadeBy}</span>
            </div>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
            <a
              href="https://github.com/crdo0923/BIR_calculator"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                setIsSourceModalOpen(true);
              }}
              title="GitHub"
              aria-label="GitHub"
              className="inline-flex items-center justify-center p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition shadow-2xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{t.footerMadeBySub}</span>
          </div>

          <p className="flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400">
            {t.footerBuiltFor}
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-2xl mx-auto">
            {t.footerDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
