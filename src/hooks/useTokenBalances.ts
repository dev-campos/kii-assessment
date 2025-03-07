import { useQuery } from "@tanstack/react-query";
import { useBalance } from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { kiiTestnet } from "@/config/chains";
import { formatUnits } from "viem";
import {
    WKII_ADDRESS,
    WKII_TOKEN,
    POLLING_INTERVAL,
    BALANCE_OF_ABI,
} from "@/config/constants";

/**
 * Custom hook to fetch and manage token balances
 */
export const useTokenBalances = () => {
    const { address, isConnected } = useAppKitAccount();

    // Load native token balance
    const {
        data: nativeBalance,
        isLoading: isLoadingNative,
        error: errorNative,
        isError: isErrorNative,
        refetch: refetchNative,
    } = useBalance({
        address: address as `0x${string}` | undefined,
        query: {
            enabled: !!address && isConnected,
            refetchInterval: POLLING_INTERVAL,
            retry: false,
        },
    });

    // Load WKII token balance
    const {
        data: wkiiBalance,
        isLoading: isLoadingWKII,
        error: errorWKII,
        isError: isErrorWKII,
        refetch: refetchWKII,
    } = useBalance({
        address: address as `0x${string}` | undefined,
        token: WKII_TOKEN.address as `0x${string}`,
        query: {
            enabled: !!address && isConnected,
            refetchInterval: POLLING_INTERVAL,
            retry: false,
        },
    });

    /**
     * Backup method for fetching WKII balance when primary method fails
     */
    const {
        data: backupWkiiBalance,
        isLoading: isLoadingBackup,
        refetch: refetchBackup,
    } = useQuery({
        queryKey: ["wkiiBalanceBackup", address],
        queryFn: async () => {
            if (!address || !isConnected) return null;
            if (!isErrorWKII) return null;

            // Create a direct JSON-RPC request to call balanceOf
            const payload = {
                method: "eth_call",
                params: [
                    {
                        to: WKII_ADDRESS,
                        data: `0x70a08231000000000000000000000000${address.replace(
                            "0x",
                            ""
                        )}`,
                    },
                    "latest",
                ],
                id: 1,
                jsonrpc: "2.0",
            };

            try {
                const rpcUrl = kiiTestnet.rpcUrls.default.http[0];

                const response = await fetch(rpcUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();
                if (result.error) {
                    throw new Error(
                        result.error.message ?? "Failed to fetch WKII balance"
                    );
                }

                const balanceHex = result.result;
                const balanceValue = BigInt(balanceHex);
                const formatted = formatUnits(
                    balanceValue,
                    WKII_TOKEN.decimals
                );

                return {
                    value: balanceValue,
                    formatted,
                    decimals: WKII_TOKEN.decimals,
                    symbol: WKII_TOKEN.symbol,
                };
            } catch (error) {
                console.error("Backup WKII balance fetch failed:", error);
                return null;
            }
        },
        enabled: !!address && isConnected && isErrorWKII,
        refetchInterval: POLLING_INTERVAL,
    });

    // Log errors to console
    if (isErrorNative) {
        console.error("Error loading native balance:", errorNative);
    }

    if (isErrorWKII) {
        console.error("Error loading WKII balance:", errorWKII);
    }

    // Use backup WKII balance if primary method fails
    const finalWkiiBalance = isErrorWKII ? backupWkiiBalance : wkiiBalance;
    const finalLoadingWKII = isErrorWKII ? isLoadingBackup : isLoadingWKII;

    // Combined refetch function that refreshes all balances
    const refetch = async () => {
        try {
            // Always refetch native balance
            await refetchNative();

            // If using backup, refetch backup, otherwise refetch WKII
            if (isErrorWKII) {
                await refetchBackup();
            } else {
                await refetchWKII();
            }
        } catch (error) {
            console.error("Error refetching balances:", error);
        }
    };

    return {
        nativeBalance,
        wkiiBalance: finalWkiiBalance,
        isLoadingNative,
        isLoadingWKII: finalLoadingWKII,
        isErrorNative,
        isErrorWKII,
        refetch, // Export the refetch function
    };
};
