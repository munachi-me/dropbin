import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { ToastProvider } from '@/components/toast'

export const metadata: Metadata = {
  title: { default: 'DropBin — Drop. Share. Done.', template: '%s | DropBin' },
  description: "Share files in seconds. Fast, temporary file sharing, made effortless. Upload any file via drag or drop, and get a shareable secure link instantly. Files auto-delete so you never have to clean up.",
  authors: [{ name: "DropBin by Munachi", url: "https://github.com/munachi-prime/dropbin.git" }],
  icons: "/dropbin_icon.png",
  
  openGraph: {
    type: "website",
    title: "DropBin — Drop. Share. Done.",
    description: "Share files in seconds. Fast, temporary file sharing, made effortless. Upload any file via drag or drop, and get a shareable secure link instantly. Files auto-delete so you never have to clean up.",
  }
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

const space_grotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrains_mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${space_grotesk.variable} ${inter.variable} ${jetbrains_mono.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col`}>
        <ToastProvider>
          <input type="checkbox" id="theme" className="hidden" />
          <div className="root">
            <Nav />
            {children}
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}