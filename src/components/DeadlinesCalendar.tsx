"use client";

import React, { useState } from "react";
import { DEADLINES_2026 } from "@/lib/tax-engine";
import { Language, translations } from "@/lib/translations";
import { Calendar, Clock, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface DeadlinesCalendarProps {
  is8Percent: boolean;
  lang: Language;
}

export function DeadlinesCalendar({ is8Percent, lang }: DeadlinesCalendarProps) {
  const t = translations[lang];
  const [filterMode, setFilterMode] = useState<"all" | "my-forms">("my-forms");
  const [showAll, setShowAll] = useState(false);

  // Current date reference
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  function getDaysLeft(dueStr: string) {
    const d = new Date(dueStr + " 00:00:00").getTime();
    return Math.ceil((d - today) / 86400000);
  }

  // Combine deadlines
  const allDeadlines = [
    ...DEADLINES_2026.iq.map((d) => ({
      ...d,
      type: "income" as const,
      applicableTo8: true,
      badge: lang === "en" ? "Income Tax" : "Income Tax",
    })),
    ...DEADLINES_2026.pq.map((d) => ({
      ...d,
      type: "percentage" as const,
      applicableTo8: false,
      badge: lang === "en" ? "Percentage Tax (3%)" : "Percentage Tax (3%)",
    })),
  ].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  // Filter based on user selection
  const displayedDeadlines = filterMode === "my-forms" && is8Percent
    ? allDeadlines.filter((d) => d.applicableTo8)
    : allDeadlines;

  // Find next upcoming deadline
  const nextDeadline = displayedDeadlines.find((d) => getDaysLeft(d.due) >= 0) || displayedDeadlines[0];
  const nextDays = nextDeadline ? getDaysLeft(nextDeadline.due) : null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200/50 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">{t.deadlinesHeaderTitle}</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{t.deadlinesHeaderSub}</p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterMode("my-forms")}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              filterMode === "my-forms"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {is8Percent ? t.filter8Only : (lang === "en" ? "My Requirements" : "Aking mga Form")}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              filterMode === "all"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.filterAll}
          </button>
        </div>
      </div>

      {/* Next Upcoming Highlight */}
      {nextDeadline && (
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-950 dark:to-zinc-900 border border-zinc-800 dark:border-zinc-750 text-white rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] uppercase font-bold text-emerald-400 tracking-wider">
                {t.nextDeadlineLabel}
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                • {nextDeadline.q}
              </span>
            </div>
            <div className="text-base sm:text-lg font-extrabold mt-0.5">
              {nextDeadline.form} — {nextDeadline.due}
            </div>
            <div className="text-xs text-zinc-300 dark:text-zinc-400 mt-0.5">{nextDeadline.desc}</div>
          </div>

          <div className="text-right shrink-0">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>
                {nextDays == null
                  ? "—"
                  : nextDays < 0
                  ? (lang === "en" ? "Past" : "Nakalipas")
                  : nextDays === 0
                  ? (lang === "en" ? "Today!" : "Ngayong Araw!")
                  : `${nextDays}d left`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8% Exemption Notice */}
      {is8Percent && (
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>{t.perks8Title}</strong> {t.perks8Desc}
          </span>
        </div>
      )}

      {/* Deadlines Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {displayedDeadlines.slice(0, showAll ? displayedDeadlines.length : 4).map((d) => {
          const days = getDaysLeft(d.due);
          const isPast = days < 0;
          const isUpcoming = days >= 0 && days <= 30;

          return (
            <div
              key={d.form + d.q + d.due}
              className={`p-3 rounded-xl border transition ${
                isPast
                  ? "bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-800 opacity-60"
                  : isUpcoming
                  ? "bg-amber-50/40 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/60"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{d.form}</span>
                <span
                  className={`text-xs font-bold ${
                    isPast
                      ? "text-zinc-400 dark:text-zinc-500"
                      : isUpcoming
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {isPast ? (lang === "en" ? "Past" : "Nakalipas") : days === 0 ? (lang === "en" ? "Today" : "Ngayon") : `${days}d left`}
                </span>
              </div>
              <div className="text-zinc-600 dark:text-zinc-300 font-medium mt-1">{t.dueLabel.replace("{due}", d.due)}</div>
              <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                {d.q} ({d.period}) · {d.badge}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more toggle */}
      {displayedDeadlines.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>
            {showAll
              ? t.showLessDeadlines
              : t.showMoreDeadlines.replace("{count}", String(displayedDeadlines.length))}
          </span>
          {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* EOPT Act Reminder */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal flex items-start gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
        <span>
          <strong>{t.eoptReliefTitle}</strong> {t.eoptReliefDesc}
        </span>
      </div>
    </div>
  );
}
