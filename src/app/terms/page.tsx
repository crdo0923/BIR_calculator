"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, ShieldAlert } from "lucide-react";
import { Language } from "@/lib/translations";

export default function TermsOfServicePage() {
  const [lang, setLang] = useState<Language>("en");
  const isEn = lang === "en";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? "Back to Calculator" : "Bumalik sa Calculator"}</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  lang === "en" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                🇺🇸 EN
              </button>
              <button
                type="button"
                onClick={() => setLang("tl")}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  lang === "tl" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                🇵🇭 TL
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Legal Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-zinc-100 pb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
              <Scale className="w-3.5 h-3.5" />
              <span>{isEn ? "Legal Agreement" : "Legal na Kasunduan"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {isEn ? "Terms of Service" : "Mga Tuntunin ng Paggamit"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              {isEn
                ? "Last updated: 2026. Effective for all users of BIR Co-Pilot."
                : "Huling na-update: 2026. May bisa para sa lahat ng gumagamit ng BIR Co-Pilot."}
            </p>
          </div>

          {/* Prominent Legal Disclaimer Callout */}
          <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-2 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
              <span>{isEn ? "Educational & Estimation Purpose Only" : "Pang-Edukasyon at Tantiya Lamang"}</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              {isEn
                ? "BIR Co-Pilot is an open-access calculation and planning aid built to help Filipino taxpayers understand the mechanics of Republic Act No. 10963 (TRAIN Law) and Republic Act No. 11976 (EOPT Act). This application does NOT provide formal certified tax, legal, or accounting advice, and must not be used as a substitute for consultation with a licensed Certified Public Accountant (CPA) or direct verification with the Bureau of Internal Revenue (BIR)."
                : "Ang BIR Co-Pilot ay isang bukas na kagamitan upang tulungan ang mga taxpayer sa Pilipinas na maunawaan ang TRAIN Law (RA 10963) at EOPT Act (RA 11976). Hindi ito pormal na payong legal o accounting mula sa Certified Public Accountant (CPA). Huwag itong gamitin bilang kapalit sa propesyonal na payo ng CPA o direktang kumpirmasyon mula sa Bureau of Internal Revenue (BIR)."}
            </p>
          </div>

          {/* Terms Articles */}
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-zinc-700">
            {/* 1. Acceptance */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                {isEn ? "Acceptance of Terms" : "Pagtanggap sa mga Tuntunin"}
              </h2>
              <p>
                {isEn
                  ? "By accessing or using BIR Co-Pilot, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the application."
                  : "Sa paggamit ng BIR Co-Pilot, sumasang-ayon ka sa mga tuntuning ito. Kung hindi ka sumasang-ayon sa anumang bahagi, mangyaring huwag gamitin ang website."}
              </p>
            </section>

            {/* 2. Nature of the Calculations */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                {isEn ? "Accuracy and Nature of Calculations" : "Katumpakan at Katangian ng Pagkwenta"}
              </h2>
              <p>
                {isEn
                  ? "All computations—including the 8% Gross Income Tax, Graduated Income Tax (0%–35%), 40% Optional Standard Deduction (OSD), 3% Percentage Tax (Sec. 116), Form 2307 withholding credits, SSS (14%), PhilHealth (5%), and Pag-IBIG (Circular 460)—are simulated based on prevailing Philippine tax statutes and official circulars."
                  : "Lahat ng kalkulasyon—kabilang ang 8% Income Tax, Graduated Rates, 40% OSD, 3% Percentage Tax, Form 2307 credits, at mga kaltas sa SSS, PhilHealth, at Pag-IBIG—ay isinagawa batay sa kasalukuyang batas at circulars ng gobyerno."}
              </p>
              <p>
                {isEn
                  ? "However, mathematical outputs rely strictly upon the values you provide. BIR Co-Pilot makes no warranty that these estimates will precisely reflect final administrative assessments, audit findings, or penalty determinations by the BIR."
                  : "Gayunpaman, ang resulta ay nakasalalay sa mga numerong iyong inilagay. Walang garantiya na ang mga tantiyang ito ay magiging 100% magkapareho sa opisyal na audit o assessment ng BIR."}
              </p>
            </section>

            {/* 3. No CPA-Client Relationship */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                {isEn ? "No Professional or Fiduciary Relationship" : "Walang Propesyonal na Ugnayan (No CPA-Client)"}
              </h2>
              <p>
                {isEn
                  ? "Transmission of information to or from this application does not establish a confidential, CPA-client, attorney-client, or fiduciary relationship. You are solely responsible for filing your official tax returns (eBIRForms, eFPS) and remitting payments to Authorized Agent Banks or the BIR on time."
                  : "Ang paggamit ng tool na ito ay hindi lumilikha ng CPA-client o attorney-client relationship. Ikaw lamang ang may pananagutan sa pag-file ng iyong opisyal na tax returns (eBIRForms, eFPS) at pagbabayad sa takdang panahon."}
              </p>
            </section>

            {/* 4. Limitation of Liability */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  4
                </span>
                {isEn ? "Limitation of Liability" : "Limitasyon ng Pananagutan"}
              </h2>
              <p>
                {isEn
                  ? "To the fullest extent permitted by Philippine law, the creators, contributors, and maintainers of BIR Co-Pilot shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages, including tax penalties, surcharges, interest, loss of income, or legal fees resulting from the use or inability to use this service."
                  : "Sa ilalim ng batas ng Pilipinas, ang mga gumawa o nagpapanatili ng BIR Co-Pilot ay hindi mananagot sa anumang multa, interes, surcharges, o pagkalugi na maaaring idulot ng paggamit o maling pag-unawa sa tool na ito."}
              </p>
            </section>

            {/* 5. In-Browser Privacy */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  5
                </span>
                {isEn ? "Data Privacy & In-Browser Execution" : "Data Privacy at Paggamit sa Browser"}
              </h2>
              <p>
                {isEn
                  ? "All salary numbers, business income digits, and expense records remain strictly in your local device browser session. No personal financial information is collected, transmitted, or sold to any remote server or third party."
                  : "Lahat ng sweldo, benta, at gastos na ilalagay mo ay nananatili lamang sa browser ng iyong cellphone o computer. Hindi ito ipinapadala o ibinebenta sa anumang server o third party."}
              </p>
            </section>

            {/* 6. Governing Law */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  6
                </span>
                {isEn ? "Governing Law" : "Umiiral na Batas"}
              </h2>
              <p>
                {isEn
                  ? "These Terms shall be interpreted and governed in accordance with the laws of the Republic of the Philippines, including the National Internal Revenue Code of 1997, RA 10963, RA 11976, and the Data Privacy Act of 2012 (RA 10173)."
                  : "Ang mga tuntuning ito ay napapailalim sa mga batas ng Republika ng Pilipinas, kabilang ang National Internal Revenue Code, RA 10963, RA 11976, at ang Data Privacy Act of 2012 (RA 10173)."}
              </p>
            </section>
          </div>

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span>© 2026 BIR Co-Pilot PH</span>
              <span>•</span>
              <span className="font-medium text-zinc-700">Made with ❤️ by <strong>DEVjules</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/privacy" className="hover:text-zinc-900 underline">
                {isEn ? "Privacy Policy" : "Patakaran sa Privacy"}
              </Link>
              <Link href="/" className="hover:text-zinc-900 underline">
                {isEn ? "Open Calculator" : "Buksan ang Calculator"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
