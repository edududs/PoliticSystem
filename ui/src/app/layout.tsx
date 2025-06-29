import type { Metadata } from "next";
import "../styles/colors.css";
import "./globals.css";

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
      <body className={`antialiased h-full vsc-initialized`}>
        <div className="flex h-full">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
