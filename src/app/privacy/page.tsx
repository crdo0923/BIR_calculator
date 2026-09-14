"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, ServerOff } from "lucide-react";
import { Language } from "@/lib/translations";

export default function PrivacyPolicyPage() {
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

      {/* Main Privacy Policy Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-zinc-100 pb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEn ? "Privacy by Architecture" : "Disenyo ng Pribadong Arkitektura"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {isEn ? "Privacy Policy" : "Patakaran sa Privacy"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              {isEn
                ? "Effective 2026. Compliant with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173)."
                : "May bisa 2026. Alinsunod sa Data Privacy Act of 2012 ng Pilipinas (Batas Republika Blg. 10173)."}
            </p>
          </div>

          {/* Key Privacy Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ServerOff className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-zinc-900 text-xs sm:text-sm">
                {isEn ? "Zero Server Storage" : "Walang Server Storage"}
              </h3>
              <p className="text-[11px] text-zinc-600 leading-normal">
                {isEn
                  ? "Your gross sales, salary, and tax computations never leave your browser."
                  : "Ang sweldo, benta, at kwenta mo ay hindi lumalabas sa iyong cellphone o computer."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-zinc-900 text-xs sm:text-sm">
                {isEn ? "No Ad Tracking" : "Walang Tracking o Ads"}
              </h3>
              <p className="text-[11px] text-zinc-600 leading-normal">
                {isEn
                  ? "Zero advertising beacons, cross-site trackers, or third-party behavioral profiling."
                  : "Walang advertising trackers, marketing pixels, o pagbebenta ng data."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-200 text-zinc-800 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-zinc-900 text-xs sm:text-sm">
                {isEn ? "No Login Required" : "Walang Login o Signup"}
              </h3>
              <p className="text-[11px] text-zinc-600 leading-normal">
                {isEn
                  ? "Use the calculator completely anonymously without email or phone numbers."
                  : "Gamitin ang tool nang hindi nangangailangan ng email o personal na account."}
              </p>
            </div>
          </div>

          {/* Privacy Articles */}
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-zinc-700">
            {/* 1. Information We Do NOT Collect */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  1
                </span>
                {isEn ? "Information We Do NOT Collect" : "Mga Impormasyong HINDI Namin Kinokolekta"}
              </h2>
              <p>
                {isEn
                  ? "BIR Co-Pilot operates under a privacy-first architectural paradigm. When you type gross income, salary deductions, or official receipt figures, these numbers are processed strictly within your browser's JavaScript execution memory. We do not maintain any databases, backend logging pipelines, or server-side storage of your financial affairs."
                  : "Ang BIR Co-Pilot ay idinisenyo para sa 100% privacy. Kapag naglagay ka ng sweldo o benta, ito ay kinukwenta sa memory ng browser mo lamang. Wala kaming database, server logs, o kahit anong pag-iimbak ng iyong perang kinikita."}
              </p>
            </section>

            {/* 2. Local Storage and Cookies */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                {isEn ? "How Local Storage & Cookies Are Used" : "Paano Ginagamit ang Local Storage at Cookies"}
              </h2>
              <p>
                {isEn
                  ? "We only use your browser's localStorage for essential preferences:"
                  : "Gumagamit lamang kami ng localStorage para sa mga mahahalagang kagustuhan:"}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600 text-xs">
                <li>
                  <strong className="text-zinc-900">Language Preference:</strong>{" "}
                  {isEn
                    ? "Remembers whether you selected English (en) or Tagalog (tl)."
                    : "Tinatandaan kung English (en) o Tagalog (tl) ang pinili mo."}
                </li>
                <li>
                  <strong className="text-zinc-900">Cookie Consent State:</strong>{" "}
                  {isEn
                    ? "Saves whether you accepted or customized cookie settings (bir_cookie_consent)."
                    : "Itinatala kung tinanggap mo ang abiso sa cookies upang hindi ito muling lumabas."}
                </li>
              </ul>
              <p className="pt-1">
                {isEn
                  ? "You may delete these items at any time by clearing your browser cache or clicking 'Cookie Settings' in our footer."
                  : "Maaari mong burahin ang mga ito anumang oras sa pamamagitan ng pag-clear ng browser cache o pagpindot sa 'Cookie Settings' sa footer."}
              </p>
            </section>

            {/* 3. Compliance with RA 10173 */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  3
                </span>
                {isEn
                  ? "Compliance with the Data Privacy Act of 2012 (RA 10173)"
                  : "Pagsunod sa Data Privacy Act of 2012 (RA 10173)"}
              </h2>
              <p>
                {isEn
                  ? "Because BIR Co-Pilot does not collect, retain, or process personally identifiable information (PII) or sensitive personal information, your statutory rights to data privacy under Republic Act No. 10173 and National Privacy Commission (NPC) circulars are preserved by design through non-collection."
                  : "Dahil ang BIR Co-Pilot ay hindi nangongolekta o nagpoproseso ng personal na impormasyon o sensitibong data, ang iyong mga karapatan sa ilalim ng RA 10173 at ng National Privacy Commission (NPC) ay lubusang pinangangalagaan sa pamamagitan ng hindi pangongolekta ng data."}
              </p>
            </section>

            {/* 4. Third-Party Links */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-800 text-xs flex items-center justify-center font-bold">
                  4
                </span>
                {isEn ? "External Government Portals" : "Mga Link sa Website ng Gobyerno"}
              </h2>
              <p>
                {isEn
                  ? "Our application provides informational links to official portals such as the Bureau of Internal Revenue (bir.gov.ph), Maya, GCash, LandBank Link.BizPortal, SSS, and PhilHealth. Once you navigate to external domains, their respective privacy notices and terms will apply."
                  : "Nagbibigay ang aming site ng mga direktang link sa mga opisyal na website tulad ng BIR (bir.gov.ph), Maya, GCash, LandBank, SSS, at PhilHealth. Kapag binisita mo ang kanilang mga website, ang kanilang sariling patakaran sa privacy ang iiral."}
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
              <Link href="/terms" className="hover:text-zinc-900 underline">
                {isEn ? "Terms of Service" : "Tuntunin ng Paggamit"}
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
