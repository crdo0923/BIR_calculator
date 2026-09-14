"use client";

import React, { useEffect } from "react";
import { X, Star, ExternalLink, Heart, Sparkles } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface SourceCodePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  repoUrl?: string;
}

function GithubLogo({ className = "w-4 h-4" }: { className?: string }) {
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

export function SourceCodePromptModal({
  isOpen,
  onClose,
  lang,
  repoUrl = "https://github.com/crdo0923/BIR_calculator",
}: SourceCodePromptModalProps) {
  const t = translations[lang];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProceedWithStar = () => {
    window.open(repoUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleProceedDirect = () => {
    window.open(repoUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-prompt-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transform transition-all text-left"
      >
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-500" />

        {/* Modal Header & Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center transition cursor-pointer border border-zinc-200/60 dark:border-zinc-700/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-7">
          {/* Icon and Tag Badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center text-amber-500 shadow-2xs">
              <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100/70 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{t.starModalBadge}</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                {t.starModalSubtitle}
              </p>
            </div>
          </div>

          {/* Heading */}
          <h3
            id="source-prompt-title"
            className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mt-4"
          >
            {t.starModalTitle}
          </h3>

          {/* Body Content */}
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2.5">
            {t.starModalDescription}
          </p>

          {/* Repository Info Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0">
                <GithubLogo className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate font-mono">
                  crdo0923/BIR_calculator
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  {t.starModalRepoDetails}
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
                <Heart className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                MIT
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 space-y-2.5">
            {/* Primary: Star on GitHub & Proceed */}
            <button
              type="button"
              onClick={handleProceedWithStar}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <Star className="w-4 h-4 fill-white text-white" />
              <span>{t.starModalPrimaryBtn}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Secondary: Continue directly */}
            <button
              type="button"
              onClick={handleProceedDirect}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition cursor-pointer border border-zinc-200/60 dark:border-zinc-700/60"
            >
              <span>{t.starModalDirectBtn}</span>
            </button>

            {/* Tertiary: Cancel / Stay */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1.5 text-center text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium transition cursor-pointer"
            >
              {t.starModalCancelBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
