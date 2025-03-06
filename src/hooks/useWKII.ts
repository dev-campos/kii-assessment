import { useWriteContract } from "wagmi";
import { parseEther } from "viem";

const WKII_ADDRESS = "0xd51e7187e54a4A22D790f8bbDdd9B54b891Bc920";
const WKII_ABI = [
    {
        inputs: [],
        name: "deposit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

export const useWKII = () => {
    const { writeContract: wrapWrite, isPending: isWrapping } =
        useWriteContract();
    const { writeContract: unwrapWrite, isPending: isUnwrapping } =
        useWriteContract();

    return {
        wrap: (amount: string) =>
            wrapWrite({
                abi: WKII_ABI,
                address: WKII_ADDRESS,
                functionName: "deposit",
                value: parseEther(amount),
            }),
        isWrapping,
        unwrap: (amount: string) =>
            unwrapWrite({
                abi: WKII_ABI,
                address: WKII_ADDRESS,
                functionName: "withdraw",
                args: [parseEther(amount)],
            }),
        isUnwrapping,
    };
};
