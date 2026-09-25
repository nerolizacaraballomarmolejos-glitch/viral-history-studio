import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { ClerkProviderWrapper } from "@/components/providers/ClerkProviderWrapper";

export const metadata: Metadata = {
  title: "VIRAL HISTORY STUDIO | Videos virales de historia",
  description:
    "Crea videos virales de 70 segundos sobre personajes históricos para TikTok, Reels y Shorts.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-background text-foreground min-h-screen">
        <ClerkProviderWrapper>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto md:ml-64">{children}</main>
          </div>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
