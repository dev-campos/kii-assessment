// Mock viem's functions
export const parseEther = (value: string) => BigInt(Number(value) * 1e18);
export const formatUnits = (value: bigint, decimals: number) =>
    (Number(value) / Math.pow(10, decimals)).toString();
