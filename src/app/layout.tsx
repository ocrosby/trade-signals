import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Trade Signals - Bollinger Bands Analysis",
    description: "Professional trading signals using Bollinger Bands and technical analysis for multiple asset classes",
    keywords: "trading, signals, bollinger bands, technical analysis, stocks, crypto, forex",
    authors: [{ name: "Trade Signals Team" }],
    viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <Providers>
                    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                        <Sidebar />
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <Header />
                            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                                <div className="container mx-auto px-6 py-8">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
