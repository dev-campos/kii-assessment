import { defineChain } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Define KiiChain Testnet
export const kiiTestnet = defineChain({
    id: 1336,
    caipNetworkId: "eip155:1336",
    chainNamespace: "eip155",
    name: "KiiChain Testnet",
    nativeCurrency: {
        decimals: 6,
        name: "KII",
        symbol: "KII",
    },
    rpcUrls: {
        default: {
            http: ["https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/"],
        },
    },
    blockExplorers: {
        default: { name: "KiiScan", url: "https://testnet.kiiscan.io" },
    },
});

// Export all chains
export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [kiiTestnet];
