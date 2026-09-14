"use client";

import React, { useState, useEffect } from "react";
import { ComputeResult, formatPHP } from "@/lib/tax-engine";
import { Language } from "@/lib/translations";
import { X, Copy, Check, FileSpreadsheet, Printer, ShieldCheck, CreditCard, Download, FileDown, ExternalLink } from "lucide-react";

interface EBIRFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ComputeResult;
  isMixed: boolean;
  period: "annual" | "quarterly";
  lang: Language;
  onOpenPaymentGuide?: () => void;
}

export function EBIRFormsModal({
  isOpen,
  onClose,
  result,
  isMixed,
  period,
  lang,
  onOpenPaymentGuide,
}: EBIRFormsModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
  const winner = result.winner;
  const winnerIs8 = winner === "8%";
  const chosenOption = winnerIs8 ? result.eight : result.graduatedOSD;

  const formName = winnerIs8
    ? period === "annual"
      ? isMixed
        ? "BIR Form 1701 (Annual Regular)"
        : "BIR Form 1701A (Annual Simplified)"
      : "BIR Form 1701Q (Quarterly Income Tax)"
    : period === "annual"
    ? "BIR Form 1701A (OSD) / 1701 (Itemized)"
    : "BIR Form 1701Q + 2551Q";

  const atcCode = chosenOption.recommendedForms.atcCode;

  // Prepare line item fields
  const grossAmount = period === "annual" ? result.grossAnnual : result.grossQuarterly;
  const exemption250k = !isMixed && winnerIs8 ? (period === "annual" ? 250000 : 62500) : 0;
  const taxableBase = Math.max(0, grossAmount - exemption250k);
  const taxDue = period === "annual" ? chosenOption.taxAnnual : chosenOption.taxQuarter;
  const cwtAmount = period === "annual" ? result.cwtAnnual : result.cwtQuarterly;
  const netPayable = Math.max(0, taxDue - cwtAmount);

  const lines = [
    {
      num: "ATC",
      label: isEn ? "Alphanumeric Tax Code" : "Alphanumeric Tax Code",
      value: atcCode,
      note: winnerIs8
        ? (isEn ? "Individual Earning from Business/Profession (8%)" : "Indibidwal na Kumikita sa Negosyo/Propesyon (8%)")
        : (isEn ? "Graduated Tax Rate" : "Graduated Tax Rate"),
    },
    {
      num: "Item 15",
      label: isEn ? "Gross Sales / Receipts / Revenues" : "Kabuuang Benta / Resibo / Revenues",
      value: formatPHP(grossAmount),
      raw: grossAmount,
      note: isEn
        ? "Total business, profession, or freelance income collected for the period"
        : "Kabuuang kita sa negosyo, propesyon, o freelance na nakolekta",
    },
    {
      num: "Item 16",
      label: isEn ? "Less: Allowable Reduction / Exemption" : "Bawas: Pinapayagang Bawas / Exemption",
      value: formatPHP(exemption250k),
      raw: exemption250k,
      note: winnerIs8 && !isMixed
        ? (isEn ? "₱250,000 exemption under TRAIN Law" : "₱250,000 exemption sa ilalim ng TRAIN Law")
        : "₱0",
    },
    {
      num: "Item 17",
      label: isEn ? "Taxable Income" : "Taxable Income",
      value: formatPHP(taxableBase),
      raw: taxableBase,
      note: isEn ? "Net base subject to applicable tax rate" : "Netong halaga na papatawan ng buwis",
    },
    {
      num: "Item 18",
      label: isEn ? "Applicable Tax Rate" : "Applicable Tax Rate",
      value: winnerIs8 ? "8%" : "Graduated 0% – 35%",
      note: isEn ? "Chosen tax regime" : "Napiling paraan ng buwis",
    },
    {
      num: "Item 19",
      label: isEn ? "Total Tax Due" : "Kabuuang Buwis (Tax Due)",
      value: formatPHP(taxDue),
      raw: taxDue,
      note: isEn ? "Calculated tax liability before withholding credits" : "Kinalkulang buwis bago ibawas ang 2307",
    },
    {
      num: "Item 20",
      label: isEn ? "Less: Creditable Tax Withheld (Form 2307)" : "Bawas: Tax Withheld ng Kliyente (Form 2307)",
      value: formatPHP(cwtAmount),
      raw: cwtAmount,
      note: isEn ? "Taxes already remitted by your clients with Form 2307" : "Buwis na ibinawas at ibinayad na ng kliyente",
    },
    {
      num: "Item 21",
      label: isEn ? "NET TAX PAYABLE / (OVERPAYMENT)" : "NETONG BABAYARAN SA BIR",
      value: formatPHP(netPayable),
      raw: netPayable,
      note:
        cwtAmount > taxDue
          ? isEn
            ? `Overpayment of ${formatPHP(cwtAmount - taxDue)} (Creditable to next quarter or refundable via Form 1914)`
            : `Sobra ang naibawas ng ${formatPHP(cwtAmount - taxDue)} (Creditable sa susunod na quarter o pwedeng i-refund)`
          : isEn
          ? "Amount to pay via Maya, GCash, Landbank, or Authorized Bank"
          : "Halagang babayaran via Maya, GCash, Landbank, o Bangko",
      highlight: true,
    },
  ];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const pdfFormUrl = formName.includes("1701A")
    ? "/forms/BIR-Form-1701A.pdf"
    : formName.includes("1701Q")
    ? "/forms/BIR-Form-1701Q.pdf"
    : "/forms/BIR-Form-1701.pdf";

  const handleDownloadWorksheet = () => {
    const linesToPrint = [
      "============================================================",
      "             BIR CO-PILOT — eBIRForms Filing Sheet          ",
      "============================================================",
      `Tax Form:       ${formName}`,
      `Period:         ${period === "annual" ? "Annual Return" : "Quarterly Return"}`,
      `Tax Regime:     ${winnerIs8 ? "8% Flat Rate (Gross Income Tax)" : "Graduated Income Tax"}`,
      `Date Generated: ${new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}`,
      "------------------------------------------------------------",
      "LINE-BY-LINE VALUES TO COPY INTO eBIRForms:",
      "------------------------------------------------------------",
      `ATC Code:       ${atcCode} (${winnerIs8 ? "Individual 8%" : "Graduated"})`,
      `Item 15:        ${formatPHP(grossAmount)} (Gross Sales / Receipts)`,
      `Item 16:        ${formatPHP(exemption250k)} (Allowable Exemption / ₱250k deduction)`,
      `Item 17:        ${formatPHP(taxableBase)} (Taxable Income)`,
      `Item 18:        ${winnerIs8 ? "8%" : "Graduated Rates (0%-35%)"} (Applicable Rate)`,
      `Item 19:        ${formatPHP(taxDue)} (Total Tax Due)`,
      `Item 20:        ${formatPHP(cwtAmount)} (Less: Form 2307 Withholding Credits)`,
      `Item 21:        ${formatPHP(netPayable)} (NET TAX PAYABLE TO BIR)`,
      "------------------------------------------------------------",
      "OFFICIAL DOWNLOAD LINKS:",
      "Offline eBIRForms v7.9.4.2 & Tax Forms Package (.zip):",
      "/forms/Offline-eBIRForms-Package-v7.9.4.2.zip",
      "",
      `Official Blank PDF Form (${formName}):`,
      pdfFormUrl,
      "Official BIR Portal: https://www.bir.gov.ph/ebirforms",
      "============================================================",
      "Disclaimer: For educational calculation and filing reference only.",
    ].join("\n");

    const blob = new Blob([linesToPrint], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eBIRForms_${winnerIs8 ? "8Percent" : "Graduated"}_${period}_Values.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ebir-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="bg-white border border-zinc-200/90 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 id="ebir-modal-title" className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                {isEn ? "eBIRForms Line-by-Line Cheat Sheet" : "eBIRForms Line-by-Line Cheat Sheet"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>{isEn ? "Target form:" : "Kaukulang form:"}</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  {formName}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-5 sm:px-6 py-4 overflow-y-auto space-y-4">
          {/* Instructions Box */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-emerald-900 text-xs sm:text-sm">
                {isEn ? "How to use this in eBIRForms App:" : "Paano gamitin sa eBIRForms app:"}
              </div>
              <p className="text-emerald-800 leading-relaxed">
                {isEn ? (
                  <>
                    Open <strong>eBIRForms Package v7.9.4.2</strong> on your computer. Select{" "}
                    <strong>{formName.split(" ")[0] + " " + formName.split(" ")[1] + " " + formName.split(" ")[2]}</strong>
                    , then click the copy icons below to paste each exact amount into the matching Part II or Part IV boxes.
                  </>
                ) : (
                  <>
                    Buksan ang <strong>eBIRForms Package v7.9.4.2</strong> sa computer. Piliin ang{" "}
                    <strong>{formName.split(" ")[0] + " " + formName.split(" ")[1] + " " + formName.split(" ")[2]}</strong>
                    , at pindutin ang copy icon sa ibaba para ilagay ang bawat halaga sa Part II o Part IV.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-zinc-200/90 rounded-2xl overflow-hidden divide-y divide-zinc-100 shadow-2xs bg-white">
            {lines.map((item) => (
              <div
                key={item.num}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition ${
                  item.highlight ? "bg-emerald-50/70 border-l-4 border-l-emerald-600" : "hover:bg-zinc-50/80"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-md ${
                        item.highlight
                          ? "bg-emerald-200/70 text-emerald-900"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200/50"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span className="font-bold text-zinc-900 text-xs sm:text-sm truncate">{item.label}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1 pl-1">{item.note}</div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`font-mono text-sm sm:text-base tabular-nums font-bold ${
                      item.highlight ? "text-emerald-700 text-base sm:text-lg font-black" : "text-zinc-900"
                    }`}
                  >
                    {item.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.num, String(item.raw ?? item.value))}
                    className={`p-2 rounded-xl border transition cursor-pointer active:scale-95 flex items-center justify-center ${
                      copiedKey === item.num
                        ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                        : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-600 shadow-2xs"
                    }`}
                    title={isEn ? "Copy value" : "Kopyahin ang halaga"}
                  >
                    {copiedKey === item.num ? (
                      <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in duration-150" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Downloads Card */}
          <div className="p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900 text-xs">
                {isEn ? "Direct Downloads for this Filing:" : "Diretsong Download para sa Filing na ito:"}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Local Fast Offline Assets</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="/forms/Offline-eBIRForms-Package-v7.9.4.2.zip"
                download="Offline-eBIRForms-Package-v7.9.4.2.zip"
                className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl text-xs font-semibold border border-zinc-200 shadow-2xs transition cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition">
                  <Download className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">eBIRForms Package</div>
                  <div className="text-[10px] text-zinc-500">v7.9.4.2 (.zip)</div>
                </div>
              </a>

              <a
                href={pdfFormUrl}
                download={pdfFormUrl.split("/").pop()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl text-xs font-semibold border border-zinc-200 shadow-2xs transition cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/60 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition">
                  <FileDown className="w-4 h-4 text-sky-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{formName}</div>
                  <div className="text-[10px] text-zinc-500">Official BIR Form (PDF)</div>
                </div>
              </a>
            </div>

            {/* Official BIR Online Portal Link */}
            <div className="pt-2 border-t border-zinc-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-zinc-500">
              <span>
                {isEn
                  ? "Prefer downloading directly from the government?"
                  : "Gusto sa opisyal na website ng gobyerno kumuha?"}
              </span>
              <a
                href="https://www.bir.gov.ph/ebirforms"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
              >
                <span>bir.gov.ph/ebirforms</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Additional Guidance & Online Payment CTA */}
          <div className="text-xs text-zinc-600 space-y-2.5 bg-zinc-50/80 p-4 rounded-2xl border border-zinc-200/70">
            <div className="flex items-center justify-between">
              <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? "Ready to Pay?" : "Handa nang Magbayad?"}</span>
              </div>
              {onOpenPaymentGuide && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPaymentGuide();
                  }}
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 text-xs hover:underline cursor-pointer"
                >
                  <span>{isEn ? "Open Payment Steps" : "Tingnan ang Paraan ng Pagbayad"}</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              {isEn
                ? "Pay online via Maya, GCash, Landbank Link.BizPortal, or over-the-counter at ANY Authorized Agent Bank (AAB) or RDO nationwide under the EOPT Act."
                : "Maaaring magbayad online via Maya, GCash, Landbank Link.BizPortal, o sa kahit saang Authorized Agent Bank (AAB) o RDO sa buong Pilipinas."}
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-zinc-100 bg-zinc-50/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadWorksheet}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-900 bg-white hover:bg-zinc-100 active:scale-95 border border-zinc-300 transition cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-zinc-700" />
              <span>{isEn ? "Save Sheet (.txt)" : "I-save ang Sheet (.txt)"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-100 active:scale-95 border border-zinc-200 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isEn ? "Print Slip" : "I-print ang Slip"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-zinc-900 hover:bg-black active:scale-95 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            {isEn ? "Done" : "Tapos Na"}
          </button>
        </div>
      </div>
    </div>
  );
}
