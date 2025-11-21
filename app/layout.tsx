import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Background from "@/components/background";

export const metadata: Metadata = {
  title: "Vibreon — Music Video Generator",
  description: `Create aesthetic AI-powered music videos with audio effects, HD visuals, lyrics, and more. 
                Upload an MP3 or YouTube link, choose an effect, pick a theme, and generate stunning videos instantly.`,
  keywords: [
    "Vibreon",
    "AI music video generator",
    "audio effects",
    "FFmpeg",
    "slowed reverb",
    "nightcore",
    "8D audio",
    "cloudinary",
    "pexels",
    "ai subtitles",
    "music visualizer",
    "video editor",
    "lofi",
  ],
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
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}