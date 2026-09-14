"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Language } from "@/lib/translations";
import {
  X,
  BookOpen,
  Scale,
  ShieldCheck,
  Search,
} from "lucide-react";

interface TaxGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const GLOSSARY_TERMS_EN = [
        {
          id: "train-law",
          title: "TRAIN Law (Republic Act No. 10963)",
          badge: "Tax Reform 2018–2026",
          summary:
            "The Tax Reform for Acceleration and Inclusion (effective Jan 1, 2018, with revised brackets effective Jan 1, 2023).",
          explanation:
            "TRAIN lowered personal income taxes for 99% of Filipino taxpayers. It established the ₱250,000 annual tax exemption, created the optional 8% gross income tax for freelancers/sole proprietors earning under ₱3M, and raised the tax-exempt cap for 13th month pay and bonuses from ₱82,000 to ₱90,000.",
        },
        {
          id: "eopt-act",
          title: "EOPT Act (Republic Act No. 11976)",
          badge: "Ease of Paying Taxes 2024+",
          summary:
            "The Ease of Paying Taxes Act, signed in January 2024 to modernize tax administration in the Philippines.",
          explanation:
            "Key reforms under EOPT: 1) Permanently repealed the ₱500 Annual Registration Fee (BIR Form 0605); 2) Taxpayers can now file returns and pay taxes at ANY Authorized Agent Bank or RDO nationwide without the 25% wrong-venue penalty; 3) Classified taxpayers into Micro (< ₱3M), Small, Medium, and Large with simplified compliance.",
        },
        {
          id: "8-percent",
          title: "8% Optional Flat Income Tax",
          badge: "Sec. 24(A)(2)(b), NIRC",
          summary:
            "A special single tax rate for self-employed individuals and professionals earning ≤ ₱3,000,000 gross per year.",
          explanation:
            "Calculated as (Gross Income − ₱250,000) × 8% for pure business/freelance earners. Crucially, this replaces BOTH the graduated income tax and the 3% Percentage Tax (Form 2551Q). No expense receipts are required.",
        },
        {
          id: "graduated-rates",
          title: "Graduated Income Tax Rates",
          badge: "Sec. 24(A)(2)(a), NIRC",
          summary:
            "Progressive tax brackets ranging from 0% up to 35% based on your net taxable income.",
          explanation:
            "Under this method, tax rates increase as your net taxable income rises: 0% up to ₱250k, 15% on excess up to ₱400k, 20% on excess up to ₱800k, 25% up to ₱2M, 30% up to ₱8M, and 35% above ₱8M. Taxpayers under this regime must also pay 3% Percentage Tax (Form 2551Q).",
        },
        {
          id: "osd",
          title: "Optional Standard Deduction (OSD)",
          badge: "Sec. 34(L), NIRC",
          summary:
            "An automatic 40% deduction on gross revenue without needing any official expense receipts.",
          explanation:
            "If you select Graduated Rates, OSD automatically deducts 40% of your gross sales/receipts as business expenses. You are taxed only on the remaining 60% of gross income, sparing you from bookkeeping audits.",
        },
        {
          id: "itemized",
          title: "Itemized Deductions",
          badge: "Sec. 34(A)-(J), NIRC",
          summary:
            "Actual ordinary and necessary expenses incurred in trade or business with official BIR receipts.",
          explanation:
            "Allows deducting actual business costs (e.g. equipment, office rent, utilities, contractor fees, supplies). Every single deduction must be substantiated by official BIR-registered receipts or invoices. Only advantageous when documented expenses exceed 40%–50% of revenue.",
        },
        {
          id: "percentage-tax",
          title: "Percentage Tax (Sec. 116 / BIR Form 2551Q)",
          badge: "3% Business Tax",
          summary:
            "A quarterly tax levied on non-VAT registered businesses earning under the ₱3M threshold.",
          explanation:
            "Taxpayers choosing Graduated Rates must pay an extra 3% Percentage Tax on gross quarterly receipts using BIR Form 2551Q. Filers choosing the 8% Flat Rate are 100% exempt from this tax.",
        },
        {
          id: "form-2307",
          title: "Creditable Withholding Tax (CWT / Form 2307)",
          badge: "BIR RR 2-98 & RR 11-2018",
          summary:
            "Advance tax withheld at source by your clients before paying you.",
          explanation:
            "Corporate clients typically withhold 5% (with sworn declaration) or 10% from your gross billings and remit it directly to the BIR. They issue you Form 2307, which acts as a cash voucher that directly lowers the final tax you pay.",
        },
        {
          id: "form-2316",
          title: "BIR Form 2316 & Substituted Filing",
          badge: "Employee Certificate",
          summary:
            "Certificate of Compensation Payment and Tax Withheld issued by employers.",
          explanation:
            "Full-time employees with only one employer in a calendar year qualify for 'Substituted Filing'. The employer calculates and remits all taxes; the signed Form 2316 serves as the filed annual return. Employees do not need to visit the BIR personally.",
        },
        {
          id: "mixed-income",
          title: "Mixed Income Earner",
          badge: "BIR RR 8-2018",
          summary:
            "An individual earning both compensation (day job) and business/freelance revenue.",
          explanation:
            "Day job salary is taxed under the Graduated table. The freelance sideline can use the 8% flat rate, but WITHOUT the ₱250,000 deduction (since it was already used for salary). Mixed earners lose Substituted Filing and must file Form 1701 annually.",
        },
        {
          id: "vat-threshold",
          title: "₱3,000,000 VAT Threshold",
          badge: "Sec. 109(CC), NIRC",
          summary:
            "The statutory gross sales limit dividing non-VAT micro/small filers from mandatory VAT taxpayers.",
          explanation:
            "If your annual gross receipts exceed ₱3,000,000, you are legally barred from using the 8% flat rate. You must register as a VAT taxpayer (12% VAT) and file under Graduated income tax.",
        },
        {
          id: "sss-msc",
          title: "Monthly Salary Credit (MSC)",
          badge: "RA 11199 (SSS Law)",
          summary:
            "The maximum baseline compensation used by SSS to compute monthly pension and benefit contributions.",
          explanation:
            "For 2024–2026, the SSS contribution rate is 14% (9.5% employer, 4.5% employee). The maximum MSC is capped at ₱30,000, meaning the maximum monthly employee contribution is ₱1,350 regardless of how high your salary is.",
        },
      ];

const GLOSSARY_TERMS_TL = [
  {
    id: "train-law",
          title: "TRAIN Law (Batas Republika Blg. 10963)",
          badge: "Tax Reform 2018–2026",
          summary:
            "Ang Tax Reform for Acceleration and Inclusion (ipinatupad noong Jan 1, 2018, binagong brackets noong Jan 1, 2023).",
          explanation:
            "Ibinaba ng TRAIN Law ang buwis sa kita ng 99% ng mga Pilipino. Ginawa nitong libre sa buwis ang unang ₱250,000, lumikha ng 8% flat tax para sa freelancers/negosyante na kumikita ng mas mababa sa ₱3M, at itinaas ang libreng buwis sa 13th month pay sa ₱90,000 mula ₱82,000.",
        },
        {
          id: "eopt-act",
          title: "EOPT Act (Batas Republika Blg. 11976)",
          badge: "Ease of Paying Taxes 2024+",
          summary:
            "Ang Ease of Paying Taxes Act na nilagdaan noong Enero 2024 para gawing moderno at maginhawa ang pagbabayad ng buwis.",
          explanation:
            "Pangunahing pagbabago: 1) Tuluyan nang tinanggal ang ₱500 Annual Registration Fee (Form 0605); 2) Pwede nang mag-file at magbayad sa KAHIT SAANG bangko o RDO nationwide nang walang 25% maling-venue penalty; 3) Hinati ang taxpayers sa Micro (< ₱3M), Small, Medium, at Large para sa mas simpleng patakaran.",
        },
        {
          id: "8-percent",
          title: "8% Optional Flat Income Tax",
          badge: "Sec. 24(A)(2)(b), NIRC",
          summary:
            "Isang espesyal at simpleng opsyon sa buwis para sa self-employed at professionals na kumikita ng ≤ ₱3,000,000 bawat taon.",
          explanation:
            "Kinukwenta bilang (Kabuuang Kita − ₱250,000) × 8% para sa purong negosyo/freelance. Pinakamahalaga: pinapalitan nito pareho ang graduated income tax AT ang 3% Percentage Tax (Form 2551Q). Walang resibo ng gastos na kailangan.",
        },
        {
          id: "graduated-rates",
          title: "Graduated Income Tax Rates",
          badge: "Sec. 24(A)(2)(a), NIRC",
          summary:
            "Pabago-bagong tax brackets mula 0% hanggang 35% base sa iyong netong kita.",
          explanation:
            "Sa paraang ito, tumataas ang porsyento ng buwis habang tumataas ang kita: 0% sa unang ₱250k, 15% sa lagpas hanggang ₱400k, 20% hanggang ₱800k, 25% hanggang ₱2M, 30% hanggang ₱8M, at 35% sa lampas ₱8M. Kailangan ding magbayad ng 3% Percentage Tax (Form 2551Q).",
        },
        {
          id: "osd",
          title: "Optional Standard Deduction (OSD)",
          badge: "Sec. 34(L), NIRC",
          summary:
            "Awtomatikong 40% na bawas sa kabuuang benta nang hindi nangangailangan ng anumang opisyal na resibo.",
          explanation:
            "Kung pinili mo ang Graduated Rates, awtomatikong binabawas ng OSD ang 40% ng iyong gross revenue bilang gastos. Ang natitirang 60% na lamang ang papatawan ng buwis, kaya ligtas ka sa pag-audit ng resibo.",
        },
        {
          id: "itemized",
          title: "Itemized Deductions",
          badge: "Sec. 34(A)-(J), NIRC",
          summary:
            "Aktwal na lehitimong gastos sa negosyo na may opisyal na resibo o invoice mula sa BIR.",
          explanation:
            "Pinapayagan ang pagbawas ng tunay na gastos tulad ng gamit, renta ng opisina, kuryente, pasahod, at supplies. Bawat sentimo ay dapat may BIR official receipt o sales invoice. Sulit lamang ito kapag ang resibo mo ay lagpas sa 40%–50% ng benta.",
        },
        {
          id: "percentage-tax",
          title: "Percentage Tax (Sec. 116 / BIR Form 2551Q)",
          badge: "3% Business Tax",
          summary:
            "Quarterly na buwis para sa mga negosyong non-VAT na kumikita sa ilalim ng ₱3M ceiling.",
          explanation:
            "Ang taxpayers na pumili ng Graduated Rates ay kailangang magbayad ng karagdagang 3% Percentage Tax sa gross sales kada quarter gamit ang Form 2551Q. Ang mga pumili ng 8% Flat Rate ay 100% libre sa buwis na ito.",
        },
        {
          id: "form-2307",
          title: "Creditable Withholding Tax (CWT / Form 2307)",
          badge: "BIR RR 2-98 & RR 11-2018",
          summary:
            "Paunang buwis na kinaltas ng iyong mga kliyente bago ipadala ang bayad sa iyo.",
          explanation:
            "Karaniwang nagkakaltas ang mga kumpanya ng 5% (kung may sworn declaration) o 10% mula sa iyong invoice at diretsong binabayad sa BIR. Bibigyan ka nila ng Form 2307, na parang voucher na ibinabawas sa huli mong babayarang buwis.",
        },
        {
          id: "form-2316",
          title: "BIR Form 2316 & Substituted Filing",
          badge: "Sertipiko ng Empleyado",
          summary:
            "Katibayan ng sahod at kinaltas na buwis na ibinibigay ng employer sa katapusan ng taon.",
          explanation:
            "Ang regular na empleyado na may iisang kumpanya lamang sa taon ay pasok sa 'Substituted Filing'. Ang kumpanya na ang nagpa-file at nagbabayad ng buwis; ang pinirmahang Form 2316 na ang iyong opisyal na tax return nang hindi kailangang pumunta sa BIR.",
        },
        {
          id: "mixed-income",
          title: "Mixed Income Earner",
          badge: "BIR RR 8-2018",
          summary:
            "Indibidwal na may regular na trabaho at may sideline na freelance o negosyo.",
          explanation:
            "Ang regular na sahod ay binubuwisan sa Graduated table. Ang sideline ay pwedeng mag-8%, pero WALA NANG ₱250,000 deduction dahil nagamit na ito sa sahod. Mawawalan ng substituted filing kaya kailangan mag-file ng Form 1701 bawat taon.",
        },
        {
          id: "vat-threshold",
          title: "₱3,000,000 VAT Threshold",
          badge: "Sec. 109(CC), NIRC",
          summary:
            "Ang legal na limit sa benta na naghihiwalay sa non-VAT micro filers at mandatory VAT taxpayers.",
          explanation:
            "Kapag ang kabuuang benta sa isang taon ay lumagpas sa ₱3,000,000, bawal na ang 8% flat rate. Mandatory nang magparehistro sa VAT (12%) at gamitin ang Graduated income tax.",
        },
        {
          id: "sss-msc",
          title: "Monthly Salary Credit (MSC)",
          badge: "RA 11199 (SSS Law)",
          summary:
            "Ang basehang sahod na ginagamit ng SSS upang kwentahin ang buwanang hulog sa pensyon at benepisyo.",
          explanation:
            "Sa 2024–2026, 14% ang kabuuang hulog sa SSS (9.5% employer, 4.5% empleyado). Ang pinakamataas na MSC ay capped sa ₱30,000, kaya ang pinakamataas na kaltas sa empleyado ay ₱1,350 lamang kahit gaano pa kalaki ang iyong sahod.",
        },
      ];

  const CITATIONS_LIST = [
    {
      law: "Republic Act No. 10963",
      name: "TRAIN Law (Tax Reform for Acceleration and Inclusion)",
      agency: "Bureau of Internal Revenue (BIR) / Department of Finance",
      reference: "NIRC Sec. 24(A)(2)(b), Sec. 32(B)(7)(e)",
      keyPoints:
        "Established the 8% gross income tax for freelancers/MSMEs, ₱250k personal income exemption, and raised 13th month tax-free bonus cap to ₱90,000.",
    },
    {
      law: "Republic Act No. 11976",
      name: "EOPT Act (Ease of Paying Taxes Act of 2024)",
      agency: "Bureau of Internal Revenue (BIR)",
      reference: "BIR Revenue Regulations No. 4-2024 & 8-2024",
      keyPoints:
        "Abolished ₱500 Annual Registration Fee (Form 0605); allowed nationwide filing and payment at ANY bank or RDO with 0% wrong-venue penalty.",
    },
    {
      law: "BIR Revenue Regulations No. 8-2018",
      name: "Implementing Rules on Income Taxation under TRAIN",
      agency: "Bureau of Internal Revenue (BIR)",
      reference: "RR 8-2018 Sec. 2 & Sec. 3",
      keyPoints:
        "Defined 8% option mechanics, OSD computation rules, and the Mixed Income Earner policy (removal of ₱250k deduction for sideline freelance).",
    },
    {
      law: "BIR RR No. 2-98 as amended by RR 11-2018",
      name: "Creditable Withholding Tax Regulations (Form 2307)",
      agency: "Bureau of Internal Revenue (BIR)",
      reference: "RR 2-98 Sec. 2.57.2",
      keyPoints:
        "Mandated 5% withholding on professional fees under ₱3M (with sworn statement Annex B-2) or 10% standard withholding, creditable against income tax.",
    },
    {
      law: "Republic Act No. 11199",
      name: "Social Security Act of 2018",
      agency: "Social Security System (SSS)",
      reference: "SSS Circular No. 2024-001 / MSC Schedule",
      keyPoints:
        "Governs the 14% contribution rate (4.5% Employee share) capped at ₱30,000 Monthly Salary Credit (₱1,350 maximum monthly employee deduction).",
    },
    {
      law: "Republic Act No. 11223",
      name: "Universal Health Care Act",
      agency: "Philippine Health Insurance Corporation (PhilHealth)",
      reference: "PhilHealth Advisory No. 2024-0001",
      keyPoints:
        "Prescribes 5.0% premium rate (2.5% Employee share) on monthly basic salary with a ₱10,000 floor (₱250 min) and ₱100,000 ceiling (₱2,500 max).",
    },
    {
      law: "Republic Act No. 9679",
      name: "Home Development Mutual Fund Law of 2009 (Pag-IBIG)",
      agency: "Pag-IBIG Fund (HDMF)",
      reference: "Pag-IBIG Fund Circular No. 460",
      keyPoints:
        "Implements 2% employee contribution with maximum fund salary ceiling raised to ₱10,000 effective Feb 2024 = ₱200/month maximum employee contribution.",
    },
    {
      law: "Presidential Decree No. 851 & RA 10963",
      name: "13th Month Pay Law & TRAIN Tax Exemption",
      agency: "Department of Labor and Employment (DOLE) / BIR",
      reference: "PD 851 Sec. 1, NIRC Sec. 32(B)(7)(e)",
      keyPoints:
        "Mandates 13th month pay payable not later than Dec 24. RA 10963 permanently established the ₱90,000 statutory tax-free ceiling on 13th month pay and other Christmas/productivity benefits.",
    },
    {
      law: "BIR RMC No. 03-2023 & RR 11-2018",
      name: "Revised Withholding Tax Table on Compensation (2023–2026)",
      agency: "Bureau of Internal Revenue (BIR)",
      reference: "NIRC Sec. 24(A)(2)(a), RMC 03-2023",
      keyPoints:
        "Provides official monthly withholding brackets for employers. Lowers income tax rates by 2% to 5% across brackets. Zero withholding tax on monthly taxable salary up to ₱20,833.33.",
    },
    {
      law: "Presidential Decree No. 626",
      name: "Employees' Compensation Program (EC Fund)",
      agency: "Employees' Compensation Commission (ECC) / SSS",
      reference: "Labor Code Title II / SSS Circular 2024-001",
      keyPoints:
        "Mandatory employer-paid contingency insurance: ₱10.00/month (for MSC < ₱15,000) or ₱30.00/month (for MSC ≥ ₱15,000). Employees pay ₱0.",
    },
    {
      law: "DOLE Statutory Monetary Benefits Handbook",
      name: "Standard Daily & Hourly Rate Factors (Factor 261)",
      agency: "Department of Labor and Employment (DOLE)",
      reference: "DOLE Bureau of Working Conditions",
      keyPoints:
        "Official DOLE formula for converting monthly basic salary into daily rate: (Monthly Basic × 12) / 261 days for 5-day work week. Hourly rate = Daily Rate / 8 hours.",
    },
  ];

export function TaxGlossaryModal({ isOpen, onClose, lang }: TaxGlossaryModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "citations">("terms");
  const [searchQuery, setSearchQuery] = useState("");
  const isEn = lang === "en";

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

  const glossaryTerms = isEn ? GLOSSARY_TERMS_EN : GLOSSARY_TERMS_TL;

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return glossaryTerms;
    const q = searchQuery.toLowerCase();
    return glossaryTerms.filter(
      (term) =>
        term.title.toLowerCase().includes(q) ||
        term.badge.toLowerCase().includes(q) ||
        term.summary.toLowerCase().includes(q) ||
        term.explanation.toLowerCase().includes(q)
    );
  }, [glossaryTerms, searchQuery]);

  const filteredCitations = useMemo(() => {
    if (!searchQuery.trim()) return CITATIONS_LIST;
    const q = searchQuery.toLowerCase();
    return CITATIONS_LIST.filter(
      (item) =>
        item.law.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.agency.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q) ||
        item.keyPoints.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center shadow-xs shrink-0 border border-zinc-800 dark:border-zinc-700">
              <Scale className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 id="glossary-modal-title" className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {isEn ? "Philippine Tax Terms & Statutory Citations" : "Talahulugan ng Buwis at Mga Batas ng Pilipinas"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {isEn
                  ? "Accurate legal definitions and official government sources (2024–2026)"
                  : "Tumpak na legal na paliwanag at opisyal na batas ng gobyerno (2024–2026)"}
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

        {/* Search Bar */}
        <div className="px-5 sm:px-6 py-2.5 bg-zinc-50/90 dark:bg-zinc-950/90 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isEn
                ? "Search tax terms, acronyms, or Republic Acts..."
                : "Maghanap ng terminolohiya, acronym, o batas..."
            }
            className="w-full bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="p-2 bg-zinc-100/70 dark:bg-zinc-950/70 border-b border-zinc-100 dark:border-zinc-800 flex gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "terms"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {isEn ? `12 Key Terms (${filteredTerms.length})` : `12 Malalalim na Salita (${filteredTerms.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("citations")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "citations"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
            }`}
          >
            <Scale className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>
              {isEn
                ? `Statutory Citations (${filteredCitations.length})`
                : `Opisyal na Batas (${filteredCitations.length})`}
            </span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-5 sm:px-6 py-4 overflow-y-auto space-y-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          {/* Prominent Educational Disclaimer Notice */}
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl text-amber-900 dark:text-amber-200 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-950 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>{isEn ? "Strict Educational & Planning Disclaimer" : "Pormal na Paunawa sa Paggamit"}</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
              {isEn
                ? "BIR Co-Pilot is an independent educational calculation tool built according to Philippine tax statutes (RA 10963, RA 11976) and BIR regulations. It does NOT constitute formal tax, legal, or accounting advice, nor does it create a CPA-client relationship. If you have complex corporate structures, multi-employer income, or tax-exempt incentives (PEZA/BOI), always consult a licensed Certified Public Accountant (CPA) or the BIR."
                : "Ang BIR Co-Pilot ay isang educational tool na batay sa Tax Code at mga Revenue Regulations ng Pilipinas. Hindi ito pormal na legal o CPA advice. Para sa mga espesyal na sitwasyon (tulad ng PEZA tax incentives o maraming employer sa iisang taon), kumonsulta sa lisensyadong Certified Public Accountant (CPA) o sa pinakamalapit na Revenue District Office (RDO)."}
            </p>
          </div>

          {activeTab === "terms" ? (
            /* Tab 1: Terms List */
            <div className="space-y-3">
              {filteredTerms.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 space-y-1">
                  <div className="font-bold text-zinc-700 dark:text-zinc-300">
                    {isEn ? "No tax terms match your search" : "Walang terminolohiya na tumutugma"}
                  </div>
                  <div className="text-xs">
                    {isEn ? `Try searching for "TRAIN", "8%", "OSD", or "2307"` : `Subukang hanapin ang "TRAIN", "8%", o "2307"`}
                  </div>
                </div>
              ) : (
                filteredTerms.map((term, i) => (
                  <div
                    key={term.id}
                    className="p-4 bg-zinc-50/80 dark:bg-zinc-950/60 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span>{term.title}</span>
                      </h4>
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {term.badge}
                      </span>
                    </div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200 text-[11px]">{term.summary}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                      {term.explanation}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Tab 2: Legal Citations Table */
            <div className="space-y-3">
              {filteredCitations.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 space-y-1">
                  <div className="font-bold text-zinc-700 dark:text-zinc-300">
                    {isEn ? "No citations match your search" : "Walang batas na tumutugma"}
                  </div>
                  <div className="text-xs">
                    {isEn ? `Try searching for "11976", "10963", or "PhilHealth"` : `Subukang hanapin ang "11976", "10963", o "PhilHealth"`}
                  </div>
                </div>
              ) : (
                <div className="border border-zinc-200/90 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold border-b border-zinc-200 dark:border-zinc-800">
                          <th className="p-3.5">Statute / Issuance</th>
                          <th className="p-3.5">Governing Agency</th>
                          <th className="p-3.5">Statutory Basis &amp; Mandate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800 text-[11px] bg-white dark:bg-zinc-900">
                        {filteredCitations.map((item, idx) => (
                          <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <td className="p-3.5 align-top font-bold text-zinc-900 dark:text-zinc-100">
                              <div>{item.law}</div>
                              <div className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400 mt-0.5">{item.name}</div>
                            </td>
                            <td className="p-3.5 align-top text-zinc-600 dark:text-zinc-300 font-medium">{item.agency}</td>
                            <td className="p-3.5 align-top space-y-1.5">
                              <span className="inline-block text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                {item.reference}
                              </span>
                              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.keyPoints}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
            {isEn ? "Close Reference" : "Isara ang Talahulugan"}
          </button>
        </div>
      </div>
    </div>
  );
}
