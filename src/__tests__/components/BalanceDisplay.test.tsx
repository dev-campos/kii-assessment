import React from "react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { BalanceDisplay } from "../../components/BalanceDisplay";

// Mock the imports that cause issues with TextEncoder
vi.mock("viem", () => {
    return {
        parseEther: (value: string) => BigInt(Number(value) * 1e18),
        formatUnits: (value: bigint, decimals: number) =>
            (Number(value) / Math.pow(10, decimals)).toString(),
    };
});

// Mock the hooks we use in the component
vi.mock("@reown/appkit/react", () => ({
    useAppKitAccount: () => ({
        address: "0x1234567890123456789012345678901234567890",
        isConnected: true,
    }),
}));

vi.mock("@/hooks/useTokenBalances", () => ({
    useTokenBalances: () => ({
        nativeBalance: {
            value: BigInt(1e18), // 1 ether in wei
            decimals: 18,
        },
        wkiiBalance: {
            value: BigInt(5e17), // 0.5 ether in wei
            decimals: 18,
        },
        isLoadingNative: false,
        isLoadingWKII: false,
        isErrorNative: false,
        isErrorWKII: false,
        refetch: vi.fn(),
    }),
}));

vi.mock("@/hooks/useWKII", () => ({
    useWKII: () => ({
        wrap: vi.fn().mockResolvedValue("0xtransactionhash"),
        unwrap: vi.fn().mockResolvedValue("0xtransactionhash"),
        isWrapping: false,
        isUnwrapping: false,
    }),
}));

// Mock the web components
beforeAll(() => {
    // Only define if running in browser environment
    if (
        typeof window !== "undefined" &&
        typeof customElements !== "undefined"
    ) {
        if (!customElements.get("appkit-button")) {
            customElements.define(
                "appkit-button",
                class extends HTMLElement {
                    connectedCallback() {
                        this.innerHTML = "<button>Wallet</button>";
                    }
                }
            );
        }
    }
});

// Simplified test that verifies the component renders without breaking
describe("BalanceDisplay Component", () => {
    it("renders without crashing", () => {
        // Mock customElements if not in browser environment
        if (
            typeof window === "undefined" ||
            typeof customElements === "undefined"
        ) {
            global.customElements = {
                get: () => undefined,
                define: () => {},
            } as unknown as CustomElementRegistry;
        }

        const { container } = render(<BalanceDisplay />);
        expect(container).toBeDefined();
    });
});
