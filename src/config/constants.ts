/**
 * Global constants for the application
 * Contains contract addresses, ABIs, and configuration values
 */

// Default WKII contract address as fallback
const DEFAULT_WKII_ADDRESS = "0xd51e7187e54a4A22D790f8bbDdd9B54b891Bc920";

/**
 * WKII token contract address
 * Cast to the correct type for viem/wagmi compatibility
 */
export const WKII_ADDRESS = (process.env.NEXT_PUBLIC_WKII_ADDRESS ??
    DEFAULT_WKII_ADDRESS) as `0x${string}`;

/**
 * WKII token metadata
 */
export const WKII_TOKEN = {
    address: WKII_ADDRESS,
    name: "Wrapped KII",
    symbol: "WKII",
    decimals: 6,
};

/**
 * ABI for the WKII contract
 */
export const WKII_ABI = [
    // deposit function
    {
        inputs: [],
        name: "deposit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    // withdraw function
    {
        inputs: [
            {
                name: "wad",
                type: "uint256",
            },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    // balanceOf function
    {
        inputs: [
            {
                name: "",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;

// Polling interval for balance updates in milliseconds
export const POLLING_INTERVAL = 5000;

/**
 * ABI fragment for balanceOf function
 */
export const BALANCE_OF_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
