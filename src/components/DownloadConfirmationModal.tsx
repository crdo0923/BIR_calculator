"use client";

import React, { useEffect, useState } from "react";
import { X, Download, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { Language } from "@/lib/translations";

interface DownloadConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  summaryType?: string;
  lang: Language;
}

export function DownloadConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  summaryType,
  lang,
}: DownloadConfirmationModalProps) {
  const isEn = lang === "en";
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDownloaded(false);
      return;
    }

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

  const handleDownload = () => {
    onConfirm();
    setDownloaded(true);
    setTimeout(() => {
      onClose();
      setDownloaded(false);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
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

        {/* Header Icon */}
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/70 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs mb-3.5">
          {downloaded ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-in zoom-in-50" />
          ) : (
            <Download className="w-6 h-6" />
          )}
        </div>

        {/* Modal Title */}
        <h3
          id="download-modal-title"
          className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
        >
          {title || (isEn ? "Download Tax Summary" : "I-download ang Buod ng Buwis")}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2">
          {isEn
            ? "Save a clean, offline-ready text file (.txt) of your tax calculation for your records."
            : "I-save ang malinis at madaling basahing text file (.txt) ng iyong tax calculation para sa iyong talaan."}
        </p>

        {/* File Detail Pill */}
        <div className="mt-3.5 py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{summaryType || (isEn ? "Tax Computation Summary" : "Buod ng Buwis")}</span>
          </div>
          <span className="shrink-0 font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
            .TXT
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={downloaded}
            className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition cursor-pointer disabled:opacity-50"
          >
            {isEn ? "Cancel" : "Kanselahin"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloaded}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-80"
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEn ? "Downloaded!" : "Na-download na!"}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isEn ? "Download (.txt)" : "I-download (.txt)"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
