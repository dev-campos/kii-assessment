import { defineChain } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

/**
 * Default RPC URL for KII testnet
 * Used as fallback when environment variable is not set
 */
const DEFAULT_RPC_URL =
    "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/";

/**
 * RPC URL for connecting to the KII testnet
 * Reads from environment variable or falls back to default
 */
const RPC_URL = process.env.NEXT_PUBLIC_KII_TESTNET_RPC ?? DEFAULT_RPC_URL;

/**
 * KII Testnet chain configuration
 */
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
            http: [RPC_URL],
        },
        public: {
            http: [RPC_URL],
        },
    },
    blockExplorers: {
        default: {
            name: "KiiScan",
            url: "https://testnet.kiiscan.io",
        },
    },
    blockTime: 3,
    testnet: true,
});

/**
 * Export all chains used in the application
 */
export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [kiiTestnet];
