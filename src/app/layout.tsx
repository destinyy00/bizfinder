import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BizFinder",
  description: "Find and manage local businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try{
                  var key='bizfinder-theme';
                  var t=localStorage.getItem(key);
                  if(!t){localStorage.setItem(key,'dark');t='dark'}
                  if(t==='dark'){document.documentElement.classList.add('dark')} else {document.documentElement.classList.remove('dark')}
                }catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="bizfinder-theme">
          <header className="border-b sticky top-0 z-40 bg-white dark:bg-black text-gray-900 dark:text-white">
            <div className="container py-3">
              <Nav />
            </div>
          </header>
          <div className="container">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
