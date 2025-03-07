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
            <head>{/* Font is loaded via next/font/google */}</head>
            <body className={montserrat.className}>
                <ContextProvider cookies={cookies}>{children}</ContextProvider>
            </body>
        </html>
    );
}
