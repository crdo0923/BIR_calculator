"use client";

import React, { useEffect, useState } from "react";
import { Language } from "@/lib/translations";
import { Cookie, X, Check, ShieldCheck, Settings } from "lucide-react";
import Link from "next/link";

interface CookieConsentProps {
  lang: Language;
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export function CookieConsent({ lang, forceOpen, onCloseForceOpen }: CookieConsentProps) {
  const [consentStatus, setConsentStatus] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const isEn = lang === "en";

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem("bir_cookie_consent");
        if (stored) {
          setConsentStatus(stored);
          if (stored === "all") setAnalyticsAllowed(true);
        } else {
          setConsentStatus("unanswered");
        }
      } catch {
        // LocalStorage might be disabled in private browsing
        setConsentStatus("unanswered");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSave = (status: "all" | "essential") => {
    try {
      localStorage.setItem("bir_cookie_consent", status);
    } catch {
      // ignore in incognito mode
    }
    setConsentStatus(status);
    setShowPreferences(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  useEffect(() => {
    if (!showPreferences) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPreferences(false);
        if (onCloseForceOpen) onCloseForceOpen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showPreferences, onCloseForceOpen]);

  const isBannerVisible = consentStatus === "unanswered" || forceOpen;

  if (!isBannerVisible && !showPreferences) return null;

  return (
    <>
      {/* Main Floating Banner (Positioned above mobile dock with bottom-20) */}
      {isBannerVisible && !showPreferences && (
        <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0 shadow-2xs border border-zinc-200/60 dark:border-zinc-700">
              <Cookie className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>

            <div className="space-y-1.5 flex-1 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  {isEn ? "Cookie & Local Storage Notice" : "Paggamit ng Cookies at Local Storage"}
                </h4>
                {forceOpen && onCloseForceOpen && (
                  <button
                    type="button"
                    onClick={onCloseForceOpen}
                    aria-label="Close cookie notice"
                    className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center cursor-pointer transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                {isEn
                  ? "We use local browser storage to remember your language preference and maintain private, in-browser tax calculations. We never sell your personal data or store financial records on any external server."
                  : "Gumagamit kami ng local browser storage upang matandaan ang pinili mong wika at panatilihing pribado ang kalkulasyon sa iyong browser. Hindi namin ibinebenta ang iyong data o sinisave ang iyong kita sa anumang server."}
              </p>

              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                <Link href="/privacy" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">
                  {isEn ? "Privacy Policy" : "Patakaran sa Privacy"}
                </Link>
                <span>•</span>
                <Link href="/terms" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">
                  {isEn ? "Terms of Service" : "Tuntunin ng Paggamit"}
                </Link>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave("all")}
                  className="px-3.5 py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white active:scale-95 text-white dark:text-zinc-900 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  {isEn ? "Accept All" : "Tanggapin Lahat"}
                </button>

                <button
                  type="button"
                  onClick={() => handleSave("essential")}
                  className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold transition cursor-pointer border border-zinc-200 dark:border-zinc-700"
                >
                  {isEn ? "Essential Only" : "Kailangan Lamang"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                  title={isEn ? "Customize Cookie Preferences" : "I-customize ang Cookies"}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal Dialog */}
      {showPreferences && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setShowPreferences(false);
            if (onCloseForceOpen) onCloseForceOpen();
          }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

            <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-2xs border border-emerald-200/60 dark:border-emerald-800/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base tracking-tight">
                  {isEn ? "Cookie & Storage Preferences" : "Kagustuhan sa Cookies at Storage"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPreferences(false);
                  if (onCloseForceOpen) onCloseForceOpen();
                }}
                aria-label="Close preferences"
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 sm:px-6 py-4 space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400">
              {/* Essential Storage */}
              <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                    {isEn ? "1. Essential Local Storage" : "1. Mahalagang Local Storage"}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {isEn ? "Always Active" : "Palaging Aktibo"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {isEn
                    ? "Stores your chosen language (English or Tagalog) and cookie consent state in your device's browser memory. No tracking cookies are used."
                    : "Iniimbak ang napili mong wika (English o Tagalog) at katayuan ng cookies sa memorya ng iyong browser. Walang tracking cookies na ginagamit."}
                </p>
              </div>

              {/* Functional Performance */}
              <div className="p-3.5 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                    {isEn ? "2. Performance & Calculation Cache" : "2. Performance & Calculation Cache"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsAllowed}
                      onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-900 dark:peer-checked:bg-emerald-500" />
                  </label>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {isEn
                    ? "Allows temporarily retaining your custom salary inputs during your browsing session so you don't lose progress when switching tabs."
                    : "Pansamantalang iniingatan ang mga nilagay mong sweldo sa session upang hindi mawala ang iyong kwenta kapag naglipat ng tab."}
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-md flex items-center justify-end gap-2 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => handleSave(analyticsAllowed ? "all" : "essential")}
                className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-black dark:hover:bg-white active:scale-95 text-white dark:text-zinc-900 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isEn ? "Save Preferences" : "I-save ang Kagustuhan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
