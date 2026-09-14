import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — BIR Co-Pilot PH",
  description:
    "Terms of Service and legal disclaimer for BIR Co-Pilot PH. Understand your rights and responsibilities when using our Philippine tax planning calculator.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — BIR Co-Pilot PH",
    description:
      "Terms of Service and legal disclaimer for BIR Co-Pilot PH. Understand your rights and responsibilities when using our Philippine tax planning calculator.",
    url: "https://bir-co-pilot.ph/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
