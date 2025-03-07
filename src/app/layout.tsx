import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { headers } from "next/headers"; // added
import "./globals.css";
import ContextProvider from "@/context";

// Initialize the Montserrat font
const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700"],
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
    title: "AppKit in Next.js + wagmi",
    description: "AppKit example dApp",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersData = await headers();
    const cookies = headersData.get("cookie");

    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={montserrat.className}>
                <ContextProvider cookies={cookies}>{children}</ContextProvider>
            </body>
        </html>
    );
}
