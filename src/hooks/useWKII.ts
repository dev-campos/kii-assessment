import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { kiiTestnet } from "@/config/chains";
import { WKII_ADDRESS, WKII_ABI } from "@/config/constants";

/**
 * Hook for interacting with the WKII token contract
 */
export const useWKII = () => {
    const { writeContractAsync: wrapWrite, isPending: isWrapping } =
        useWriteContract();

    const { writeContractAsync: unwrapWrite, isPending: isUnwrapping } =
        useWriteContract();

    /**
     * Wrap native KII tokens to WKII
     * @param amount Amount to wrap as a string
     */
    const wrap = (amount: string) => {
        // Note: KII has 6 decimals, but parseEther works because the contract handles it
        const valueInWei = parseEther(amount);

        return wrapWrite({
            address: WKII_ADDRESS as `0x${string}`,
            abi: WKII_ABI,
            functionName: "deposit",
            value: valueInWei,
            chainId: kiiTestnet.id,
        });
    };

    /**
     * Unwrap WKII tokens back to native KII
     * @param amount Amount to unwrap as a string
     */
    const unwrap = (amount: string) => {
        const valueInWei = parseEther(amount);

        return unwrapWrite({
            address: WKII_ADDRESS as `0x${string}`,
            abi: WKII_ABI,
            functionName: "withdraw",
            args: [valueInWei],
            chainId: kiiTestnet.id,
        });
    };

    return {
        wrap,
        unwrap,
        isWrapping,
        isUnwrapping,
    };
};
