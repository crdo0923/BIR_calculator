import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bir-copilot.ph"
  ),
  title: {
    default: "BIR Co-Pilot PH — 8% Flat vs Graduated Tax & Payslip Calculator",
    template: "%s | BIR Co-Pilot PH",
  },
  description:
    "Free, private Philippine Tax & Payslip Calculator for Filipino Freelancers, Sole Proprietors, and Full-Time Employees. Compare 8% Flat vs Graduated OSD under TRAIN Law & EOPT Act, compute exact SSS, PhilHealth, Pag-IBIG deductions, and get eBIRForms Line 15–21 values. Built by DEVjules.",
  keywords: [
    "BIR tax calculator",
    "8 percent vs graduated tax",
    "Philippine freelance tax calculator",
    "TRAIN Law 2026 tax table",
    "eBIRForms 1701A guide",
    "SSS contribution table 2024 2025 2026",
    "PhilHealth 5 percent calculator",
    "Pag-IBIG contribution ceiling",
    "sweldo calculator Philippines",
    "DOLE factor 261 daily rate",
    "tax co-pilot",
    "DEVjules",
  ],
  authors: [{ name: "DEVjules" }],
  creator: "DEVjules",
  publisher: "DEVjules",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://bir-copilot.ph",
    siteName: "BIR Co-Pilot PH",
    title: "BIR Co-Pilot PH — 8% vs Graduated Tax & Payslip Calculator",
    description:
      "For Filipino Freelancers & Full-Time Employees: Compare 8% Flat vs Graduated OSD in real time. SSS, PhilHealth, Pag-IBIG & eBIRForms line mapping. 100% private in your browser. Built by DEVjules.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BIR Co-Pilot PH — 8% vs Graduated Tax & Payslip Calculator by DEVjules",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIR Co-Pilot PH — 8% vs Graduated Tax & Payslip Calculator",
    description:
      "For Filipino Freelancers & Full-Time Employees: Compare 8% Flat vs Graduated OSD in 30 seconds. SSS, PhilHealth, Pag-IBIG, eBIRForms guide. Built by DEVjules.",
    images: ["/og-image.png"],
    creator: "@DEVjules",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
