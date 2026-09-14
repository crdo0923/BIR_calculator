"use client";

import React, { useEffect } from "react";
import { X, Star, ExternalLink } from "lucide-react";
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

  const handleProceed = () => {
    window.open(repoUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-prompt-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 text-center transform transition-all"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Star Icon */}
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/70 flex items-center justify-center text-amber-500 shadow-2xs mb-3.5">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
        </div>

        {/* Title */}
        <h3
          id="source-prompt-title"
          className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
        >
          {t.starModalTitle}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2">
          {t.starModalDescription}
        </p>

        {/* Simple Buttons */}
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition cursor-pointer"
          >
            {t.starModalCancelBtn}
          </button>
          <button
            type="button"
            onClick={handleProceed}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <GithubLogo className="w-3.5 h-3.5" />
            <span>{t.starModalPrimaryBtn}</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
}
