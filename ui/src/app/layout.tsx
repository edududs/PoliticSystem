import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import ReactQueryProvider from "@/contexts/ReactQueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema Político",
  description: "Sistema Político",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full bg-gray-50">
      <body
        className={`antialiased h-full vsc-initialized ${inter.className} `}
      >
        <ReactQueryProvider>
          <div className="flex h-full">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          <Toaster richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
