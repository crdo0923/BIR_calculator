import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — BIR Co-Pilot PH",
  description:
    "Privacy Policy for BIR Co-Pilot PH. 100% in-browser private computation: no salary, TIN, or financial information is ever sent to any remote server or stored.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — BIR Co-Pilot PH",
    description:
      "Privacy Policy for BIR Co-Pilot PH. 100% in-browser private computation: no salary, TIN, or financial information is ever sent to any remote server or stored.",
    url: "https://bir-co-pilot.ph/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
