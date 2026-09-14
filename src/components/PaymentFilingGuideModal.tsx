"use client";

import React, { useState, useEffect } from "react";
import { Language } from "@/lib/translations";
import {
  X,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  Check,
  Copy,
  ExternalLink,
  Info,
} from "lucide-react";

interface PaymentFilingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenEBIRGuide?: () => void;
  taxPayableAmount?: number;
}

export function PaymentFilingGuideModal({
  isOpen,
  onClose,
  lang,
  onOpenEBIRGuide,
  taxPayableAmount,
}: PaymentFilingGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"online" | "banks" | "sequence" | "eopt">("online");
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleLaunchApp = (app: "gcash" | "maya") => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (app === "maya") {
      if (isAndroid) {
        window.location.href =
          "intent://#Intent;scheme=paymaya;package=com.paymaya;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.paymaya;end";
      } else if (isIOS) {
        window.location.href = "paymaya://";
        setTimeout(() => {
          window.open("https://apps.apple.com/ph/app/maya-credit-savings-wallet/id991054914", "_blank");
        }, 1500);
      } else {
        window.open("https://www.maya.ph", "_blank", "noopener,noreferrer");
      }
    } else if (app === "gcash") {
      if (isAndroid) {
        window.location.href =
          "intent://#Intent;scheme=gcash;package=com.globe.gcash.android;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.globe.gcash.android;end";
      } else if (isIOS) {
        window.location.href = "gcash://";
        setTimeout(() => {
          window.open("https://apps.apple.com/ph/app/gcash/id520449572", "_blank");
        }, 1500);
      } else {
        window.open("https://www.gcash.com", "_blank", "noopener,noreferrer");
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEn = lang === "en";

  const aabBanks = [
    { name: "BDO Unibank", code: "BDO" },
    { name: "Bank of the Philippine Islands", code: "BPI" },
    { name: "Metrobank", code: "MBTC" },
    { name: "LandBank of the Philippines", code: "LBP" },
    { name: "Development Bank of the Philippines", code: "DBP" },
    { name: "Rizal Commercial Banking Corp.", code: "RCBC" },
    { name: "UnionBank of the Philippines", code: "UBP" },
    { name: "Security Bank Corporation", code: "SBC" },
    { name: "Philippine National Bank", code: "PNB" },
    { name: "China Banking Corporation", code: "CBC" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-guide-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 id="payment-guide-title" className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {isEn ? "Where & How to Pay BIR Taxes" : "Saan at Paano Magbayad ng Buwis"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {isEn
                  ? "Official e-wallets, online bank portals & OTC filing steps"
                  : "Opisyal na online e-wallets, bangko, at simpleng hakbang sa pagbayad"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation: 2x2 grid on mobile, 4 pills on desktop (Zero scrollbar, 100% responsive) */}
        <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950/70 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("online")}
            className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
              activeTab === "online"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{isEn ? "Maya & GCash" : "Maya at GCash"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("banks")}
            className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
              activeTab === "banks"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
            }`}
          >
            <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">{isEn ? "Banks & OTC" : "Mga Bangko"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sequence")}
            className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
              activeTab === "sequence"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="truncate">{isEn ? "Filing Order" : "Tamang Hakbang"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("eopt")}
            className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
              activeTab === "eopt"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">{isEn ? "EOPT Relief" : "Ginhawa sa EOPT"}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="px-5 sm:px-6 py-4 overflow-y-auto space-y-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          {/* TAB 1: ONLINE PAYMENT CHANNELS */}
          {activeTab === "online" && (
            <div className="space-y-3.5">
              {/* Calculated Tax Amount & 1-Click Copy */}
              {taxPayableAmount !== undefined && taxPayableAmount > 0 && (
                <div className="p-3.5 bg-zinc-900 dark:bg-zinc-950 text-white rounded-2xl flex items-center justify-between gap-3 shadow-xs border border-zinc-800">
                  <div>
                    <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                      {isEn ? "Calculated Net Tax Payable (Item 21)" : "Eksaktong Babayaran sa BIR (Item 21)"}
                    </div>
                    <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
                      ₱{taxPayableAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(taxPayableAmount.toFixed(2));
                      setCopiedAmount(true);
                      setTimeout(() => setCopiedAmount(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition cursor-pointer active:scale-95 shrink-0"
                  >
                    {copiedAmount ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-zinc-950" />
                        <span>{isEn ? "Copied!" : "Nakopya!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-950" />
                        <span>{isEn ? "Copy Amount" : "Kopyahin"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* BSP Security & App Launcher Note */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mt-0.5 shrink-0" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {isEn ? "How app opening works: " : "Paano gumagana ang app: "}
                  </span>
                  {isEn
                    ? "Due to strict Bangko Sentral (BSP) financial privacy rules, e-wallets require MPIN or Biometrics login before payment. Tap 'Open App' below to launch Maya or GCash on your device, log in, then head to Bills ➔ Government ➔ BIR!"
                    : "Dahil sa mahigpit na safety rules ng BSP, kailangan muna mag-login gamit ang MPIN o Face/Fingerprint. Pindutin ang 'Buksan ang App' sa ibaba para lumitaw ang Maya o GCash sa cellphone mo, mag-login, at piliin ang BIR sa Bills ➔ Government!"}
                </div>
              </div>

              {/* Golden Rule */}
              <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl text-emerald-950 dark:text-emerald-200 text-xs flex items-start gap-2.5 shadow-2xs">
                <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-900 dark:text-emerald-300">
                    {isEn ? "Golden Rule: Always File First Before Paying" : "Gintong Patakaran: Mag-file muna bago magbayad"}
                  </div>
                  <p className="text-emerald-800 dark:text-emerald-300/90 text-[11px] leading-relaxed">
                    {isEn
                      ? "Submit your return in eBIRForms first and wait for the confirmation email. Then pay the exact Net Tax Payable amount using the channels below."
                      : "I-submit muna ang iyong return sa eBIRForms at hintayin ang confirmation email. Pagkatapos ay bayaran ang eksaktong Net Tax Payable gamit ang mga paraan sa ibaba."}
                  </p>
                </div>
              </div>

              {/* Maya App */}
              <div className="p-4 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl space-y-3 bg-white dark:bg-zinc-900/90 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                      M
                    </span>
                    <span>Maya App (Recommended)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {isEn ? "Fastest & Lowest Fees" : "Pinakamabilis & Mababa ang Fee"}
                  </span>
                </div>
                <ol className="list-decimal pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400 text-[11px]">
                  <li>
                    {isEn
                      ? "Open Maya ➔ Tap 'Bills' ➔ Tap 'Government' ➔ Select 'Bureau of Internal Revenue (BIR)'."
                      : "Buksan ang Maya ➔ Pindutin ang 'Bills' ➔ 'Government' ➔ Piliin ang 'Bureau of Internal Revenue (BIR)'."}
                  </li>
                  <li>
                    {isEn ? (
                      <>
                        Under <strong>Form Series</strong>, select <strong>1700</strong> (for 1701A annual or 1701Q quarterly income tax) or <strong>2500</strong> (for 2551Q percentage tax).
                      </>
                    ) : (
                      <>
                        Sa <strong>Form Series</strong>, piliin ang <strong>1700</strong> (para sa 1701A o 1701Q income tax) o <strong>2500</strong> (para sa 2551Q percentage tax).
                      </>
                    )}
                  </li>
                  <li>
                    {isEn
                      ? "Enter your 9-digit TIN, 3-digit Branch Code (default '000'), RDO Code, and Return Period."
                      : "I-type ang iyong 9-digit TIN, Branch Code ('000'), RDO Code, at Return Period."}
                  </li>
                  <li>
                    {isEn
                      ? "Input the exact Net Tax Payable amount and confirm payment. Always save/screenshot the electronic receipt."
                      : "Ilagay ang eksaktong halaga ng Net Tax Payable at kumpirmahin. I-save o i-screenshot ang resibo."}
                  </li>
                </ol>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => handleLaunchApp("maya")}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isEn ? "🚀 Open Maya App" : "🚀 Buksan ang Maya App"}</span>
                  </button>
                  <a
                    href="https://www.maya.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold px-2 py-1"
                  >
                    <span>maya.ph</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* GCash App */}
              <div className="p-4 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl space-y-3 bg-white dark:bg-zinc-900/90 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <span className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                      G
                    </span>
                    <span>GCash App</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {isEn ? "Pay Bills Government" : "Pay Bills Government"}
                  </span>
                </div>
                <ol className="list-decimal pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400 text-[11px]">
                  <li>
                    {isEn
                      ? "Open GCash ➔ Tap 'Bills' ➔ Tap 'Government' ➔ Select 'BIR'."
                      : "Buksan ang GCash ➔ Pindutin ang 'Bills' ➔ 'Government' ➔ Piliin ang 'BIR'."}
                  </li>
                  <li>
                    {isEn
                      ? "Select Form Series (1700 or 2500) and choose the matching Form Code."
                      : "Piliin ang Form Series (1700 o 2500) at piliin ang tugmang Form Code."}
                  </li>
                  <li>
                    {isEn
                      ? "Enter your 9-digit TIN, RDO Code, Return Period, amount, and your email address."
                      : "Ilagay ang TIN, RDO, Return Period, halaga, at email kung saan ipapadala ang resibo."}
                  </li>
                  <li>
                    {isEn
                      ? "Review the confirmation screen and download the transaction receipt."
                      : "Suriin ang confirmation at i-download ang electronic receipt."}
                  </li>
                </ol>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => handleLaunchApp("gcash")}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs transition cursor-pointer shadow-2xs"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isEn ? "🚀 Open GCash App" : "🚀 Buksan ang GCash App"}</span>
                  </button>
                  <a
                    href="https://www.gcash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold px-2 py-1"
                  >
                    <span>gcash.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* LandBank & DBP Card Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                      <span className="w-5 h-5 rounded-md bg-emerald-800 text-white flex items-center justify-center text-[10px] font-black">
                        L
                      </span>
                      <span>LandBank Link.BizPortal</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed mt-1.5">
                      {isEn
                        ? "Supports BancNet ATM cards, LandBank accounts, and e-wallets. Visit lbp-eservices.com and select Bureau of Internal Revenue."
                        : "Pwede ang BancNet ATM cards, LandBank, at e-wallets. Pumunta sa lbp-eservices.com at piliin ang BIR."}
                    </p>
                  </div>
                  <a
                    href="https://www.lbp-eservices.com/egps/portal/index.jsp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 pt-1"
                  >
                    <span>{isEn ? "Open Link.BizPortal" : "Buksan ang Link.BizPortal"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                      <CreditCard className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>DBP PayTax (Cards)</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed mt-1.5">
                      {isEn
                        ? "Pay using Visa, Mastercard, or JCB debit and credit cards directly on the official DBP PayTax portal."
                        : "Maaaring magbayad gamit ang Visa, Mastercard, o JCB debit o credit card sa DBP PayTax online."}
                    </p>
                  </div>
                  <a
                    href="https://www.paytax.dbp.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 pt-1"
                  >
                    <span>{isEn ? "Open DBP PayTax" : "Buksan ang DBP PayTax"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BANKS & OVER-THE-COUNTER */}
          {activeTab === "banks" && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl text-indigo-950 dark:text-indigo-200 text-xs flex items-start gap-2.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-indigo-700 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300">
                    {isEn ? "EOPT Act Guarantee: Pay at ANY Bank Nationwide" : "Garantiya ng EOPT: Magbayad sa KAHIT SAANG Bangko"}
                  </div>
                  <p className="text-indigo-900 dark:text-indigo-300/90 text-[11px] leading-relaxed">
                    {isEn
                      ? "Under Republic Act No. 11976, you are legally permitted to pay taxes at ANY Authorized Agent Bank (AAB) in the Philippines. The 25% 'wrong-venue' penalty has been abolished!"
                      : "Sa ilalim ng Batas Republika 11976, legal kang makakapagbayad sa kahit saang Authorized Agent Bank sa Pilipinas nang WALANG 25% wrong-venue penalty!"}
                  </p>
                </div>
              </div>

              {/* Banks Grid */}
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    {isEn ? "Major Authorized Agent Banks (AABs):" : "Mga Pangunahing Authorized Agent Banks (AABs):"}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Over-the-Counter or Online</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-[11px]">
                  {aabBanks.map((bank) => (
                    <div
                      key={bank.code}
                      className="p-2.5 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-xl border border-zinc-200/70 dark:border-zinc-800 flex items-center justify-between hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 transition"
                    >
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate pr-2">{bank.name}</span>
                      <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500 shrink-0">
                        {bank.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RDO Cashier */}
              <div className="p-4 bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl space-y-1.5">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs flex items-center gap-2">
                  <Building className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>{isEn ? "BIR Revenue District Office (RDO) Cashier" : "Kahera ng BIR Revenue District Office (RDO)"}</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {isEn
                    ? "Cash tax payments up to ₱20,000 can also be remitted directly over-the-counter to the Revenue Collection Officer (RCO) / Cashier at any BIR RDO nationwide."
                    : "Ang bayad na cash hanggang ₱20,000 ay pwedeng direktang bayaran sa Kahera o Revenue Collection Officer (RCO) sa kahit saang RDO sa bansa."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: FILING & PAYMENT SEQUENCE (FRIENDLY 3-STEP TIMELINE) */}
          {activeTab === "sequence" && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 rounded-2xl text-sky-950 dark:text-sky-200 text-xs flex items-start gap-2.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-sky-700 dark:text-sky-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-bold text-sky-900 dark:text-sky-300">
                    {isEn ? "Which comes first: Filing or Paying?" : "Alin ang uunahin: Mag-file o Magbayad?"}
                  </div>
                  <p className="text-sky-800 dark:text-sky-300/90 text-[11px] leading-relaxed">
                    {isEn
                      ? "Follow this simple 3-step timeline to complete your quarterly and annual tax compliance cleanly without penalties:"
                      : "Sundin ang 3 simpleng hakbang na ito para makapagbayad nang tama at walang multa:"}
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl space-y-2 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                    {isEn ? "Submit your Return in eBIRForms First" : "I-submit muna ang Return sa eBIRForms"}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 pl-8 leading-relaxed">
                  {isEn
                    ? "Open eBIRForms on your computer, fill in your information, click Validate, and click Submit / Final Copy. You will receive an official Tax Return Receipt Confirmation (TRRC) email from ebirforms-noreply@bir.gov.ph."
                    : "Buksan ang eBIRForms, ilagay ang iyong mga detalye gamit ang aming cheat sheet, pindutin ang Validate, at i-click ang Submit / Final Copy. Makakatanggap ka ng opisyal na confirmation email (TRRC) mula sa BIR."}
                </p>
                <div className="pl-8 pt-1 flex flex-wrap items-center gap-2">
                  {onOpenEBIRGuide && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEBIRGuide();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 text-zinc-900 dark:text-zinc-100 rounded-xl text-xs font-bold transition cursor-pointer border border-zinc-200 dark:border-zinc-700"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{isEn ? "Open eBIRForms Cheat Sheet" : "Buksan ang eBIRForms Cheat Sheet"}</span>
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                  )}
                  <a
                    href="https://www.bir.gov.ph/ebirforms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-95 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold transition border border-zinc-200 dark:border-zinc-700"
                  >
                    <span>bir.gov.ph/ebirforms</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl space-y-2 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                    {isEn ? "Pay the Exact Net Tax Payable Amount" : "Bayaran ang eksaktong Net Tax Payable"}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 pl-8 leading-relaxed">
                  {isEn
                    ? "Open Maya, GCash, or your bank. Enter the exact Net Tax Payable amount (Item 21) from your filed return on or before the deadline. Note: If your Net Tax Payable is ₱0, payment is not required, but filing on time is STILL mandatory!"
                    : "Magbayad sa Maya, GCash, o bangko gamit ang eksaktong Net Tax Payable (Item 21) bago ang deadline. Tandaan: Kung ₱0 ang iyong buwis, hindi kailangang magbayad, pero KAILANGAN pa rin mag-file sa tamang oras!"}
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl space-y-2 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </span>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                    {isEn ? "Keep Both Proofs (TRRC Email + Payment Receipt)" : "Itago ang Katunayan (TRRC Email + Resibo)"}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 pl-8 leading-relaxed">
                  {isEn
                    ? "Keep your BIR confirmation email (proof of timely filing) together with your Maya/GCash/bank receipt (proof of timely payment). Congratulations, you are 100% compliant without needing any manual office stamp!"
                    : "Itabi ang email ng BIR (patunay ng tamang filing) kasama ang resibo ng Maya/GCash/bangko (patunay ng bayad). Kumpleto ka na! Hindi mo na kailangan pumunta sa BIR para magpa-stamp."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: EOPT ACT RELIEF */}
          {activeTab === "eopt" && (
            <div className="space-y-3.5">
              <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl space-y-1.5 text-amber-950 dark:text-amber-200 shadow-2xs">
                <div className="font-bold text-xs sm:text-sm flex items-center gap-2 text-amber-900 dark:text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>{isEn ? "Republic Act No. 11976 (Ease of Paying Taxes Act)" : "Batas Republika Blg. 11976 (EOPT Act)"}</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  {isEn
                    ? "Enacted in 2024, the EOPT Act removed punitive penalties and archaic procedures to make tax compliance modern and accessible for all Filipinos:"
                    : "Ipinatupad noong 2024, tinanggal ng EOPT Act ang mga lumang parusa upang gawing mabilis at maginhawa ang pagbabayad ng buwis:"}
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="text-zinc-900 dark:text-zinc-100 text-xs">{isEn ? "File & Pay Anywhere Nationwide:" : "Mag-file at Magbayad Kahit Saan:"}</strong>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {isEn
                        ? "You can file returns and pay taxes electronically or manually at ANY Authorized Agent Bank or RDO nationwide. The dreaded 25% 'wrong-venue' surcharge is permanently abolished!"
                        : "Pwede ka nang mag-file at magbayad sa kahit saang bangko o RDO sa buong Pilipinas. Tinanggal na nang tuluyan ang 25% wrong-venue surcharge penalty!"}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="text-zinc-900 dark:text-zinc-100 text-xs">{isEn ? "₱500 Annual Registration Fee Abolished:" : "Wala nang ₱500 Annual Registration Fee:"}</strong>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {isEn
                        ? "BIR Form 0605 annual registration fee (₱500) has been abolished since January 2024. You no longer have to pay ₱500 every January to maintain your business or professional registration."
                        : "Abolished na ang ₱500 registration fee gamit ang Form 0605 tuwing Enero. Hindi mo na kailangang magbayad nito taon-taon."}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="text-zinc-900 dark:text-zinc-100 text-xs">{isEn ? "Micro Taxpayer Classification:" : "Klasipikasyon bilang Micro Taxpayer:"}</strong>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {isEn
                        ? "Freelancers and self-employed individuals earning less than ₱3,000,000 annually are classified as Micro Taxpayers, qualifying for simplified books of accounts and reduced civil penalties."
                        : "Ang mga kumikita ng mas mababa sa ₱3M taon-taon ay Micro Taxpayers na may mas simpleng bookkeeping at mas mababang multa."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-md flex items-center justify-end sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white active:scale-95 text-white dark:text-zinc-900 text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            {isEn ? "Close Guide" : "Isara ang Gabay"}
          </button>
        </div>
      </div>
    </div>
  );
}
