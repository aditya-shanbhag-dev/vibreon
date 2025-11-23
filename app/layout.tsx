import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Background from "@/components/background";

export const metadata: Metadata = {
  title: "Vibreon - Music Video Generator",

  description: `Create aesthetic music videos with audio effects, HD visuals, lyrics, and more. Upload an MP3 
    or YouTube link, choose an effect, pick a theme for the background, and generate stunning videos instantly.`,

  keywords: ["Vibreon", "AI music video generator", "audio effects", "FFmpeg", "yt-dlp", "slowed reverb", "nightcore",
    "8D audio", "cloudinary", "pexels", "ai subtitles", "music visualizer", "video editor", "lofi"],

  authors: [{ name: "Vibreon", url: "https://vibreon.vercel.app" }],

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    url: "https://vibreon.vercel.app",
    type: "website",
    title: "Vibreon - Music Video Generator",
    description: `Create aesthetic music videos with audio effects, HD visuals, lyrics, and more. Upload an MP3 
      or YouTube link, choose an effect, pick a theme for the background, and generate stunning videos instantly.`,
    images: [
      {
        url: "https://vibreon.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Vibreon - Music Video Generator",
    description: `Create aesthetic music videos with audio effects, HD visuals, lyrics, and more. Upload an MP3 
      or YouTube link, choose an effect, pick a theme for the background, and generate stunning videos instantly.`,
    images: ["https://vibreon.vercel.app/og.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative min-h-screen mx-auto w-full bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          <div className="max-w-7xl min-h-screen mx-auto w-full flex flex-col">
            <Header />
            {children}
            <Footer />
            <Toaster />
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}