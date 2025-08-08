import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const latofont = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Publika",
  description: "",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={latofont.className} suppressHydrationWarning={true}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
