"use client";

import React, { useState } from "react";
import { Language } from "@/lib/translations";
import { ChevronDown, HelpCircle, Check } from "lucide-react";

interface RegimeExplainerFAQProps {
  lang: Language;
}

interface FAQItem {
  question: string;
  shortAnswer: string;
  details: React.ReactNode;
}

export function RegimeExplainerFAQ({ lang }: RegimeExplainerFAQProps) {
  const isEn = lang === "en";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const faqList: FAQItem[] = isEn
    ? [
        {
          question: "In simple terms, what is the 8% Flat Rate?",
          shortAnswer:
            "A single 8% tax on gross earnings above ₱250,000, with zero Percentage Tax (Form 2551Q) required.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Instead of dealing with complex tax brackets and tracking receipts, you pay a single flat rate of 8% on
                your income above ₱250,000.
              </p>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/70 font-mono text-[11px] text-zinc-800">
                Formula: (Gross Earnings − ₱250,000) × 8%
              </div>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  <strong className="text-zinc-800">100% Exempt from Percentage Tax:</strong> You do NOT file BIR Form
                  2551Q every quarter. That saves you 4 tax filings per year.
                </li>
                <li>
                  <strong className="text-zinc-800">No Receipts Needed:</strong> You don&apos;t have to submit or defend
                  expense receipts to reduce your tax.
                </li>
                <li>
                  <strong className="text-zinc-800">Simpler Tax Form:</strong> You file BIR Form 1701A instead of the
                  longer Form 1701.
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "What are Graduated Rates and why does it require two forms?",
          shortAnswer:
            "A bracket system (0% to 35%) on net income, plus a mandatory 3% Percentage Tax (Form 2551Q) every quarter.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Graduated rates tax your net income using progressive tax brackets (0% up to 35% under the TRAIN Law).
                The higher your net profit, the higher your tax bracket.
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  <strong className="text-zinc-800">Expenses Deductible:</strong> You can deduct business expenses using
                  either <strong>40% OSD</strong> (an automatic 40% deduction without receipts) or{" "}
                  <strong>Itemized Deductions</strong> (official BIR receipts).
                </li>
                <li>
                  <strong className="text-zinc-800">The 3% Percentage Tax:</strong> Unlike the 8% flat rate, Graduated
                  filers must pay an additional <strong>3% Percentage Tax (Sec. 116)</strong> on gross sales every
                  quarter.
                </li>
                <li>
                  <strong className="text-zinc-800">2 Forms Every Quarter:</strong> You must file both Form 1701Q
                  (Income Tax) and Form 2551Q (Percentage Tax).
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Which one saves more money? (Who should pick which?)",
          shortAnswer:
            "8% almost always wins for freelancers and service providers; Graduated wins only if you have massive receipted expenses.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Choose 8% Flat Rate if:
                  </span>
                  <p className="text-zinc-600 text-[11px]">
                    You are a freelancer, VA, software engineer, designer, consultant, or online professional with low
                    physical business expenses. Because you skip the 3% percentage tax, 8% saves the most cash.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-zinc-600" /> Choose Graduated if:
                  </span>
                  <p className="text-zinc-600 text-[11px]">
                    You run a business with very high operating expenses backed by official BIR receipts (e.g. inventory,
                    store rent, supplies exceeding 50%–60% of gross revenue).
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          question: "What if I have a full-time day job and freelance on the side?",
          shortAnswer:
            "You are a Mixed Income Earner. Day job is taxed Graduated; sideline can use 8% (without the ₱250k deduction).",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Under BIR Revenue Regulations No. 8-2018, mixed earners are handled with a specific split rule:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  Your employer deducts taxes from your day job salary using the Graduated withholding tax table.
                </li>
                <li>
                  For your freelance sideline, you can still elect the 8% flat rate, but the{" "}
                  <strong className="text-zinc-800">₱250,000 deduction is not allowed</strong> because it was already
                  applied to your salary.
                </li>
                <li>
                  Sideline formula: <code>Freelance Gross × 8%</code>.
                </li>
                <li>
                  Mixed income earners lose substituted filing and must file an annual consolidated return (BIR Form
                  1701).
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Who is NOT allowed to choose the 8% Flat Rate?",
          shortAnswer:
            "Taxpayers earning over ₱3,000,000 gross per year, VAT-registered entities, or those who didn't elect it on Q1.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  <strong className="text-zinc-800">Gross Income over ₱3,000,000:</strong> Once your gross receipts
                  exceed the ₱3M VAT threshold, 8% is automatically revoked. You must register for VAT and use Graduated
                  rates.
                </li>
                <li>
                  <strong className="text-zinc-800">Already VAT-Registered:</strong> If your BIR Certificate of
                  Registration (Form 2303) indicates VAT tax type, you cannot avail of 8%.
                </li>
                <li>
                  <strong className="text-zinc-800">Must Signify in Q1:</strong> You must check the 8% option box on your
                  1st Quarter BIR Form 1701Q. You cannot switch to 8% in Q2, Q3, or Annual if you did not pick it in Q1.
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Am I required to register with the BIR if I freelance or run a small business?",
          shortAnswer:
            "Yes. All self-employed individuals, professionals, and freelancers in the Philippines are required to register with the BIR.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Under Section 236 of the Tax Code, anyone engaging in trade, business, or practice of profession must
                register with the Revenue District Office (RDO) having jurisdiction over their principal place of
                business or residence.
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  You will receive a <strong>BIR Certificate of Registration (Form 2303)</strong>.
                </li>
                <li>
                  Under the <strong>Ease of Paying Taxes (EOPT) Act</strong>, the ₱500 Annual Registration Fee has been
                  permanently removed!
                </li>
                <li>
                  Registered taxpayers can issue official invoices to local and foreign clients and open corporate or
                  business bank accounts.
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "What is Form 2307 and how does it reduce what I pay?",
          shortAnswer:
            "Form 2307 is proof that your client withheld tax upfront. You deduct this amount directly from your final tax payable.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                BIR Form 2307 (Certificate of Creditable Tax Withheld at Source) is issued by corporate clients who
                withheld 5% or 10% from your professional fees before paying you.
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  <strong>Dollar-for-dollar deduction:</strong> If your annual tax due is ₱60,000 and your clients
                  already withheld ₱30,000 via Form 2307, your remaining cash out is only ₱30,000.
                </li>
                <li>
                  <strong>Never throw away Form 2307:</strong> Keep the signed copy from your clients, as it serves as
                  your official tax credit receipt when submitting your returns.
                </li>
              </ul>
            </div>
          ),
        },
      ]
    : [
        {
          question: "Sa simpleng salita, ano ang 8% Flat Rate?",
          shortAnswer:
            "Isang bagsakang 8% tax sa kitang lampas ₱250,000, at libre ka sa 3% Percentage Tax (Form 2551Q).",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Imbes na dumaan sa masalimuot na tax brackets at mag-ipon ng sangkaterbang resibo, isang 8% lang ang
                babayaran mo sa kitang lampas ng ₱250,000.
              </p>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/70 font-mono text-[11px] text-zinc-800">
                Formula: (Kabuuang Kita − ₱250,000) × 8%
              </div>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  <strong className="text-zinc-800">Libre sa Percentage Tax:</strong> HINDI mo na kailangang mag-file ng
                  BIR Form 2551Q bawat quarter. Bawas apat na tax return bawat taon!
                </li>
                <li>
                  <strong className="text-zinc-800">Walang Kailangang Resibo:</strong> Hindi mo kailangang patunayan ang
                  mga gastos mo para mabawasan ang buwis.
                </li>
                <li>
                  <strong className="text-zinc-800">Mas Simpleng Form:</strong> BIR Form 1701A lang ang gagamitin mo sa
                  annual filing imbes na ang mahabang Form 1701.
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Ano ang Graduated Rates at bakit dalawang form ang kailangan?",
          shortAnswer:
            "Tax table na 0% hanggang 35% base sa netong kita, PLUS may karagdagang 3% Percentage Tax (Form 2551Q).",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Sa Graduated rates, ginagamit ang progressive tax brackets (0% hanggang 35%). Mas mataas ang kinita mo,
                mas mataas ang porsyento ng buwis.
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  <strong className="text-zinc-800">May Bawas sa Gastos:</strong> Pwede mong ibawas ang gastos sa negosyo
                  gamit ang <strong>40% OSD</strong> (automatic na 40% bawas kahit walang resibo) o{" "}
                  <strong>Itemized Deductions</strong> (opisyal na BIR resibo).
                </li>
                <li>
                  <strong className="text-zinc-800">May 3% Percentage Tax:</strong> Hindi tulad ng 8% flat rate, ang
                  Graduated filers ay kailangan pang magbayad ng <strong>3% Percentage Tax (Sec. 116)</strong> sa gross
                  sales bawat quarter.
                </li>
                <li>
                  <strong className="text-zinc-800">2 Form Bawat Quarter:</strong> Kailangan mong mag-file ng Form 1701Q
                  (Income Tax) AT Form 2551Q (Percentage Tax).
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Saan ako mas makakatipid? (Sino ang dapat pumili ng alin?)",
          shortAnswer:
            "8% halos lagi ang panalo para sa freelancers at online workers; Graduated lang kung napakalaki ng resibo mo sa gastos.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Piliin ang 8% Flat Rate kung:
                  </span>
                  <p className="text-zinc-600 text-[11px]">
                    Ikaw ay freelancer, VA, developer, designer, consultant, o online professional na maliit lang ang
                    gastos sa operasyon. Dahil libre ka sa 3% percentage tax, 8% ang pinakamura at pinakamadali.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1.5">
                  <span className="font-bold text-zinc-900 flex items-center gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-zinc-600" /> Piliin ang Graduated kung:
                  </span>
                  <p className="text-zinc-600 text-[11px]">
                    May negosyo ka na napakalaki ng mga gastos na may lehitimong BIR resibo (tulad ng renta ng pwesto,
                    stocks, materyales na lagpas 50%–60% ng benta mo).
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          question: "Paano kung may regular na trabaho ako at may sideline (Mixed Income)?",
          shortAnswer:
            "Mixed Income Earner ka. Graduated ang sahod sa day job; pwedeng 8% ang sideline (pero walang ₱250k deduction).",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Ayon sa BIR Revenue Regulations No. 8-2018, may hiwalay na patakaran para sa may sideline:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  Ang sweldo mo sa regular mong trabaho ay awtomatikong binubuwisan ng employer gamit ang Graduated table.
                </li>
                <li>
                  Para sa sideline mong freelance/negosyo, pwede mo pa ring piliin ang 8%, pero{" "}
                  <strong className="text-zinc-800">WALA NANG ₱250,000 na bawas</strong> dahil nagamit na ito sa sweldo mo.
                </li>
                <li>
                  Sideline formula sa 8%: <code>Freelance Gross × 8%</code>.
                </li>
                <li>
                  Mawawalan ka ng substituted filing kaya kailangan mong mag-file ng annual consolidated Form 1701 sa BIR.
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Sino ang HINDI pwedeng pumili ng 8% Flat Rate?",
          shortAnswer:
            "Kumikita ng lagpas ₱3M bawat taon, mga VAT-registered, o mga hindi nakapili nito sa 1st Quarter.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  <strong className="text-zinc-800">Lagpas sa ₱3,000,000 ang Kita:</strong> Kapag lumagpas sa ₱3M ang
                  gross receipts sa taon, awtomatikong bawal ang 8%. Kailangang mag-VAT at mag-Graduated rates.
                </li>
                <li>
                  <strong className="text-zinc-800">VAT-Registered sa BIR:</strong> Kung nakasaad sa iyong COR (Form
                  2303) na VAT ka, hindi ka pwedeng mag-8%.
                </li>
                <li>
                  <strong className="text-zinc-800">Hindi Napili sa 1st Quarter:</strong> Kailangang ideklara ang pagpili
                  sa 8% sa iyong 1st Quarter Form 1701Q. Bawal lumipat sa 8% sa kalagitnaan ng taon.
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Kailangan ko bang magrehistro sa BIR kung ako ay freelancer o may maliit na negosyo?",
          shortAnswer:
            "Oo. Lahat ng kumikita mula sa freelance, propesyon, o negosyo sa Pilipinas ay obligadong magrehistro sa BIR.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Ayon sa Section 236 ng Tax Code, ang bawat indibidwal na nagtatrabaho o nagnenegosyo para sa sarili ay
                dapat magpatala sa Revenue District Office (RDO) na sumasakop sa kanyang tirahan o opisina.
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  Makakatanggap ka ng <strong>BIR Certificate of Registration (Form 2303)</strong>.
                </li>
                <li>
                  Sa ilalim ng <strong>Ease of Paying Taxes (EOPT) Act</strong>, tinanggal na nang permanente ang ₱500
                  Annual Registration Fee!
                </li>
                <li>
                  Kapag rehistrado ka, maaari kang mag-isyu ng opisyal na invoice sa mga kliyente at magbukas ng
                  business bank accounts.
                </li>
              </ul>
            </div>
          ),
        },
        {
          question: "Ano ang Form 2307 at paano nito binabawasan ang buwis ko?",
          shortAnswer:
            "Katibayan ito na binawasan ka na ng withholding tax ng kliyente mo. Ibinabawas ito nang buo sa babayaran mo sa BIR.",
          details: (
            <div className="space-y-3 pt-2 text-zinc-600 leading-relaxed text-xs">
              <p>
                Ang BIR Form 2307 (Certificate of Creditable Tax Withheld at Source) ay ibinibigay ng mga kumpanyang
                kliyente mo kapag binawasan nila ng 5% o 10% ang bayad sa iyong serbisyo bago ibigay sa&apos;yo.
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-600">
                <li>
                  <strong>Bawas piso-sa-piso:</strong> Kung ang kabuuang buwis mo ay ₱60,000 at nakakaltasan ka na ng
                  ₱30,000 via Form 2307, ₱30,000 na lamang ang kailangan mong ilabas na cash sa BIR.
                </li>
                <li>
                  <strong>Huwag itapon ang Form 2307:</strong> Itago ang kopya mula sa mga kliyente dahil ito ang
                  iyong opisyal na tax credit receipt sa pag-file ng returns.
                </li>
              </ul>
            </div>
          ),
        },
      ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 sm:p-6 shadow-xs space-y-4 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              {isEn ? "Understanding 8% vs Graduated Rates" : "Paliwanag: 8% Flat Rate vs Graduated"}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {isEn
                ? "Simple, headache-free guide. Click any question to expand."
                : "Simpleng paliwanag nang hindi masakit sa ulo. Pindutin para buksan."}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md hidden sm:inline-block">
          {isEn ? `${faqList.length} FAQs` : `${faqList.length} Katanungan`}
        </span>
      </div>

      {/* Accordion List */}
      <div className="space-y-2">
        {faqList.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-colors ${
                isOpen
                  ? "border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40"
                  : "border-zinc-200/70 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full text-left p-3 sm:p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
              >
                <div className="space-y-1 pr-1">
                  <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item.question}</span>
                  </div>
                  {!isOpen && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pl-6 line-clamp-1">
                      {item.shortAnswer}
                    </p>
                  )}
                </div>

                <div className="p-1 text-zinc-400 dark:text-zinc-500 shrink-0">
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-zinc-900 dark:text-zinc-100" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3.5 sm:px-4 sm:pb-4 border-t border-zinc-200/50 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {item.details}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
