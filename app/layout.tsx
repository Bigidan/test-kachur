import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import MainHeaderBar from "@/components/navigation/main-header-bar";
import { Toaster} from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Студія Качур",
  description: "Сайт комади \"Студія Качур\"",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

    <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        storageKey="kachur-site-theme"
    >

        {children}


        <Toaster/>
    </ThemeProvider>
    </body>
    </html>
  );
}

