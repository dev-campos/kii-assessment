"use client";

// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { BalanceDisplay } from "@/components/BalanceDisplay";
import { useAppKitAccount } from "@reown/appkit/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Home() {
    const { isConnected, address } = useAppKitAccount();

    // Use React Query to handle the loading state
    const { isLoading } = useQuery({
        queryKey: ["walletConnection", address],
        queryFn: async () => {
            // This is just a placeholder function that returns the connection state
            // The important part is that React Query will handle the loading state
            return { isConnected };
        },
        // Don't refetch this query too often
        staleTime: 30000,
    });

    return (
        <div className="container">
            <header className="header">
                <Image
                    src="/assets/images/LogoWhite_Kii_2024.png"
                    alt="KII"
                    width={120}
                    height={60}
                    priority
                />
                <h1>KII Testnet Wrapper</h1>
            </header>

            <main className="main">
                {isLoading ? (
                    <section className="loading-section">
                        <div className="spinner"></div>
                        <p>Checking wallet connection...</p>
                    </section>
                ) : (
                    <>
                        {!isConnected && (
                            <section className="connect-section">
                                <h2>Connect Your Wallet</h2>
                                {/* @ts-expect-error Web component */}
                                <appkit-button />
                            </section>
                        )}

                        <BalanceDisplay />
                    </>
                )}
            </main>

            <footer className="footer">
                <p>KII Frontend Assessment</p>
            </footer>
        </div>
    );
}
