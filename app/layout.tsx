import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelf — personal library",
  description: "Track the books you want to read, are reading and have finished.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container page">{children}</main>
      </body>
    </html>
  );
}
