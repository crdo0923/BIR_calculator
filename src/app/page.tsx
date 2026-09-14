"use client";

import React, { useMemo, useState } from "react";
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
import Link from "next/link";
import { Briefcase, Building2, ShieldAlert, Scale, Cookie, Download, ExternalLink } from "lucide-react";

export default function Home() {
  // Language toggle: default English, interactive English/Tagalog toggle
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];

  // Mode switcher: Freelance/Business vs Full-Time Employee
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-zinc-50/80 to-slate-100/60 text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Header
        lang={lang}
        setLang={setLang}
        onOpenEBIR={() => setIsEBIRModalOpen(true)}
        onOpenPaymentGuide={() => setIsPaymentModalOpen(true)}
        onOpenGlossary={() => setIsGlossaryModalOpen(true)}
        appMode={appMode}
        setAppMode={setAppMode}
        onOpenCookies={() => setIsCookieSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* App Mode Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-zinc-900 rounded-2xl shadow-md border border-zinc-800">
            <button
              type="button"
              onClick={() => setAppMode("freelance")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                appMode === "freelance"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4 text-white" />
              <span>{t.modeFreelance}</span>
              <span className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                appMode === "freelance"
                  ? "bg-emerald-700/80 text-emerald-100"
                  : "bg-zinc-800 text-zinc-400"
              }`}>
                {t.modeFreelanceSub}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAppMode("employee")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                appMode === "employee"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4 text-white" />
              <span>{t.modeEmployee}</span>
              <span className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                appMode === "employee"
                  ? "bg-sky-700/80 text-sky-100"
                  : "bg-zinc-800 text-zinc-400"
              }`}>
                {t.modeEmployeeSub}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: BUSINESS & FREELANCER (8% vs GRADUATED) */}
        {/* ========================================================================= */}
        {appMode === "freelance" ? (
          <>
            {/* Hero Header */}
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2.5">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white border border-zinc-200/80 shadow-2xs text-zinc-600">
                <span>{t.heroFreelanceBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
                {t.heroFreelanceTitle}
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto">
                {t.heroFreelanceSubtitle}
              </p>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column (5 cols on desktop): Input Controls */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
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

                {/* Break-even Card under Inputs */}
                <BreakEvenCard
                  result={result}
                  expenses={hasExpenses ? expenses : 0}
                  grossAnnual={result.grossAnnual}
                  lang={lang}
                />
              </div>

              {/* Right Column (7 cols on desktop): Results, Comparison & Calendars */}
              <div className="lg:col-span-7 space-y-6">
                {/* Top Winner Card */}
                <TaxWinnerHero
                  result={result}
                  isOver3M={isOver3M}
                  onOpenEBIR={() => setIsEBIRModalOpen(true)}
                  onOpenPaymentGuide={() => setIsPaymentModalOpen(true)}
                  lang={lang}
                />

                {/* Visual Breakdown Bar */}
                <TaxBreakdownVisualizer
                  result={result}
                  grossAnnual={result.grossAnnual}
                  lang={lang}
                />

                {/* Side by Side Comparison Cards */}
                <ComparisonCards
                  result={result}
                  isMixed={isMixed}
                  hasExpenses={hasExpenses}
                  lang={lang}
                />

                {/* 8% vs Graduated Plain-Language Collapsible FAQ */}
                <RegimeExplainerFAQ lang={lang} />

                {/* Deadlines Calendar */}
                <DeadlinesCalendar
                  is8Percent={winnerIs8}
                  lang={lang}
                />
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* MODE 2: FULL-TIME EMPLOYEE SALARY & PAYSLIP CALCULATOR */
          /* ========================================================================= */
          <>
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2.5">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white border border-zinc-200/80 shadow-2xs text-zinc-600">
                <span>{t.heroEmployeeBadge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
                {t.heroEmployeeTitle}
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto">
                {t.heroEmployeeSubtitle}
              </p>
            </div>

            <EmployeeSalaryCalculator
              lang={lang}
              onOpenGlossary={() => setIsGlossaryModalOpen(true)}
            />
          </>
        )}

        {/* Prominent Statutory Disclaimer Callout */}
        <div className="mt-10 p-4 sm:p-5 bg-white border border-zinc-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-600 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-zinc-900 text-xs sm:text-sm">
                  {lang === "en"
                    ? "Statutory Educational Disclaimer & Accuracy Note"
                    : "Pormal na Paunawa sa Katumpakan at Paggamit"}
                </span>
                <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full border border-zinc-200">
                  RA 10963 • RA 11976
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed max-w-3xl">
                {lang === "en"
                  ? "BIR Co-Pilot computes estimates based on the National Internal Revenue Code (TRAIN Law RA 10963 & EOPT Act RA 11976). This application is an educational calculation aid and does NOT constitute certified tax, legal, or accounting advice. Always verify final returns via official eBIRForms packages or your employer's Form 2316. If you have complex setups (e.g. PEZA incentives, export zero-rated VAT, or multi-employer income), consult a licensed CPA."
                  : "Kinukwenta ng BIR Co-Pilot ang mga pagtatantiya batay sa Tax Code ng Pilipinas (TRAIN Law RA 10963 at EOPT Act RA 11976). Ito ay educational planning tool at HINDI pormal na payong legal o CPA advice. Laging patunayan ang iyong returns sa opisyal na eBIRForms o sa Form 2316 ng inyong kumpanya. Para sa mga komplikadong sitwasyon (tulad ng PEZA incentives o maraming employer), kumonsulta sa lisensyadong CPA."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsGlossaryModalOpen(true)}
            className="shrink-0 px-3.5 py-2 bg-zinc-900 hover:bg-black text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
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

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-200/80 bg-white py-8 pb-24 sm:pb-8 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          {/* Official Tax Portals & Downloads */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-zinc-500 pt-1">
            <a
              href="https://www.bir.gov.ph/ebirforms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <span>{lang === "en" ? "Official BIR eBIRForms Portal" : "Opisyal na BIR eBIRForms Portal"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="/forms/Offline-eBIRForms-Package-v7.9.4.2.zip"
              download="Offline-eBIRForms-Package-v7.9.4.2.zip"
              className="inline-flex items-center gap-1 font-semibold text-zinc-700 hover:text-zinc-900 hover:underline"
            >
              <Download className="w-3 h-3 text-zinc-500" />
              <span>{lang === "en" ? "Offline Forms (.zip)" : "Offline Forms (.zip)"}</span>
            </a>
          </div>

          {/* Legal Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-600">
            <Link href="/terms" className="hover:text-zinc-900 transition underline underline-offset-2">
              {lang === "en" ? "Terms of Service" : "Tuntunin ng Paggamit"}
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-zinc-900 transition underline underline-offset-2">
              {lang === "en" ? "Privacy Policy" : "Patakaran sa Privacy"}
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsGlossaryModalOpen(true)}
              className="hover:text-zinc-900 transition underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <Scale className="w-3 h-3 text-zinc-500" />
              <span>{lang === "en" ? "Statutory Citations & Glossary" : "Mga Batas at Talahulugan"}</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsCookieSettingsOpen(true)}
              className="hover:text-zinc-900 transition underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <Cookie className="w-3 h-3 text-zinc-500" />
              <span>{lang === "en" ? "Cookie Preferences" : "Kagustuhan sa Cookies"}</span>
            </button>
          </div>

          {/* Creator Credit: Made by DEVjules */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-emerald-50 hover:border-emerald-200 border border-zinc-200/80 text-xs font-semibold text-zinc-800 transition shadow-2xs">
              <span>{t.footerMadeBy}</span>
            </div>
            <span className="hidden sm:inline text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">{t.footerMadeBySub}</span>
          </div>

          <p className="flex items-center justify-center gap-1 text-zinc-500">
            {t.footerBuiltFor}
          </p>
          <p className="text-[11px] text-zinc-400 max-w-2xl mx-auto">
            {t.footerDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
