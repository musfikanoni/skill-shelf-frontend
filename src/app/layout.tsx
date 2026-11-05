import type { Metadata } from "next";
import { DM_Sans, Inter, Nunito, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ReduxProvider from "@/redux/Provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SkillShelf - Learn · Watch · Grow",
    template: "%s | SkillShelf",
  },
  description: "Learn · watch · grow - Discover Premium Digital Products & Online Courses",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable} ${roboto.variable} ${nunito.variable}`}
    >
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          <Toaster position="top-center" expand={true} richColors />
          <div className="bg-gray-100 min-h-screen">
            {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
