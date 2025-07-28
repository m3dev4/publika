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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={latofont.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
