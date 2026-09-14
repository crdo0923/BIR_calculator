const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const FORMS_DIR = path.join(process.cwd(), "public", "forms");
if (!fs.existsSync(FORMS_DIR)) {
  fs.mkdirSync(FORMS_DIR, { recursive: true });
}

function drawBIRHeader(page, fontBold, fontReg, formNo, formDate, title, subtitle) {
  const { width } = page.getSize();
  const topY = 760;

  page.drawText("REPUBLIKA NG PILIPINAS", {
    x: 40,
    y: topY,
    size: 7.5,
    font: fontReg,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText("KAGAWARAN NG PANANALAPI • KAWANIHAN NG RENTAS INTERNAS", {
    x: 40,
    y: topY - 10,
    size: 7.5,
    font: fontReg,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText("BUREAU OF INTERNAL REVENUE — PHILIPPINES", {
    x: 40,
    y: topY - 20,
    size: 9,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawRectangle({
    x: width - 180,
    y: topY - 25,
    width: 140,
    height: 35,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1.5,
    color: rgb(0.96, 0.96, 0.96),
  });

  page.drawText(formNo, {
    x: width - 170,
    y: topY - 8,
    size: 11,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText(formDate, {
    x: width - 170,
    y: topY - 20,
    size: 7.5,
    font: fontReg,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawRectangle({
    x: 40,
    y: topY - 60,
    width: width - 80,
    height: 28,
    color: rgb(0.1, 0.15, 0.2),
  });

  page.drawText(title, {
    x: 48,
    y: topY - 48,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  if (subtitle) {
    page.drawText(subtitle, {
      x: 48,
      y: topY - 58,
      size: 7.5,
      font: fontReg,
      color: rgb(0.8, 0.9, 0.85),
    });
  }
}

function drawSectionHeader(page, fontBold, title, y) {
  const { width } = page.getSize();
  page.drawRectangle({
    x: 40,
    y: y,
    width: width - 80,
    height: 18,
    color: rgb(0.88, 0.92, 0.9),
    borderColor: rgb(0.6, 0.7, 0.65),
    borderWidth: 0.8,
  });
  page.drawText(title, {
    x: 46,
    y: y + 5,
    size: 8.5,
    font: fontBold,
    color: rgb(0.1, 0.25, 0.15),
  });
}

function drawGridRow(page, fontBold, fontReg, label, itemNo, value, y, height = 20) {
  const { width } = page.getSize();
  const leftX = 40;
  const rightX = width - 40;
  const itemWidth = 50;
  const valWidth = 140;

  page.drawRectangle({
    x: leftX,
    y,
    width: rightX - leftX,
    height,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 0.5,
    color: rgb(1, 1, 1),
  });

  if (itemNo) {
    page.drawText(itemNo, {
      x: leftX + 6,
      y: y + 6,
      size: 7.5,
      font: fontBold,
      color: rgb(0.1, 0.3, 0.2),
    });
  }

  page.drawText(label, {
    x: leftX + itemWidth,
    y: y + 6,
    size: 7.5,
    font: fontReg,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawRectangle({
    x: rightX - valWidth,
    y,
    width: valWidth,
    height,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 0.5,
    color: rgb(0.98, 0.98, 0.98),
  });

  if (value) {
    page.drawText(value, {
      x: rightX - valWidth + 8,
      y: y + 6,
      size: 8,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  }
}

async function generate1701A() {
  const doc = await PDFDocument.create();
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const p1 = doc.addPage([612, 792]);
  drawBIRHeader(
    p1,
    fontBold,
    fontReg,
    "BIR Form No. 1701A",
    "January 2018 (ENCS)",
    "Annual Income Tax Return",
    "Individuals Earning Purely from Business/Profession (Under Graduated Rates with OSD or 8% Flat Rate)"
  );

  let curY = 675;
  drawSectionHeader(p1, fontBold, "PART I — TAXPAYER BACKGROUND INFORMATION", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxpayer Identification Number (TIN): [ ___ - ___ - ___ - 00000 ]", "1", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "RDO Code: [ _____ ]    Taxpayer Type: [ X ] Single Proprietor / Professional", "2", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxpayer's Name (Last Name, First Name, Middle Name)", "3", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Trade Name / Business Name (if applicable)", "4", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Registered Address (Street, Barangay, City/Municipality, ZIP Code)", "5", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Contact Number / Mobile: ____________________  Email: ______________________", "6", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Rate Elected:  (  ) Graduated Income Tax with 40% OSD    (  ) 8% Flat Income Tax Rate", "7", "", curY);

  curY -= 30;
  drawSectionHeader(p1, fontBold, "PART II — TOTAL TAX PAYABLE (Summary of Computation)", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Total Income Tax Due (From Part IV-A Item 52 or Part IV-B Item 61)", "Item 14", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Gross Sales / Receipts / Revenues (From Part IV-A or IV-B)", "Item 15", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Allowable Reduction (Php 250,000 for Pure 8% Flat Tax Rate)", "Item 16", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxable Income (Item 15 Less Item 16)", "Item 17", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Due (Item 17 Multiplied by 8% OR Graduated Bracket)", "Item 18", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Creditable Withholding Tax (CWT) Form 2307 for 1st-4th Quarters", "Item 19", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Net Tax Payable / (Overpayment) (Item 18 Less Item 19)", "Item 20", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Total Penalties (Surcharge, Interest, Compromise under Section 248/249)", "Item 21", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "TOTAL AMOUNT PAYABLE / (REFUNDABLE) (Sum of Items 20 and 21)", "Item 22", "Php ", curY);

  curY -= 30;
  drawSectionHeader(p1, fontBold, "PART III — DECLARATION UNDER PENALTIES OF PERJURY", curY);
  curY -= 50;
  p1.drawRectangle({
    x: 40,
    y: curY,
    width: 532,
    height: 45,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 0.8,
    color: rgb(0.98, 0.98, 0.98),
  });
  p1.drawText(
    "I declare under penalties of perjury that this return, and all accompanying schedules and statements, has been made in good faith,\nverified by me, and to the best of my knowledge and belief, is true and correct pursuant to the provisions of the National Internal Revenue Code,\nas amended, and the regulations issued under authority thereof. (Republic Act No. 10963 TRAIN Law & RA 11976 EOPT Act)",
    {
      x: 48,
      y: curY + 32,
      size: 6.5,
      font: fontReg,
      color: rgb(0.2, 0.2, 0.2),
      lineHeight: 9,
    }
  );

  curY -= 45;
  p1.drawLine({
    start: { x: 300, y: curY + 20 },
    end: { x: 540, y: curY + 20 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  p1.drawText("Taxpayer's / Authorized Representative's Signature Over Printed Name", {
    x: 300,
    y: curY + 8,
    size: 7,
    font: fontReg,
    color: rgb(0.3, 0.3, 0.3),
  });

  p1.drawText("Page 1 of 2 — Form 1701A • Provided by BIR Co-Pilot PH (Built by DEVjules) • Always submit via eBIRForms", {
    x: 40,
    y: 20,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  const p2 = doc.addPage([612, 792]);
  drawBIRHeader(
    p2,
    fontBold,
    fontReg,
    "BIR Form No. 1701A",
    "Guidelines & References",
    "Filing Instructions & Taxpayer Guidelines",
    "Bureau of Internal Revenue — Republic Act No. 10963 (TRAIN Law) & RA 11976 (EOPT Act 2026)"
  );

  let p2Y = 675;
  drawSectionHeader(p2, fontBold, "1. WHO MUST FILE BIR FORM 1701A?", p2Y);
  p2Y -= 55;
  p2.drawText(
    "This return shall be filed by individual natural persons who are:\n" +
      "• Purely self-employed, freelancers, professionals, sole proprietors whose gross sales/receipts and other non-operating income\n" +
      "  do not exceed the VAT threshold of Php 3,000,000.\n" +
      "• Taxpayers who elected the 8% Flat Income Tax Rate on gross sales/receipts in excess of Php 250,000; OR\n" +
      "• Taxpayers who elected the Graduated Income Tax Rates with the 40% Optional Standard Deduction (OSD).",
    { x: 48, y: p2Y + 40, size: 7.5, font: fontReg, lineHeight: 11, color: rgb(0.15, 0.15, 0.15) }
  );

  p2Y -= 30;
  drawSectionHeader(p2, fontBold, "2. DEADLINE & FILING CHANNELS", p2Y);
  p2Y -= 45;
  p2.drawText(
    "• Filing Deadline: On or before April 15 of each year following the close of the calendar year.\n" +
      "• Electronic Filing: File online via the official Offline eBIRForms Package (Version 7.9.4.2 or later).\n" +
      "• Payment Options: Under the Ease of Paying Taxes (EOPT Act RA 11976), pay online via Maya, GCash, LandBank Link.BizPortal,\n" +
      "  DBP PayTax, or over-the-counter at ANY Authorized Agent Bank (AAB) or Revenue District Office (RDO) nationwide.",
    { x: 48, y: p2Y + 30, size: 7.5, font: fontReg, lineHeight: 11, color: rgb(0.15, 0.15, 0.15) }
  );

  p2Y -= 30;
  drawSectionHeader(p2, fontBold, "3. LINE-BY-LINE FORM MAPPING (From BIR Co-Pilot)", p2Y);
  p2Y -= 20;
  drawGridRow(p2, fontBold, fontReg, "Item 15 (Gross Revenue): Total payments collected during the calendar year", "15", "Enter Gross Amount", p2Y);
  p2Y -= 20;
  drawGridRow(p2, fontBold, fontReg, "Item 16 (Reduction): Deduct Php 250,000 if Pure 8% (Zero if Mixed or Graduated)", "16", "Php 250,000 / Php 0", p2Y);
  p2Y -= 20;
  drawGridRow(p2, fontBold, fontReg, "Item 17 (Taxable Base): Item 15 minus Item 16 (Cannot be negative)", "17", "Taxable Base", p2Y);
  p2Y -= 20;
  drawGridRow(p2, fontBold, fontReg, "Item 18 (Tax Due): Taxable Base multiplied by 8% or graduated bracket", "18", "Computed Tax", p2Y);
  p2Y -= 20;
  drawGridRow(p2, fontBold, fontReg, "Item 19 (Tax Credits): Form 2307 Creditable Withholding Tax from clients", "19", "Less 2307 CWT", p2Y);
  p2Y -= 20;
  drawGridRow(p2, fontBold, fontReg, "Item 20 (Net Payable): Item 18 minus Item 19. Cash amount to be paid.", "20", "Net Cash Payable", p2Y);

  p2.drawText("Page 2 of 2 — Form 1701A • Provided by BIR Co-Pilot PH (Built by DEVjules)", {
    x: 40,
    y: 20,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FORMS_DIR, "BIR-Form-1701A.pdf"), bytes);
  console.log("Created BIR-Form-1701A.pdf");
}

async function generate1701Q() {
  const doc = await PDFDocument.create();
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const p1 = doc.addPage([612, 792]);
  drawBIRHeader(
    p1,
    fontBold,
    fontReg,
    "BIR Form No. 1701Q",
    "January 2018 (ENCS)",
    "Quarterly Income Tax Return",
    "For Individuals, Estates, and Trusts (Including Freelancers, Professionals & Sole Proprietors)"
  );

  let curY = 675;
  drawSectionHeader(p1, fontBold, "PART I — TAXPAYER & QUARTER DETAILS", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Quarter: [ ] 1st Quarter (May 15)  [ ] 2nd Quarter (Aug 15)  [ ] 3rd Quarter (Nov 15)", "1", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "TIN: [ ___ - ___ - ___ - 00000 ]    RDO Code: [ _____ ]", "2", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxpayer's Name: ___________________________________________________________", "3", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Registered Address: ________________________________________________________", "4", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Method of Deduction: ( ) 8% Flat Tax Rate   ( ) 40% Optional Standard Deduction (OSD)", "5", "", curY);

  curY -= 30;
  drawSectionHeader(p1, fontBold, "PART II — COMPUTATION OF QUARTERLY TAX", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Sales / Receipts / Revenues for this Quarter", "26", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Add: Cumulative Sales / Receipts from Previous Quarter(s)", "27", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Total Cumulative Gross Sales / Receipts to Date (Item 26 + Item 27)", "28", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Allowable Reduction (Php 250,000 for Pure 8% Flat Rate)", "29", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxable Base for the Period (Item 28 Less Item 29)", "30", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Due (Item 30 × 8% OR Graduated Brackets)", "31", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Prior Quarters Income Tax Payments (Form 1701Q)", "32A", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Form 2307 Creditable Withholding Tax (CWT) for the Quarter", "32B", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Net Tax Payable / (Overpayment) (Item 31 Less 32A and 32B)", "33", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Penalties (Surcharge, Interest, Compromise)", "34", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "TOTAL AMOUNT PAYABLE (Sum of Items 33 and 34)", "35", "Php ", curY);

  curY -= 35;
  drawSectionHeader(p1, fontBold, "PART III — DECLARATION & SIGNATURE", curY);
  curY -= 40;
  p1.drawText("I declare under penalties of perjury that this return is true, correct, and in accordance with the NIRC (RA 10963).", {
    x: 48,
    y: curY + 25,
    size: 7.5,
    font: fontReg,
  });

  p1.drawLine({
    start: { x: 300, y: curY + 10 },
    end: { x: 540, y: curY + 10 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  p1.drawText("Taxpayer Signature / Authorized Signatory", {
    x: 320,
    y: curY - 2,
    size: 7,
    font: fontReg,
    color: rgb(0.3, 0.3, 0.3),
  });

  p1.drawText("Page 1 of 1 — Form 1701Q • Provided by BIR Co-Pilot PH (Built by DEVjules)", {
    x: 40,
    y: 20,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FORMS_DIR, "BIR-Form-1701Q.pdf"), bytes);
  console.log("Created BIR-Form-1701Q.pdf");
}

async function generate2307() {
  const doc = await PDFDocument.create();
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const p1 = doc.addPage([612, 792]);
  drawBIRHeader(
    p1,
    fontBold,
    fontReg,
    "BIR Form No. 2307",
    "Certificate",
    "Certificate of Creditable Tax Withheld At Source",
    "To be issued by the Withholding Agent (Client/Company) to the Payee (Freelancer/Contractor)"
  );

  let curY = 675;
  drawSectionHeader(p1, fontBold, "PART I — PAYEE INFORMATION (Freelancer / Contractor / Vendor)", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Payee's TIN: [ ___ - ___ - ___ - 00000 ]", "1", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Payee's Name: ___________________________________________________________", "2", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Registered Address: ________________________________________________________", "3", "", curY);

  curY -= 25;
  drawSectionHeader(p1, fontBold, "PART II — PAYOR INFORMATION (Client Company / Employer)", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Payor's TIN: [ ___ - ___ - ___ - 00000 ]", "4", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Payor's Registered Name: ___________________________________________________", "5", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Payor's Address: ___________________________________________________________", "6", "", curY);

  curY -= 25;
  drawSectionHeader(p1, fontBold, "PART III — DETAILS OF MONTHLY INCOME PAYMENTS & TAXES WITHHELD", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Nature of Income Payment (Professional Fees / Freelance Services)", "ATC", "WI010 / WI011 / WI150", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Month 1 (Amount of Gross Income Subject to Withholding)", "M1", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Month 2 (Amount of Gross Income Subject to Withholding)", "M2", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Month 3 (Amount of Gross Income Subject to Withholding)", "M3", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Total Gross Income Payments for the Quarter", "Total", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Withheld for the Quarter (5% or 10% Withholding Tax)", "Tax", "Php  (CWT Deductible)", curY);

  curY -= 35;
  drawSectionHeader(p1, fontBold, "PART IV — CERTIFICATION OF PAYOR", curY);
  curY -= 40;
  p1.drawText("We hereby declare that this certificate has been made in good faith and the taxes withheld have been remitted to BIR.", {
    x: 48,
    y: curY + 25,
    size: 7.5,
    font: fontReg,
  });

  p1.drawLine({
    start: { x: 300, y: curY + 10 },
    end: { x: 540, y: curY + 10 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  p1.drawText("Authorized Signatory of Payor (Withholding Agent)", {
    x: 320,
    y: curY - 2,
    size: 7,
    font: fontReg,
    color: rgb(0.3, 0.3, 0.3),
  });

  p1.drawText("Page 1 of 1 — Form 2307 • Provided by BIR Co-Pilot PH (Built by DEVjules)", {
    x: 40,
    y: 20,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FORMS_DIR, "BIR-Form-2307.pdf"), bytes);
  console.log("Created BIR-Form-2307.pdf");
}

async function generate2316() {
  const doc = await PDFDocument.create();
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const p1 = doc.addPage([612, 792]);
  drawBIRHeader(
    p1,
    fontBold,
    fontReg,
    "BIR Form No. 2316",
    "Certificate",
    "Certificate of Compensation Payment / Tax Withheld",
    "For Employees and Wage Earners — Republic Act No. 10963 (TRAIN Law)"
  );

  let curY = 675;
  drawSectionHeader(p1, fontBold, "PART I — EMPLOYEE INFORMATION", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Employee TIN: [ ___ - ___ - ___ - 00000 ]    RDO Code: [ _____ ]", "1", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Employee Name: ________________________________________________________", "2", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Registered Address: ____________________________________________________", "3", "", curY);

  curY -= 25;
  drawSectionHeader(p1, fontBold, "PART II — EMPLOYER INFORMATION", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Employer TIN: [ ___ - ___ - ___ - 00000 ]", "4", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Employer Registered Name: _______________________________________________", "5", "", curY);

  curY -= 25;
  drawSectionHeader(p1, fontBold, "PART III — SUMMARY OF COMPENSATION INCOME AND TAX WITHHELD", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Gross Compensation Income from this Employer", "20", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Non-Taxable Mandatory Contributions (SSS, PhilHealth, Pag-IBIG)", "21", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Non-Taxable 13th Month Pay & Other Benefits (Max Php 90,000 cap)", "22", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: De Minimis Benefits & Other Exempt Allowances", "23", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Total Non-Taxable / Exempt Compensation Income (Sum of Items 21 to 23)", "24", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxable Compensation Income (Item 20 Less Item 24)", "25", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Due (Computed via 2023–2026 TRAIN Law Graduated Brackets)", "26", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Total Taxes Withheld by Employer during the Year", "27", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Year-End Tax Adjustment: ( ) Equal / Zero  ( ) Refund Due  ( ) Tax Payable", "28", "Php  0.00", curY);

  curY -= 35;
  drawSectionHeader(p1, fontBold, "PART IV — SIGNATURES & CONFORME", curY);
  curY -= 40;
  p1.drawLine({
    start: { x: 50, y: curY + 15 },
    end: { x: 250, y: curY + 15 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  p1.drawText("Employer / Authorized Agent Signature", { x: 60, y: curY + 2, size: 7, font: fontReg });

  p1.drawLine({
    start: { x: 320, y: curY + 15 },
    end: { x: 540, y: curY + 15 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  p1.drawText("Employee Signature (Conforme)", { x: 360, y: curY + 2, size: 7, font: fontReg });

  p1.drawText("Page 1 of 1 — Form 2316 • Provided by BIR Co-Pilot PH (Built by DEVjules)", {
    x: 40,
    y: 20,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FORMS_DIR, "BIR-Form-2316.pdf"), bytes);
  console.log("Created BIR-Form-2316.pdf");
}

async function generate2551Q() {
  const doc = await PDFDocument.create();
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const p1 = doc.addPage([612, 792]);
  drawBIRHeader(
    p1,
    fontBold,
    fontReg,
    "BIR Form No. 2551Q",
    "January 2018 (ENCS)",
    "Quarterly Percentage Tax Return",
    "Under Section 116 of the Tax Code (Applicable to Graduated Taxpayers with Gross Sales < Php 3,000,000)"
  );

  let curY = 675;
  drawSectionHeader(p1, fontBold, "PART I — TAXPAYER INFORMATION", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "For the Quarter: [ ] 1st (Apr 25)  [ ] 2nd (Jul 25)  [ ] 3rd (Oct 25)  [ ] 4th (Jan 25)", "1", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxpayer TIN: [ ___ - ___ - ___ - 00000 ]    RDO: [ _____ ]", "2", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxpayer's Name: ___________________________________________________________", "3", "", curY);

  curY -= 25;
  drawSectionHeader(p1, fontBold, "PART II — COMPUTATION OF PERCENTAGE TAX", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Alphanumeric Tax Code (ATC): PT010 (Persons exempt from VAT under Sec 116)", "ATC", "PT010", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Gross Sales / Receipts for the Quarter", "Item 14", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Applicable Percentage Tax Rate (3% under Section 116)", "Item 15", "3.0%", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Percentage Tax Due for this Quarter (Item 14 × 3%)", "Item 16", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Creditable Percentage Tax Withheld At Source (Form 2307)", "Item 17", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Net Tax Payable / (Overpayment) (Item 16 Less Item 17)", "Item 18", "Php ", curY);

  curY -= 40;
  drawSectionHeader(p1, fontBold, "PART III — DECLARATION & FILING INSTRUCTIONS", curY);
  curY -= 30;
  p1.drawText(
    "NOTE: Taxpayers who elected the 8% Flat Income Tax Rate are EXEMPT from filing Form 2551Q Percentage Tax.\n" +
      "Only taxpayers under the Graduated Income Tax Regime must file Form 2551Q each quarter.",
    { x: 48, y: curY + 15, size: 7.5, font: fontBold, color: rgb(0.7, 0.1, 0.1), lineHeight: 11 }
  );

  p1.drawText("Page 1 of 1 — Form 2551Q • Provided by BIR Co-Pilot PH (Built by DEVjules)", {
    x: 40,
    y: 20,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FORMS_DIR, "BIR-Form-2551Q.pdf"), bytes);
  console.log("Created BIR-Form-2551Q.pdf");
}

async function generate1701() {
  const doc = await PDFDocument.create();
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const p1 = doc.addPage([612, 792]);
  drawBIRHeader(
    p1,
    fontBold,
    fontReg,
    "BIR Form No. 1701",
    "January 2018 (ENCS)",
    "Annual Income Tax Return",
    "For Individuals (Including Mixed Income Earners, Estates and Trusts with Business/Profession)"
  );

  let curY = 675;
  drawSectionHeader(p1, fontBold, "PART I — TAXPAYER IDENTIFICATION", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxpayer TIN: [ ___ - ___ - ___ - 00000 ]    RDO: [ _____ ]", "1", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxpayer Name: ____________________________________________________________", "2", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxpayer Type: [ X ] Mixed Income Earner (Compensation + Business/Profession)", "3", "", curY);

  curY -= 25;
  drawSectionHeader(p1, fontBold, "PART II — TAX COMPUTATION (Mixed Income Earner RR 8-2018)", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Taxable Compensation Income from Employment (Form 2316)", "Item 30", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Due on Compensation Income (Graduated Brackets)", "Item 31", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Gross Business / Freelance Receipts (No Php 250k reduction if Mixed)", "Item 32", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Due on Business Income (8% Flat Rate OR Graduated)", "Item 33", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Aggregate Total Income Tax Due (Item 31 + Item 33)", "Item 34", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Taxes Withheld on Compensation (Form 2316)", "Item 35A", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Less: Form 2307 Creditable Withholding Tax on Freelance", "Item 35B", "Php ", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Net Tax Payable / (Overpayment) (Item 34 Less Credits)", "Item 36", "Php ", curY);

  curY -= 40;
  drawSectionHeader(p1, fontBold, "PART III — DECLARATION UNDER PENALTIES OF PERJURY", curY);
  curY -= 40;
  p1.drawLine({
    start: { x: 300, y: curY + 15 },
    end: { x: 540, y: curY + 15 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  p1.drawText("Taxpayer Signature / Authorized Signatory", { x: 320, y: curY + 2, size: 7, font: fontReg });

  p1.drawText("Page 1 of 1 — Form 1701 • Provided by BIR Co-Pilot PH (Built by DEVjules)", {
    x: 40,
    y: 20,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FORMS_DIR, "BIR-Form-1701.pdf"), bytes);
  console.log("Created BIR-Form-1701.pdf");
}

async function generate1901() {
  const doc = await PDFDocument.create();
  const fontReg = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const p1 = doc.addPage([612, 792]);
  drawBIRHeader(
    p1,
    fontBold,
    fontReg,
    "BIR Form No. 1901",
    "Application",
    "Application for Registration",
    "For Self-Employed, Freelancers, Professionals, and Mixed Income Earners"
  );

  let curY = 675;
  drawSectionHeader(p1, fontBold, "PART I — APPLICANT INFORMATION", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Applicant TIN: [ ___ - ___ - ___ - 00000 ]", "1", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Applicant Full Name: _______________________________________________________", "2", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Date of Birth: [ YYYY / MM / DD ]    Citizenship: [ Filipino ]", "3", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Registered Business Address: _______________________________________________", "4", "", curY);

  curY -= 25;
  drawSectionHeader(p1, fontBold, "PART II — TAX TYPE & REGIME ELECTION", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Type: [ X ] Income Tax  [ X ] Registration Fee (Exempt under EOPT)  [ ] Percentage Tax", "5", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Primary Line of Business / PSIC Code: ________________________________________", "6", "", curY);
  curY -= 20;
  drawGridRow(p1, fontBold, fontReg, "Tax Rate Elected on 1st Quarter: ( ) 8% Flat Tax Rate  ( ) Graduated Rates", "7", "", curY);

  curY -= 35;
  drawSectionHeader(p1, fontBold, "PART III — REGISTRATION CHECKLIST (Requirements under EOPT Act)", curY);
  curY -= 40;
  p1.drawText(
    "1. Valid Government-Issued ID (Passport, PhilID, UMID, Driver's License)\n" +
      "2. DTI Certificate of Business Name (if using a trade name)\n" +
      "3. BIR Form 1901 duly accomplished\n" +
      "4. NOTE: The Annual Registration Fee (ARF) of Php 500 has been CANCELLED pursuant to the EOPT Act (RA 11976).",
    { x: 48, y: curY + 25, size: 7.5, font: fontReg, lineHeight: 11, color: rgb(0.15, 0.15, 0.15) }
  );

  p1.drawText("Page 1 of 1 — Form 1901 • Provided by BIR Co-Pilot PH (Built by DEVjules)", {
    x: 40,
    y: 20,
    size: 7,
    font: fontReg,
    color: rgb(0.5, 0.5, 0.5),
  });

  const bytes = await doc.save();
  fs.writeFileSync(path.join(FORMS_DIR, "BIR-Form-1901.pdf"), bytes);
  console.log("Created BIR-Form-1901.pdf");
}

async function runAll() {
  console.log("Generating official BIR PDF forms in public/forms/...");
  await generate1701A();
  await generate1701Q();
  await generate2307();
  await generate2316();
  await generate2551Q();
  await generate1701();
  await generate1901();
  console.log("All 7 official BIR PDF forms generated successfully!");
}

runAll().catch(console.error);
