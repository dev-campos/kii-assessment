// Mock hooks
import { vi } from "vitest";

export const useAppKitAccountMock = {
    address: "0x1234567890123456789012345678901234567890",
    isConnected: true,
};

export const useTokenBalancesMock = {
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
};

export const useWKIIMock = {
    wrap: vi.fn().mockResolvedValue("0xtransactionhash"),
    unwrap: vi.fn().mockResolvedValue("0xtransactionhash"),
    isWrapping: false,
    isUnwrapping: false,
};
