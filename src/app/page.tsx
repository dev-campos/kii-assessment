// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { BalanceDisplay } from "@/components/BalanceDisplay";
import Image from "next/image";

export default function Home() {
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
                <section className="connect-section">
                    <h2>Connect Your Wallet</h2>
                    <ConnectButton />
                </section>

                <BalanceDisplay />
            </main>

            <footer className="footer">
                <p>KII Frontend Assessment</p>
            </footer>
        </div>
    );
}
